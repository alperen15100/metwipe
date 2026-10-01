# MetWipe SERP / GSC opportunity notes — 2026-10-01

## Search Console signals used
The user-provided 3-month Google Search Console screenshots showed the strongest non-homepage demand around:
- "remove metadata from mp3"
- "remove metadata from word"
- related variants for MP3 metadata removal and Word/DOCX metadata cleanup

Because these URLs were still ranking far from click positions, this pass did not perform broad title rewrites. The priority was to improve visible snippet source content, intent clarity and page usefulness.

## Current SERP pattern observations
A current web review of competing MP3 and DOCX metadata tools showed recurring patterns:
- direct "quick answer" copy near the top of the page;
- explicit lists of fields/structures handled;
- visible browser-local / no-upload messaging;
- clear separation between metadata cleanup and full redaction;
- updated/reviewed dates;
- format-specific explanations such as ID3/APEv2/Lyrics3 for MP3 and OOXML property parts for DOCX.

The implementation only adopted patterns that are truthful for MetWipe's documented capabilities.

## Changes made from the research
- Added visible quick-answer blocks to the MP3 and Word remover pages.
- Added reviewed-date context.
- Added a clearer MP3 structure explanation.
- Added a clearer DOCX package-location explanation.
- Added WebApplication + BreadcrumbList structured data where appropriate.
- Corrected the MP3 page's semantic content order so guide content appears before the footer.
- Added a cross-format Metadata Field Reference as a useful citation/link target.
- Added a public GitHub README linking to the live site and key reference/hub pages.

## CTR note
Google can generate snippets from visible page content and may use the meta description when it is a better fit. The page titles were therefore left stable during this low-ranking / low-volume phase while the underlying snippet source content was improved.

## Backlink policy
Do not manufacture spam links or mass-submit to unrelated directories. Prefer:
- project-owned profiles/repositories with legitimate site attribution;
- genuinely useful reference assets;
- relevant editorial mentions or tool roundups;
- links earned from people who actually use or cite the tools.

## Measurement
Compare future Search Console data against the 2026-10-01 baseline before making another title/snippet pass.
