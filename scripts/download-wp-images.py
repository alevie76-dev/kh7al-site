#!/usr/bin/env python3
"""Download only the WP images referenced in posts from the old Bluehost server."""

import os
import re
import urllib.request
import urllib.error

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'wp-content', 'uploads')

# Use old Bluehost IP to bypass DNS (which now points to Vercel)
OLD_IP = '66.235.200.146'

def find_referenced_images():
    urls = set()
    pattern = re.compile(r'https://kh7al\.site/wp-content/uploads/([^\s)"\'>\]]+)')
    for root, _, files in os.walk(CONTENT_DIR):
        for fname in files:
            if not fname.endswith('.md'):
                continue
            with open(os.path.join(root, fname), encoding='utf-8') as f:
                for m in pattern.finditer(f.read()):
                    urls.add(m.group(1))
    return sorted(urls)

def main():
    refs = find_referenced_images()
    print(f'Downloading {len(refs)} referenced images from old Bluehost server...\n')

    downloaded = 0
    failed = []

    for rel_path in refs:
        dst = os.path.join(PUBLIC_DIR, rel_path)

        if os.path.exists(dst):
            print(f'  skip (exists): {rel_path}')
            downloaded += 1
            continue

        os.makedirs(os.path.dirname(dst), exist_ok=True)

        url = f'http://{OLD_IP}/wp-content/uploads/{rel_path}'
        headers = {'Host': 'kh7al.site'}

        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                with open(dst, 'wb') as f:
                    f.write(resp.read())
            size_kb = os.path.getsize(dst) // 1024
            print(f'  ✓ {rel_path} ({size_kb}KB)')
            downloaded += 1
        except Exception as e:
            print(f'  ✗ {rel_path} — {e}')
            failed.append(rel_path)

    print(f'\nDownloaded: {downloaded}/{len(refs)}')
    if failed:
        print(f'Failed ({len(failed)}):')
        for f in failed:
            print(f'  {f}')

if __name__ == '__main__':
    main()
