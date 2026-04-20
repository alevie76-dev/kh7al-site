#!/usr/bin/env python3
"""Convert Blogger Atom export to Astro Markdown content collection files."""

import re
import os
import xml.etree.ElementTree as ET
from datetime import datetime
import html2text

ATOM_PATH = os.path.expanduser('~/Downloads/Takeout/Blogger/Blogs/KH7AL/feed.atom')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')

NS = {
    'atom': 'http://www.w3.org/2005/Atom',
    'blogger': 'http://schemas.google.com/blogger/2018',
}

CATEGORY_KEYWORDS = {
    'sota': ['sota', 'summit', 'activation', 'w7u', 'w7m', 'w0c', 'kh6/oh', 'w6/', 'w4/'],
    'wake-island': ['kh9', 'wake island', 'wake-island'],
    'general-ham': ['ham', 'radio', 'aprs', 'qsl', 'ft8', 'cw', 'antenna', 'raspberry pi', 'hf'],
}

def classify(title, tags):
    combined = (title + ' ' + ' '.join(tags)).lower()
    if any(k in combined for k in CATEGORY_KEYWORDS['wake-island']):
        return 'wake-island'
    if any(k in combined for k in CATEGORY_KEYWORDS['sota']):
        return 'sota'
    return 'general-ham'

def slugify(filename_path):
    """Turn Blogger's /2014/04/some-title.html into a clean slug."""
    base = os.path.basename(filename_path)
    return re.sub(r'\.html$', '', base)

def extract_first_image(html_content):
    match = re.search(r'src=["\']([^"\']+\.(?:jpg|jpeg|png|gif|webp))["\']', html_content, re.I)
    return match.group(1) if match else None

def escape_yaml(s):
    if not s:
        return '""'
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    if any(c in s for c in [':', '#', '&', '*', '!', '|', '>', "'", '"', '{', '}', '[', ']', ',', '?']):
        return f'"{s}"'
    return s

def html_to_md(html_content):
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0
    h.protect_links = True
    h.wrap_links = False
    return h.handle(html_content).strip()

def main():
    tree = ET.parse(ATOM_PATH)
    root = tree.getroot()

    entries = root.findall('atom:entry', NS)
    posts = []
    for e in entries:
        # Must have a filename (real posts only — filters out reader comments)
        filename_el = e.find('blogger:filename', NS)
        if filename_el is None or not filename_el.text:
            continue

        status = e.find('blogger:status', NS)
        if status is not None and status.text != 'LIVE':
            continue
        content_el = e.find('atom:content', NS)
        if content_el is None or not content_el.text:
            continue

        title_el = e.find('atom:title', NS)
        title = (title_el.text or '').strip() if title_el is not None else ''
        if not title:
            # Extract from first heading or bold tag in content
            m = re.search(r'<(?:h[1-4]|b|strong|i)[^>]*>(.*?)</(?:h[1-4]|b|strong|i)>', content_el.text, re.I)
            if m:
                title = re.sub(r'<[^>]+>', '', m.group(1)).strip()
            if not title:
                title = 'Untitled'

        published_el = e.find('atom:published', NS)
        date_str = published_el.text if published_el is not None else '2014-01-01T00:00:00Z'
        pub_date = datetime.strptime(date_str[:19], '%Y-%m-%dT%H:%M:%S')

        filename_el = e.find('atom:filename', NS)
        if filename_el is not None and filename_el.text:
            slug = slugify(filename_el.text)
        else:
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

        tags = [c.get('term', '') for c in e.findall('atom:category', NS)
                if not c.get('term', '').startswith('@')]

        raw_html = content_el.text
        hero = extract_first_image(raw_html)
        body_md = html_to_md(raw_html)
        category = classify(title, tags)

        posts.append({
            'title': title,
            'slug': slug,
            'date': pub_date,
            'category': category,
            'tags': tags,
            'hero': hero,
            'body': body_md,
        })

    print(f'Converting {len(posts)} Blogger posts...')

    for p in posts:
        cat_dir = os.path.join(OUT_DIR, p['category'])
        os.makedirs(cat_dir, exist_ok=True)

        filename = f"{p['date'].strftime('%Y-%m-%d')}-{p['slug']}.md"
        filepath = os.path.join(cat_dir, filename)

        title_yaml = escape_yaml(p['title'])
        cats_yaml = f'["{p["category"]}"]'
        tags_yaml = '[' + ', '.join(f'"{t}"' for t in p['tags']) + ']'
        hero_yaml = f'"{p["hero"]}"' if p['hero'] else 'null'

        frontmatter = f"""---
title: {title_yaml}
date: {p['date'].strftime('%Y-%m-%d')}
categories: {cats_yaml}
tags: {tags_yaml}
heroImage: {hero_yaml}
excerpt: ""
---

"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter + p['body'])

        print(f'  → {p["category"]}/{filename}')

    print(f'\nDone. {len(posts)} posts written to {OUT_DIR}')

if __name__ == '__main__':
    main()
