#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlparse
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://metwipe.com"
errors = []
warnings = []

def err(msg):
    errors.append(msg)

def warn(msg):
    warnings.append(msg)

sitemap = ROOT / "sitemap.xml"
if not sitemap.exists():
    err("Missing sitemap.xml")
    urls = []
else:
    try:
        root = ET.parse(sitemap).getroot()
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [(n.text or "").strip() for n in root.findall("s:url/s:loc", ns)]
    except Exception as e:
        err(f"Invalid sitemap.xml: {e}")
        urls = []

seen_titles = {}
seen_canonicals = {}
sitemap_paths = set()

for url in urls:
    if not url.startswith(DOMAIN + "/") and url != DOMAIN + "/":
        err(f"Sitemap URL is off-domain: {url}")
        continue
    path = urlparse(url).path.lstrip("/") or "index.html"
    sitemap_paths.add(path)
    f = ROOT / path
    if not f.exists():
        err(f"Sitemap points to missing file: {path}")
        continue
    if f.suffix.lower() != ".html":
        continue
    text = f.read_text("utf-8", errors="replace")
    def one(pattern):
        m = re.search(pattern, text, re.I | re.S)
        return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""
    title = one(r"<title[^>]*>(.*?)</title>")
    desc = one(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']') or one(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']')
    canonical = one(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']') or one(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']')
    h1s = re.findall(r"<h1\b[^>]*>", text, re.I)
    if not title: err(f"{path}: missing <title>")
    if not desc: err(f"{path}: missing meta description")
    if not canonical: err(f"{path}: missing canonical")
    if len(h1s) != 1: err(f"{path}: expected exactly one H1, found {len(h1s)}")
    expected = DOMAIN + ("/" if path == "index.html" else "/" + path)
    if canonical and canonical != expected:
        err(f"{path}: canonical mismatch: {canonical} != {expected}")
    if re.search(r'http-equiv=["\']refresh["\']', text, re.I):
        err(f"{path}: redirect/meta-refresh stub must not be in sitemap")
    if title:
        seen_titles.setdefault(title.lower(), []).append(path)
    if canonical:
        seen_canonicals.setdefault(canonical, []).append(path)

for title, ps in seen_titles.items():
    if len(ps) > 1:
        err("Duplicate title across sitemap pages: " + ", ".join(ps))
for canonical, ps in seen_canonicals.items():
    if len(ps) > 1:
        err("Duplicate canonical across sitemap pages: " + ", ".join(ps))

# Redirect stubs should not leak into sitemap or llms.txt.
redirect_stubs = set()
for f in ROOT.glob("*.html"):
    text = f.read_text("utf-8", errors="replace")
    if re.search(r'http-equiv=["\']refresh["\']', text, re.I):
        redirect_stubs.add(f.name)
        if f.name in sitemap_paths:
            err(f"{f.name}: redirect stub appears in sitemap")

llms = ROOT / "llms.txt"
if llms.exists():
    lt = llms.read_text("utf-8", errors="replace")
    for stub in sorted(redirect_stubs):
        if f"/{stub}" in lt:
            err(f"llms.txt references redirect stub: {stub}")
else:
    warn("llms.txt is missing")

print(f"SEO audit: {len(urls)} sitemap URLs; {len(errors)} errors; {len(warnings)} warnings")
for x in warnings:
    print("WARNING:", x)
for x in errors:
    print("ERROR:", x)

sys.exit(1 if errors else 0)
