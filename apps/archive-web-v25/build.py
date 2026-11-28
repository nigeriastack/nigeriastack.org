#!/usr/bin/env python3
"""Render the reconciled v2.5 review archive to a new static directory."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from functools import partial
from html import escape
import json
from pathlib import Path
import re
from shutil import copyfile
import subprocess
from urllib.parse import unquote, urljoin, urlsplit
from zipfile import ZipFile

from lxml import html
import yaml

from parent_review import COLLECTION_INDEXES, REVIEW_ASSETS, render_review, review_footer, source_notice
from review_copy import PARENT_COPY
from review_data import ReviewData


ARCHIVE_DIGEST = "3b4e0a864a2692c0e2c225cfdc871333b04686ea61da604a9b35e89239b43fcb"
MANIFEST = "Webcopy/control/IA-SITEMAP-MANIFEST-934.json"
BASE_URL = "https://nigeriastack.org"
RFC_PATH = "/rfcs/NS-RFC-004"
RFC_FILE = "Webcopy/rfcs/core-001-to-014/NS-RFC-004.md"
SOURCE_FRAGMENTS = {
    "/governance": {
        "charter": ("h2", "Institutional Charter Overview"),
        "safeguards": ("h2", "Ecosystem Safeguards & Open Licensing"),
        "contribute": ("h2", "Proposal & Contribution Process"),
        "faqs": ("h2", "Common Questions (15 Canonical FAQs)"),
    },
    "/conformance": {
        "test-input": ("h3", "Payload Input and Sandbox Configuration"),
    },
}
NAVIGATION = {
    "/sectors": "Industries",
    "/protocols": "Protocols",
    "/rfcs": "Specifications",
    "/atlas": "Atlas",
    "/governance": "Governance",
    "/search": "Search",
}
ATTRIBUTION = "Digital Economic Development Initiative | DIGITECO"
MARKED_COPY = re.compile(r"<!-- public-copy -->(.*?)<!-- end-public-copy -->", re.S)
GRAPH = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
ROUTE = re.compile(r"/(?:[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*)?")
PAGE_TREE = "h1|h2|h3|h4|h5|h6"
APP = Path(__file__).resolve().parent
REPOSITORY = APP.parents[1]
INDEX_PATH = "api/v1/index.json"
LEGACY_LOCKUP_PATH = "_assets/nigeriastack.png"
LEGACY_LOCKUP_SOURCE = REPOSITORY / "apps/web/src/assets/nigeriastack-lockup.png"
LEGACY_LOCKUP_SHA256 = "6d5978d5856e65e8e50113c8d6457cba32e2e2b14e162ffa1b2dd61866b37292"
REVIEW_LOCKUP_SOURCE = "7d9ed8b28203c8bf3122d35a1ed3cb4a28904c04"
REVIEW_WORDMARK = (
    '<a class="wordmark" href="/" aria-label="NigeriaStack home">'
    '<span class="stack-symbol" aria-hidden="true"><i></i><i></i><i></i></span>'
    '<span>Nigeria<b>Stack</b></span></a>'
)
INTERNAL_COPY = re.compile(
    r"READY_FOR_GITHUB_PUBLICATION|DRAFT_UNPUBLISHED|REVIEW_REQUIRED|"
    r"OWNER_DECISION_REQUIRED|PUBLIC_RELEASE|DO[ _-]NOT[ _-]PUBLISH|"
    r"INTERNAL[ _-]ONLY|\bTODO\b|\bTBD\b|\{copy_slot\}|"
    r"<!--|sourceSha256|review_status|candidate-validation|file://|/workspace/scratch",
    re.I,
)
HOME_TASKS = (
    ("/protocols", "Connect systems", "Find protocols for consent, data exchange and offline work."),
    ("/conformance", "Verify an implementation", "Run a reference check and inspect what the result covers."),
    ("/atlas", "Explore local services", "Look up a jurisdiction and see the records and standards linked to it."),
)
ATLAS_TASKS = (
    ("/atlas/states", "Start with a state or the FCT", "Find a jurisdiction, then open its profile and council directory."),
    ("/atlas/lga-774", "Start with a council", "Find a local government area or an FCT area council by name."),
)
SEARCH_SCOPES = {
    "/search": ("all", "Search by name, topic or identifier"),
    "/atlas/states": ("states", "Find a state or the FCT"),
    "/atlas/lga-774": ("councils", "Find a council"),
}
SEARCH_FORM = """<form class="tool" data-search="{scope}" role="search" aria-label="{label}">
<label for="query">{label}</label>
<div class="controls"><input id="query" name="q" type="search" maxlength="120" required>
<button type="submit">Search</button></div>
<p role="status" data-status></p>
<ol data-results></ol>
<noscript><p>Search needs JavaScript. Use the directory links below to browse.</p></noscript>
</form>"""
VERIFIER = """<form class="tool" id="local-verifier" aria-label="Synthetic payload check">
<p id="test-scope">Check synthetic JSON and its SHA-256 digest in your browser. The check uses no external service. Use test data only.</p>
<label for="test-payload">Synthetic JSON payload</label>
<textarea id="test-payload" rows="7" maxlength="8192" aria-describedby="test-scope" required></textarea>
<div class="controls">
<button type="button" data-example>Load an example</button>
<button type="submit">Run the check</button>
<button type="button" data-receipt hidden>Download receipt</button>
</div>
<p role="status" data-status></p>
<noscript><p>The local check needs JavaScript.</p></noscript>
</form>"""


def body_for_local_scope(route, body):
    if route == "/conformance":
        return body.partition("# Test an integration rule")[0] + """
# Test an integration rule

Run a local reference check on a synthetic payload to see how a receiving system can detect a changed document.

[Browse technical specifications](/rfcs) · [Explore developer guides](/protocols)

## Test Execution & Input Control

### Payload Input and Sandbox Configuration

## Results & Cryptographic Audit Receipts

The receipt records the payload shape and digest checks. It covers the supplied test data and is unsigned.
"""
    return (body.replace(" or execute live trace checks against reference sandbox nodes", "")
            .replace("Run schema and sandbox checks", "Run a synthetic reference check"))


def search_record(route, title, headings):
    kind = ""
    identifier = ""
    if route.startswith("/rfcs/"):
        kind, identifier = "specifications", route.rsplit("/", 1)[1]
    elif route.startswith("/atlas/states/"):
        kind, identifier = "states", route.rsplit("/", 1)[1]
    elif route.startswith("/atlas/lga-774/"):
        kind, identifier = "councils", route.rsplit("/", 1)[1]
    elif route.startswith("/sectors/"):
        kind, identifier = "industries", route.rsplit("/", 1)[1]
    elif route.startswith("/protocols/lga-governance-stack/"):
        kind, identifier = "municipal", route.rsplit("/", 1)[1][:6].upper()
    else:
        kind = "guides"
    return {"url": route, "title": title, "id": identifier, "kind": kind,
            "headings": [node.text_content() for node in headings]}


def add_interface(root, route, headings):
    h1 = next(node for node in headings if node.tag == "h1")
    lead = h1.getnext()
    notice = root[0]
    require(notice.tag == "blockquote", f"Archive opening notice missing at {route}")
    if route in {"/", "/atlas"}:
        tasks = HOME_TASKS if route == "/" else ATLAS_TASKS
        label = "Get started" if route == "/" else "Choose a directory"
        links = "".join(
            f"<li>{link(url, title)}<p>{escape(description)}</p></li>"
            for url, title, description in tasks
        )
        entry = html.fragment_fromstring(
            f'<nav class="tasks" aria-label="{label}"><ul>{links}</ul></nav>'
        )
        lead.addnext(entry)
    elif route in SEARCH_SCOPES:
        scope, label = SEARCH_SCOPES[route]
        entry = html.fragment_fromstring(SEARCH_FORM.format(scope=scope, label=label))
        lead.addnext(entry)
    elif route == "/conformance":
        entry = html.fragment_fromstring(VERIFIER)
        root.get_element_by_id("test-input").addnext(entry)
    else:
        entry = lead
    root.remove(notice)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def check_manifest(archive, index):
    entries = json.loads(archive.read(MANIFEST))["routes"]
    pages = index["pages"]
    anchors = index["anchors"]
    standalone = [row for row in entries if "#" not in row["route"]]
    page_paths = {row["route"] for row in pages}
    route_counts = Counter(row["route"] for row in standalone)
    require(len(archive.namelist()) == 960, "Unexpected archive member count")
    require(len(entries) == 960 and len({row["route"] for row in entries}) == 959,
            "Unexpected original manifest shape")
    require(len(pages) == len(page_paths) == index["pageCount"] == 955, "Expected 955 pages")
    require(len(anchors) == index["anchorCount"] == 4, "Expected four anchors")
    require(set(route_counts) == page_paths, "Corrected index changes standalone route set")
    require({path: count for path, count in route_counts.items() if count != 1} == {RFC_PATH: 2},
            "Unexpected standalone duplicate")
    require(next(row["file"] for row in pages if row["route"] == RFC_PATH) == RFC_FILE,
            "The RFC-004 binding differs from the reconciliation")
    original_pages = {(row["route"], row["file"]): row for row in standalone}
    for row in pages:
        original = original_pages[row["route"], row["file"]]
        require(all(row[key] == original[key] for key in ("canonical_url", "h1", "sha256")),
                f"Page index differs from original manifest at {row['route']}")
    original_anchors = {row["route"]: row for row in entries if "#" in row["route"]}
    require(set(original_anchors) == {row["route"] for row in anchors}
            == {f"/governance#{anchor}" for anchor in SOURCE_FRAGMENTS["/governance"]},
            "Unexpected anchors")
    governance = next(row for row in pages if row["route"] == "/governance")
    corrections = []
    for row in anchors:
        original = original_anchors[row["route"]]
        require(row["file"] == original["file"] == governance["file"]
                and row["canonical_url"] == original["canonical_url"]
                and row["sha256"] == governance["sha256"] != original["sha256"],
                f"Unexpected governance binding at {row['route']}")
        corrections.append({
            "route": row["route"],
            "originalSha256": original["sha256"],
            "sourceSha256": row["sha256"],
        })
    excluded = sorted(set(original_pages) - {(row["route"], row["file"]) for row in pages})
    return corrections, excluded


def read_page(archive, row):
    route = row["route"]
    require(ROUTE.fullmatch(route), f"Unsafe route {route}")
    source = archive.read(row["file"])
    require(sha256(source).hexdigest() == row["sha256"], f"Archive hash mismatch at {route}")
    document = source.decode()
    front_matter = document.split("---\n", 2)
    require(len(front_matter) == 3 and not front_matter[0], f"Missing metadata at {route}")
    metadata = yaml.safe_load(front_matter[1])
    require(metadata["route"] == route and metadata["canonical_url"] == BASE_URL + route,
            f"Archive metadata route mismatch at {route}")
    require(metadata["attribution"] == f"{ATTRIBUTION} (https://digiteco.org)",
            f"Archive attribution mismatch at {route}")
    body = MARKED_COPY.findall(front_matter[2])
    graphs = GRAPH.findall(front_matter[2])
    require(len(body) == len(graphs) == 1, f"Unexpected content boundaries at {route}")
    require("@graph" in json.loads(graphs[0]), f"Missing structured graph at {route}")
    return row, metadata, body[0], graphs[0]


def link(url, label, current=None):
    state = ' aria-current="page"' if url == current else ""
    return f'<a href="{escape(url)}"{state}>{escape(label)}</a>'


def navigation(route, review=False):
    destinations = dict(NAVIGATION)
    if review:
        destinations = {"/": "Home", **destinations, "/conformance": "Check a sample"}
    return "".join(link(path, label, route) for path, label in destinations.items())


def render_page(page, review=None):
    row, metadata, body, graph = page
    route = row["route"]
    converted = subprocess.run(
        ["pandoc", "-f", "gfm+raw_html-smart", "-t", "html5", "--wrap=none"],
        input=body if review else body_for_local_scope(route, body), text=True, capture_output=True, check=True,
    ).stdout
    root = html.fragment_fromstring(converted, create_parent="div")
    headings = root.xpath("|".join(f".//{tag}" for tag in PAGE_TREE.split("|")))
    require([node.text_content() for node in headings if node.tag == "h1"] == [row["h1"]],
            f"H1 differs from the reconciled manifest at {route}")
    require(not root.xpath(".//script|.//iframe|.//object|.//embed|.//form|.//style"),
            f"Unexpected executable or embedded markup at {route}")
    for node in root.iter():
        require(all(not attribute.lower().startswith("on") for attribute in node.attrib),
                f"Unexpected event attribute at {route}")
    if route in SOURCE_FRAGMENTS:
        for anchor, (tag, heading) in SOURCE_FRAGMENTS[route].items():
            matches = [node for node in headings if node.tag == tag and node.text_content() == heading]
            require(len(matches) == 1, f"Expected one fragment heading at {route}: {heading}")
            matches[0].set("id", anchor)
    footer_notice = ""
    title = metadata["seo_title"]
    description = metadata["meta_description"]
    review_record = None
    if review:
        root, title, description, graph, footer_notice, review_record = render_review(route, root, review, graph)
        headings = root.xpath("|".join(f".//{tag}" for tag in PAGE_TREE.split("|")))
        require(len(root.xpath(".//h1")) == 1, f"Review requires one H1: {route}")
    else:
        footer_notice = source_notice(root) if route in PARENT_COPY else ""
        add_interface(root, route, headings)
    section_headings = [node for node in headings if node.tag == "h2" and node.get("id")]
    contents = "".join(
        f'<li>{link("#" + node.get("id"), node.text_content())}</li>'
        for node in section_headings
    )
    aside = ""
    if not review and contents and route != "/":
        section_nav = '<nav class="contents {position}" aria-label="On this page"><p>On this page</p><ul>{items}</ul></nav>'
        aside = section_nav.format(position="desktop-contents", items=contents)
        inline = html.fragment_fromstring(section_nav.format(position="inline-contents", items=contents))
        if route == "/conformance":
            root.get_element_by_id("local-verifier").addnext(inline)
        else:
            section_headings[0].addprevious(inline)
    urls = [element.get("href") for element in root.xpath(".//a[@href]")]
    for url in urls:
        require(urlsplit(url).scheme.lower() in {"", "http", "https", "mailto", "tel"},
                f"Unexpected URL scheme at {route}")
    ids = [node.get("id") for node in root.xpath(".//*[@id]")]
    require(len(ids) == len(set(ids)), f"Duplicate HTML ids at {route}")
    article = (root.text or "") + "".join(html.tostring(element, encoding="unicode") for element in root)
    style = '<link rel="stylesheet" href="/_assets/archive.css">'
    script = ''
    if review:
        style = '<link rel="stylesheet" href="/_assets/tokens.css"><link rel="stylesheet" href="/_assets/review.css">'
        script = '<script type="module" src="/_assets/review.mjs"></script>'
    if route == "/conformance":
        if not review:
            description = "Check synthetic JSON and its document digest locally in your browser."
        script += '<script type="module" src="/_assets/verifier.mjs"></script>'
    if not review and route in SEARCH_SCOPES:
        script = '<script type="module" src="/_assets/search.mjs"></script>'

    wordmark = REVIEW_WORDMARK if review else (
        f'<a class="wordmark" href="/"><img src="/{LEGACY_LOCKUP_PATH}" width="660" height="110" alt="NigeriaStack"></a>'
    )
    layout = ' class="review"' if review else (' class="landing"' if route == "/" else "")
    footer = review_footer(wordmark, footer_notice, ATTRIBUTION)
    output = f"""<!doctype html>
<html lang="en-NG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{escape(title)}</title>
<meta name="description" content="{escape(description)}">
<link rel="canonical" href="{escape(metadata["canonical_url"])}">
{style}
{script}
<script type="application/ld+json">{graph}</script>
</head>
<body{layout}>
<a class="skip" href="#page-content">Skip to content</a>
<header class="site-header">
  <div class="frame header-inner">
    {wordmark}
    <nav aria-label="Primary">{navigation(route, review)}</nav>
  </div>
</header>
<main class="frame reading-grid" id="page-content" tabindex="-1">
  <article>{article}</article>
  {aside}
</main>
<footer class="site-footer">
  {footer}
</footer>
</body>
</html>
"""
    record = search_record(route, row["h1"], section_headings)
    if review_record:
        record.update(review_record)
    return route, output, ids, urls, Counter(node.tag for node in headings), record


def audit_links(results):
    identifiers = {route: set(ids) | {"page-content"} for route, _, ids, _, _, _ in results}
    invalid = []
    internal = 0
    for route, _, _, links, _, _ in results:
        for link in sorted(set(links)):
            target = urlsplit(urljoin(BASE_URL + route, link))
            if target.netloc.lower() != "nigeriastack.org":
                continue
            internal += 1
            path = unquote(target.path).rstrip("/") or "/"
            fragment = unquote(target.fragment)
            if path not in identifiers or (fragment and fragment not in identifiers[path]):
                invalid.append({"from": route, "href": link, "path": path,
                                "reason": "path" if path not in identifiers else "fragment"})
    return internal, invalid


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("index", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--receipt", type=Path, required=True)
    parser.add_argument("--review", action="store_true", help="Build the approved task-first review experience")
    arguments = parser.parse_args()
    require(not arguments.output.exists(), "Output directory must be new")
    require(sha256(arguments.archive.read_bytes()).hexdigest() == ARCHIVE_DIGEST,
            "The source ZIP differs from the audited v2.5 archive")
    index = json.loads(arguments.index.read_text())
    with ZipFile(arguments.archive) as archive:
        require(archive.testzip() is None, "Source ZIP failed its CRC check")
        corrections, excluded = check_manifest(archive, index)
        pages = [read_page(archive, row) for row in index["pages"]]
    review = ReviewData(index["pages"]) if arguments.review else None
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(partial(render_page, review=review), pages))
    internal, invalid = audit_links(results)
    require(not invalid, f"Unresolved archive links: {invalid[:5]}")
    heading_totals = Counter()
    output_digests = {}
    records = []
    for route, output, _, _, headings, record in results:
        file = arguments.output / route.lstrip("/") / "index.html"
        file.parent.mkdir(parents=True, exist_ok=True)
        data = output.encode()
        file.write_bytes(data)
        output_digests[route] = sha256(data).hexdigest()
        heading_totals.update(headings)
        records.append(record)
    assets = arguments.output / "_assets"
    assets.mkdir()
    stylesheet = "review.css" if review else "archive.css"
    css = (APP / stylesheet).read_bytes()
    (assets / stylesheet).write_bytes(css)
    extras = ("review.mjs",) if review else ("search.mjs",)
    for asset in (*extras, "verifier.mjs"):
        copyfile(APP / asset, assets / asset)
    if review:
        tokens = (REPOSITORY / "design-system/tokens/tokens.css").read_text()
        (assets / "tokens.css").write_text(tokens.split("/* ============================================================================\n * MANDATORY")[0])
    if not review:
        copyfile(LEGACY_LOCKUP_SOURCE, arguments.output / LEGACY_LOCKUP_PATH)
    index_file = arguments.output / INDEX_PATH
    index_file.parent.mkdir(parents=True)
    records.sort(key=lambda entry: entry["url"])
    encoded = json.dumps(records, ensure_ascii=False, separators=(",", ":")).encode()
    index_version = sha256(encoded).hexdigest()
    index_file.write_text(json.dumps({"version": index_version, "locale": "en-NG", "records": records},
                                     ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    if review:
        for name, kinds in COLLECTION_INDEXES.items():
            selected = [record for record in records if record["kind"] in kinds]
            index_file.with_name(f"{name}.json").write_text(json.dumps({"records": selected}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    deploy_files = audit_distribution(arguments.output, set(output_digests), review=bool(review))
    receipt = {
        "publicRelease": False,
        "taskFirstReview": bool(review),
        "sourceArchiveSha256": ARCHIVE_DIGEST,
        "sourceManifestRows": 960,
        "distinctManifestUrls": 959,
        "standalonePages": len(results),
        "governanceAnchors": corrections,
        "linkedHeadingIds": SOURCE_FRAGMENTS,
        "excludedDuplicateBindings": excluded,
        "renderedHeadings": dict(heading_totals),
        "language": "en-NG",
        "municipalModulePages": sum(
            route.startswith("/protocols/lga-governance-stack/lga-") for route in output_digests
        ),
        "distinctInternalLinksPerPage": internal,
        "internalLinksWithoutLocalTarget": invalid,
        "stylesheetSha256": sha256(css).hexdigest(),
        "brand": {"sourceCommit": REVIEW_LOCKUP_SOURCE, "markupSha256": sha256(REVIEW_WORDMARK.encode()).hexdigest()}
        if review else {"legacyImageSha256": LEGACY_LOCKUP_SHA256},
        "renderedPageSha256": output_digests,
        "publicIndexVersion": index_version,
        "deploymentFiles": deploy_files,
    }
    if review:
        from audit_editorial import verify_copy

        verify_copy(arguments.output, receipt)
    arguments.receipt.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n")
    print(f"Rendered {len(results)} pages and {len(corrections)} governance anchors.")
    print(f"Checked {internal} internal links; {len(invalid)} lack a local target.")


def audit_distribution(directory, routes, review=False):
    expected = {f"{route[1:] + '/' if route != '/' else ''}index.html" for route in routes}
    assets = REVIEW_ASSETS if review else ("archive.css", "search.mjs")
    expected.update({INDEX_PATH, "_assets/verifier.mjs", *(f"_assets/{asset}" for asset in assets)})
    if review:
        expected.update(f"api/v1/{name}.json" for name in COLLECTION_INDEXES)
    else:
        expected.add(LEGACY_LOCKUP_PATH)
    files = sorted(path for path in directory.rglob("*") if path.is_file() or path.is_symlink())
    require({path.relative_to(directory).as_posix() for path in files} == expected,
            "Deployable package contains unexpected or missing files")
    result = {}
    for path in files:
        relative = path.relative_to(directory).as_posix()
        require(path.is_file() and not path.is_symlink(), f"Invalid output file: {relative}")
        data = path.read_bytes()
        if relative == LEGACY_LOCKUP_PATH:
            require(sha256(data).hexdigest() == LEGACY_LOCKUP_SHA256, "Legacy lockup digest mismatch")
        if path.suffix == ".html":
            document = html.fromstring(data)
            notices = document.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' footer-notice ')]")
            route = "/" + relative.removesuffix("index.html").strip("/")
            require(len(notices) == int(route in PARENT_COPY)
                    and all(node.xpath("ancestor::footer") for node in notices), f"Wrong footer notice placement at {route}")
            require(not any("Open Standards & Non-Impersonation Notice" in node.text_content()
                            for node in document.xpath("//header|//main")), f"Notice above footer at {route}")
            for landmark in ("header", "footer"):
                brand = document.xpath(f"//{landmark}//a[@class='wordmark' and @href='/']")
                require(len(brand) == 1, f"Missing or duplicated wordmark in {relative} {landmark}")
                if review:
                    require(html.tostring(brand[0], encoding="unicode", with_tail=False) == REVIEW_WORDMARK,
                            f"Archived v2.3 wordmark differs in {relative} {landmark}")
                else:
                    image = brand[0].find('img')
                    require(image is not None and image.get('src') == '/' + LEGACY_LOCKUP_PATH
                            and image.get('alt') == 'NigeriaStack', f"Legacy wordmark differs in {relative} {landmark}")
        if path.suffix != ".png":
            match = INTERNAL_COPY.search(data.decode())
            require(match is None, f"Internal copy in {relative}: {match.group() if match else ''}")
        result[relative] = sha256(data).hexdigest()
    return result


if __name__ == "__main__":
    main()
