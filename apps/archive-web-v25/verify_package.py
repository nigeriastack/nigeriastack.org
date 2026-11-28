#!/usr/bin/env python3
"""Compare a Sites archive to the audited output before saving it."""

import argparse
from hashlib import sha256
import json
from pathlib import Path, PurePosixPath
from tarfile import open as open_tar

from build import INTERNAL_COPY, require


def verify_package(archive_path, receipt_path, project_id):
    expected = json.loads(receipt_path.read_text())["deploymentFiles"]
    files = {}
    manifest = "dist/.openai/hosting.json"
    with open_tar(archive_path, "r:gz") as archive:
        for item in archive:
            path = PurePosixPath(item.name)
            require(path.parts and path.parts[0] == "dist" and ".." not in path.parts,
                    f"Unexpected package path: {item.name}")
            if item.isdir():
                continue
            require(item.isreg() and item.name not in files, f"Invalid package entry: {item.name}")
            files[item.name] = item
        possible_paths = ("dist", "dist/public")
        surface = next((prefix for prefix in possible_paths
                        if set(files) == {f"{prefix}/{name}" for name in expected} | {manifest}), None)
        require(surface is not None, "Package differs from the audited file allowlist")
        hosting = json.loads(archive.extractfile(files[manifest]).read())
        require(hosting["project_id"] == project_id, "Package belongs to another Site")
        for name, digest in expected.items():
            data = archive.extractfile(files[f"{surface}/{name}"]).read()
            require(sha256(data).hexdigest() == digest, f"Package digest differs: {name}")
            if not name.endswith(".png"):
                require(not INTERNAL_COPY.search(data.decode()), f"Internal copy found: {name}")
    return len(expected)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("receipt", type=Path)
    parser.add_argument("project_id")
    args = parser.parse_args()
    count = verify_package(args.archive, args.receipt, args.project_id)
    print(f"Verified {count} serving files and the Sites project binding.")
