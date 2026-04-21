#!/usr/bin/env python3
"""Copy only the WP images actually referenced in posts into public/wp-content/uploads/."""

import os
import re
import shutil
import sys

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'wp-content', 'uploads')

def find_referenced_images():
    urls = set()
    pattern = re.compile(r'https://kh7al\.site/wp-content/uploads/([^\s)"\'>\]]+)')
    for root, _, files in os.walk(CONTENT_DIR):
        for fname in files:
            if not fname.endswith('.md'):
                continue
            with open(os.path.join(root, fname), encoding='utf-8') as f:
                for m in pattern.finditer(f.read()):
                    urls.add(m.group(1))  # e.g. "2025/01/IMG_1219-scaled.jpeg"
    return sorted(urls)

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 copy-wp-images.py /path/to/extracted/uploads')
        print('  e.g. python3 copy-wp-images.py ~/Downloads/uploads')
        sys.exit(1)

    source_root = os.path.expanduser(sys.argv[1])
    if not os.path.isdir(source_root):
        print(f'Error: {source_root} is not a directory')
        sys.exit(1)

    refs = find_referenced_images()
    print(f'Found {len(refs)} referenced images in posts\n')

    copied = 0
    missing = []

    for rel_path in refs:
        src = os.path.join(source_root, rel_path)
        dst = os.path.join(PUBLIC_DIR, rel_path)

        if not os.path.exists(src):
            missing.append(rel_path)
            continue

        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1
        print(f'  ✓ {rel_path}')

    print(f'\nCopied: {copied}')
    if missing:
        print(f'Missing ({len(missing)}):')
        for m in missing:
            print(f'  ✗ {m}')

if __name__ == '__main__':
    main()
