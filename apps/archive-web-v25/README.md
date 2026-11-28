# NigeriaStack v2.5 archive HTML

This local review renderer takes the immutable webcopy ZIP and the corrected route index from the 24 November 2026 architecture package. It is independent of the active website build. The generated files carry `noindex, nofollow`. Keep them on a local or access-controlled surface.

Use Python 3 with PyYAML and lxml, and Pandoc 3 or 2.17 with GFM support. Run the following from the website repository with paths to the audited source files.

```sh
python apps/archive-web-v25/build.py \
  "/path/to/NigeriaStack-Master-Webcopy-934-Routes.zip" \
  "/path/to/corrected-route-index-CANDIDATE.json" \
  "/path/to/new-output-directory" \
  --receipt "/path/to/render-receipt.json"
```

The output directory must be new. The renderer checks the exact archive SHA-256, manifest shape, chosen page hashes and canonical URLs before generating HTML. It renders the marked public body and preserves each page's structured-data block, title, description, canonical URL and H1. The shell adds navigation, keyboard landmarks, a table of contents and a DIGITECO footer.

The 960 manifest entries resolve to 955 standalone HTML pages, four governance fragments and a second source for the existing RFC-004 URL. The corrected index binds RFC-004 to the core RFC source. Four hash corrections are recorded against the governance parent Markdown. The receipt also records the conformance fragment bound to the archived payload-input heading.

The review audience sees English archive copy and the local functions described below. Independent browser and accessibility evidence is tracked separately from the renderer's route and source checks.

## Option 1 candidate

The shared layout uses the approved wordmark and colours, with three homepage tasks, two Atlas entry points and responsive section navigation. Search reads the same versioned JSON returned by the read-only discovery endpoint `GET /api/v1/index.json`. It ranks exact identifiers first, accepts diacritic-insensitive queries, and supports scoped state and council searches. Directory links remain available without JavaScript.

The conformance page checks the shape and SHA-256 digest of synthetic JSON in the browser. Receipts are unsigned, contain no submitted document, and cover the local check. The page and references to it describe this scope.

Run the build with the receipt outside the output directory. The build accepts only the approved archive digest, extracts explicitly marked public copy, projects allowed fields into the search index, and rejects unexpected output files, links and internal copy markers. The receipt binds every serving file. Before saving a Sites version, compare the actual package against that receipt:

```sh
python apps/archive-web-v25/verify_package.py /path/to/site.tar.gz /path/to/receipt.json PROJECT_ID
```

## Task-first review successor

Add `--review` to build the approved 955-URL design candidate from the same immutable archive and corrected route index. The current archive-only mode remains available for provenance comparisons. The successor applies the 26 November corrective decisions and the footer placement instruction.

```sh
PYTHONDONTWRITEBYTECODE=1 python apps/archive-web-v25/build.py \
  /path/to/NigeriaStack-Master-Webcopy-934-Routes.zip \
  /path/to/corrected-route-index-CANDIDATE.json \
  /path/to/new-review-output \
  --receipt /path/to/review-build-receipt.json --review
```

`review_copy.py` holds the senior copywriter’s reviewed English content. `review_data.py` binds the core RFCs to 14 independently read back Git blobs and matches the governed industry and Atlas sources by stable record identity. `parent_review.py` renders seven distinct task surfaces, the contextual record views, the archive compatibility anchors and the four supporting collection pages. `review.css` consumes canonical design tokens. `review.mjs` handles the filters, stateful returns, disclosures and local draft. Per-collection index files are generated from the same records as shared search. Check claims remain scoped to the sample digest comparator or primary reference.

Every review route carries its original canonical URL. The full institutional notice appears in fine print after shared footer links on the seven parents. Institutional source attribution and each record’s actual status remain available throughout the corpus. The full notice is excluded from child pages. All six Working Groups remain in-page records on Governance with their own fragment. The local contribution draft has neither an intake endpoint nor a submission state.

Validate the actual candidate with complete route and fragment coverage, four parent viewports, native zoom, keyboard journeys, spoken assistive-technology evidence, reviewed locales and representative task evaluation. The build receipt establishes the checked serving files. It does not establish reviewed locales, operational services or public release authority.

The brand and webcopy revision adds the grouped footer and the optically framed original v2.3 asset. Both rendering modes place the full notice in the seven parent footers. Run the editorial audit against the reviewed output and its build receipt. Pass `--webcopy` when the route-by-route copy export is needed.

```sh
PYTHONDONTWRITEBYTECODE=1 python apps/archive-web-v25/audit_editorial.py /path/to/review-output /path/to/review-build-receipt.json
```
