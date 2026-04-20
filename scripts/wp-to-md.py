#!/usr/bin/env python3
"""Convert WordPress XML export to Astro Markdown content collection files."""

import re
import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
import html2text

XML_PATH = os.path.join(os.path.dirname(__file__), '..', 'kh7alsite.WordPress.2026-04-20.xml')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')

NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp': 'http://wordpress.org/export/1.2/',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
}

CATEGORY_MAP = {
    'wake-island': 'Wake Island',
    'sota': 'SOTA',
    'general-ham': 'General Ham',
    'uncategorized': 'Uncategorized',
}

def slugify_category(cat_nicename):
    return cat_nicename if cat_nicename in CATEGORY_MAP else 'general-ham'

def strip_wp_blocks(html):
    """Remove Gutenberg block comment markers."""
    html = re.sub(r'<!-- /?wp:[^\-].*?-->', '', html)
    return html

def html_to_md(html_content):
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.ignore_images = False
    h.body_width = 0  # no line wrapping
    h.ignore_emphasis = False
    h.protect_links = True
    h.wrap_links = False
    clean = strip_wp_blocks(html_content)
    return h.handle(clean).strip()

def escape_yaml(s):
    if not s:
        return '""'
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    if any(c in s for c in [':', '#', '&', '*', '!', '|', '>', "'", '"', '{', '}', '[', ']', ',', '?']):
        return f'"{s}"'
    return s

def extract_first_image(html_content):
    """Find the first image URL in HTML content."""
    match = re.search(r'src=["\']([^"\']+\.(?:jpg|jpeg|png|gif|webp))["\']', html_content, re.I)
    return match.group(1) if match else None

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    posts = []
    for item in root.iter('item'):
        post_type = item.find('wp:post_type', NS)
        status = item.find('wp:status', NS)
        if post_type is None or post_type.text != 'post':
            continue
        if status is None or status.text != 'publish':
            continue

        title_el = item.find('title')
        title = title_el.text if title_el is not None else 'Untitled'

        slug_el = item.find('wp:post_name', NS)
        slug = slug_el.text if slug_el is not None else 'post'

        date_el = item.find('wp:post_date', NS)
        date_str = date_el.text if date_el is not None else '2025-01-01 00:00:00'
        try:
            pub_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            pub_date = datetime(2025, 1, 1)

        content_el = item.find('content:encoded', NS)
        raw_html = content_el.text if content_el is not None and content_el.text else ''

        excerpt_el = item.find('excerpt:encoded', NS)
        excerpt = excerpt_el.text.strip() if excerpt_el is not None and excerpt_el.text else ''

        # Categories
        cats = []
        tags = []
        for cat in item.findall('category'):
            domain = cat.get('domain', '')
            nicename = cat.get('nicename', '')
            if domain == 'category':
                cats.append(nicename)
            elif domain == 'post_tag':
                tags.append(cat.text or nicename)

        # Primary category for directory organization
        primary_cat = cats[0] if cats else 'uncategorized'
        if primary_cat not in CATEGORY_MAP:
            primary_cat = 'uncategorized'

        hero_image = extract_first_image(raw_html)
        body_md = html_to_md(raw_html)

        posts.append({
            'title': title,
            'slug': slug,
            'date': pub_date,
            'cats': cats,
            'tags': tags,
            'hero': hero_image,
            'excerpt': excerpt,
            'body': body_md,
            'primary_cat': primary_cat,
        })

    print(f'Converting {len(posts)} published posts...')

    for p in posts:
        cat_dir = os.path.join(OUT_DIR, p['primary_cat'])
        os.makedirs(cat_dir, exist_ok=True)

        filename = f"{p['date'].strftime('%Y-%m-%d')}-{p['slug']}.md"
        filepath = os.path.join(cat_dir, filename)

        title_yaml = escape_yaml(p['title'])
        date_yaml = p['date'].strftime('%Y-%m-%d')
        cats_yaml = '[' + ', '.join(f'"{c}"' for c in p['cats']) + ']'
        tags_yaml = '[' + ', '.join(f'"{t}"' for t in p['tags']) + ']'
        hero_yaml = f'"{p["hero"]}"' if p['hero'] else 'null'
        excerpt_yaml = escape_yaml(p['excerpt']) if p['excerpt'] else '""'

        frontmatter = f"""---
title: {title_yaml}
date: {date_yaml}
categories: {cats_yaml}
tags: {tags_yaml}
heroImage: {hero_yaml}
excerpt: {excerpt_yaml}
---

"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter + p['body'])

        print(f'  → {p["primary_cat"]}/{filename}')

    print(f'\nDone. Files written to {OUT_DIR}')

if __name__ == '__main__':
    main()
