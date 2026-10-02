# MetWipe Google Search Console baseline — 2026-10-01

Source: screenshots supplied from Google Search Console. Performance window: last 3 months, with data shown through approximately 2026-09-28. Indexing report screenshot was last updated 2026-09-21.

## Performance summary
- Clicks: 0
- Impressions: 221
- CTR: 0%
- Average position: 75.2

## Country signals
- United States: 111 impressions, average position 83.1
- United Kingdom: 17 impressions, average position 74.9
- India: 14 impressions, average position 75.6
- Bangladesh: 8 impressions, average position 77.8
- Vietnam: 7 impressions, average position 73.7
- Syria: 6 impressions, average position 1.2
- Brazil: 6 impressions, average position 49.7
- Mexico: 6 impressions, average position 77.2
- Algeria: 4 impressions, average position 70.5
- Thailand: 4 impressions, average position 78.0

The United States accounts for roughly half of observed impressions, but the sample is still very small and there are no clicks yet.

## Top pages by impressions
- /remove-mp3-metadata.html — 58 impressions, average position 79.2
- /word-metadata-remover.html — 48 impressions, average position 75.3
- /remove-id3-tags-mp3.html — 31 impressions, average position 91.3
- /gps-metadata.html — 20 impressions, average position 78.5
- /exif-viewer.html — 14 impressions, average position 79.6
- /remove-docx-metadata.html — 13 impressions, average position 73.1
- /remove-webp-metadata.html — 11 impressions, average position 69.5
- / — 10 impressions, average position 7.8
- /remove-wav-metadata.html — 9 impressions, average position 72.6
- /remove-xlsx-metadata.html — 8 impressions, average position 80.4

Important: this is a 3-month aggregate and includes impressions earned before the latest consolidation changes. Legacy URLs that now redirect/canonicalize can still appear in this historical window.

## Top queries by impressions
- "remove metadata from mp3" — 38 impressions, average position 88.8
- "remove metadata from word" — 22 impressions, average position 77.3
- "metadata removal tool word" — 7 impressions, average position 88.7
- "remove copyright from mp3" — 6 impressions, average position 85.5
- "remove metadata from word document" — 4 impressions, average position 83.8
- "clean metadata from word" — 3 impressions, average position 81.7
- "how to erase meta data from mp3" — 3 impressions, average position 85.3
- "mp3 copyright remover online free" — 3 impressions, average position 88.7
- "remove mp3 metadata" — 3 impressions, average position 89.7
- "remove metadata mp3" — 3 impressions, average position 94.0

## Indexing summary
- Indexed: 29
- Not indexed: 9

Reported reasons for the 9 non-indexed pages:
- Page with redirect: 3
- Alternate page with proper canonical tag: 1
- Crawled — currently not indexed: 1
- Discovered — currently not indexed: 4

The redirect and alternate-canonical categories are expected for intentional consolidation URLs. The priority is to identify the exact 1 crawled-not-indexed and 4 discovered-not-indexed URLs and improve discovery/internal-linking/content quality where appropriate.

## Interpretation
MetWipe is being discovered, but most non-homepage rankings are still far outside useful click positions. This is not a CTR optimization stage yet. The strongest observed topical signals are MP3 metadata removal and Word/DOCX metadata removal, so internal authority should be pushed into those clusters before mass title changes.

The homepage average position of 7.8 is promising but based on only 10 impressions; it is not enough data to infer stable non-branded ranking.

## Action taken from this baseline
- Added direct homepage contextual links to MP3, WAV, Word/DOCX, XLSX and PPTX tool/check pages.
- Expanded the homepage learning section beyond photo-only content to include MP3/ID3, Word metadata and the answer center.
- Preserved existing titles and canonical URLs; no bulk CTR/title rewrite was made because rankings and impression volume are not mature enough.
- Next required GSC evidence: exact URL lists under "Crawled — currently not indexed" and "Discovered — currently not indexed".


## Exact indexing examples supplied after the baseline

### Discovered — currently not indexed
Google Search Console listed these four URLs:
- https://metwipe.com/check-photo-location.html
- https://metwipe.com/remove-camera-info-from-photo.html
- https://metwipe.com/remove-exif-iphone.html
- https://metwipe.com/tools.html

The report showed no crawl date for these examples. Because the report itself was last updated on 2026-09-21, it predates the 2026-10-01 internal-link upgrades. Treat this as a crawl-priority signal, not proof that the current version is still undiscovered.

### Crawled — currently not indexed
- https://metwipe.com/mp3-metadata-privacy-guide.html
- Last crawl shown: 2026-09-16

This page overlapped too closely with the transactional MP3 remover intent. It has now been retargeted toward informational MP3 metadata privacy (ID3/APEv2/Lyrics3/artwork/copyright misconceptions) while the actual remover page remains the transactional destination.

### Alternate page with proper canonical
- https://metwipe.com/index.html

This is expected because the canonical homepage is https://metwipe.com/.

### Page with redirect
- http://metwipe.com/
- http://www.metwipe.com/
- https://www.metwipe.com/

These are expected hostname/protocol normalization redirects to the canonical HTTPS non-www site and should not be forced into the index.

## Indexing actions applied
- Added direct homepage links to the three discovered photo URLs and the tools hub.
- Expanded the three thin photo pages with distinct, task-specific content and breadcrumb structured data.
- Retargeted the MP3 privacy guide away from the remover page's transactional intent and added Article structured data.
- Added CollectionPage structured data to tools.html.
- Added accurate 2026-10-01 sitemap lastmod values only for pages actually changed in this indexing pass.


## 2026-10-02 — MP3 + Word ranking push

- GSC baseline still shows the strongest non-home demand around MP3 removal and Word/DOCX metadata removal, but average positions are still far from the near-miss zone.
- Kept the recently changed titles, descriptions and primary remover-page copy stable so the measurement window is not reset by another rewrite.
- Strengthened contextual internal links into the primary transactional URLs from the ID3 explainer, MP3 checker, Word checker, and focused Word Author / Last Modified By / Company pages.
- Live SERP review confirmed the dominant intent is an immediately usable browser tool plus clear scope/limits, not a thin keyword article.
- No new keyword-variant landing pages were created; existing focused intents remain separate to avoid duplicate-intent expansion.
- Measurement: compare GSC impressions, query coverage and average position after recrawl/reindex; do not attribute early day-to-day movement as a stable ranking lift.


## 2026-10-02 — International SEO pilot: MP3 + Word

- Added fully translated primary-content landing pages for the two GSC-proven transactional intents in Spanish, German and French: MP3 metadata removal and Word/DOCX metadata removal.
- Kept the existing English URLs as generic English rather than cloning near-identical en-US/en-GB/en-CA/en-AU pages. This avoids unnecessary same-language regional duplication while the product/content has no meaningful regional variation.
- Added reciprocal HTML hreflang sets across EN/ES/DE/FR plus x-default on both page families, with self-canonical URLs on every localized page.
- Added the six localized URLs to sitemap.xml. Hreflang is implemented in HTML only; Google documents HTML, HTTP headers and sitemap hreflang as equivalent methods, so duplicating the annotations in all three is intentionally avoided.
- Scope remains a controlled pilot: no mass translation of the full site until these pages are crawled and GSC begins returning language/query evidence.
- Localized pages accurately describe supported MP3 and DOCX processing and route users to the maintained MetWipe scanner; no unsupported formats were introduced.
