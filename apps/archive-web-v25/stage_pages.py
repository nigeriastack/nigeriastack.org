#!/usr/bin/env python3
"""Stage the receipt-bound review candidate for protected Cloudflare Pages hosting."""

import argparse
from hashlib import sha256
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from build import require

HEADERS = b'''/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
'''
NOT_FOUND = b'''<!doctype html>
<html lang="en-NG"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Page not found | NigeriaStack</title>
<link rel="stylesheet" href="/_assets/tokens.css">
<link rel="stylesheet" href="/_assets/review.css"></head>
<body class="review"><main class="frame" id="main">
<h1>Page not found</h1>
<p>Check the address, search NigeriaStack or return to the homepage.</p>
<ul><li><a href="/search">Search NigeriaStack</a></li><li><a href="/">Go to the homepage</a></li></ul>
</main></body></html>
'''


def write_package(dist, receipt_path, package, output_receipt):
    receipt_bytes = receipt_path.read_bytes()
    receipt = json.loads(receipt_bytes)
    require(receipt.get('publicRelease') is False, 'A review-serving receipt is required')
    expected = receipt['deploymentFiles']
    paths = {path.relative_to(dist).as_posix(): path for path in dist.rglob('*') if path.is_file()}
    require(set(paths) == set(expected), 'Input is different from the receipt file list')
    members = {}
    for name, path in paths.items():
        require(not path.is_symlink(), f'Symlink is not a serving file: {name}')
        data = path.read_bytes()
        require(sha256(data).hexdigest() == expected[name], f'Serving file changed: {name}')
        members[name] = data
    require('404.html' not in members and '_headers' not in members, 'Unexpected hosting overlay path')
    members.update({'404.html': NOT_FOUND, '_headers': HEADERS})
    with ZipFile(package, 'x', compression=ZIP_DEFLATED) as archive:
        for name, data in sorted(members.items()):
            item = ZipInfo(name)
            item.compress_type = ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            archive.writestr(item, data)
    packaged = {
        'kind': 'protected-cloudflare-pages-candidate',
        'sourceReceiptSha256': sha256(receipt_bytes).hexdigest(),
        'publicRelease': False,
        'archiveSha256': sha256(package.read_bytes()).hexdigest(),
        'fileSha256': {name: sha256(data).hexdigest() for name, data in sorted(members.items())},
    }
    with ZipFile(package) as archive:
        require(archive.testzip() is None and set(archive.namelist()) == set(members), 'Package integrity check failed')
        for name, digest in packaged['fileSha256'].items():
            require(sha256(archive.read(name)).hexdigest() == digest, f'Packaged file changed: {name}')
    with output_receipt.open('x', encoding='utf-8') as handle:
        json.dump(packaged, handle, indent=2)
        handle.write('\n')
    print(f'Verified {len(expected)} serving files and two Cloudflare Pages assets.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dist', type=Path)
    parser.add_argument('source_receipt', type=Path)
    parser.add_argument('package', type=Path)
    parser.add_argument('output_receipt', type=Path)
    args = parser.parse_args()
    write_package(args.dist, args.source_receipt, args.package, args.output_receipt)
