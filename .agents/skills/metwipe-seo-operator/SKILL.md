---
name: metwipe-seo-operator
description: >
  MetWipe-specific SEO operating procedure. Use for any SEO, content, indexing, pSEO, internal
  linking, AI-discovery, or growth task on metwipe.com. Route through the imported SEO skills,
  preserve working browser tools, and never create a landing page that claims unsupported file
  processing.
---

# MetWipe SEO Operator

## Site facts
- Canonical domain: https://metwipe.com/
- Deployment: static GitHub Pages site.
- Product promise: privacy-first metadata inspection/cleaning with supported processing performed locally in the browser.
- Existing content types: tool pages, checker/viewer pages, format/privacy guides, trust/legal pages.
- Primary monetization: advertising; SEO changes must not reduce tool usefulness or trust.

## Mandatory routing
1. Run `seo-growth-stage-strategy`.
2. For broad audits use `site-audit-orchestrator`.
3. Before adding any pSEO page use both `content-opportunity-discovery` and `duplicate-intent-audit`.
4. Before publishing use `content-creation-standards`, `technical-seo-audit`, and `internal-linking-audit`.
5. For title/meta experiments use `ctr-snippet-optimization` and `measurement-discipline`.
6. Record meaningful decisions in the repository audit/change log.

## MetWipe-specific guardrails
- Do not claim support for PDF, HEIC, MP4/MOV, FLAC, M4A, or any other format unless working client-side processing and verification exist in the code.
- Do not manufacture near-duplicate pages just to target keyword variants.
- A format cluster should normally contain distinct intents: inspect/check, remove/clean, explanatory guide, and a hub only when each page adds unique value.
- Keep canonical URLs self-referential on live indexable pages.
- Redirect/consolidation stubs must stay out of sitemap.xml and AI discovery lists.
- Because GitHub Pages does not natively apply Netlify-style _redirects rules, verify redirect stubs actually contain canonical + client-visible redirect/fallback behavior before relying on them.
- Preserve local-processing/privacy wording accurately; do not imply files can never leave the device when third-party browser extensions, OS behavior, or user actions are outside MetWipe's control.
- New pages must link into their parent format cluster and receive at least one contextual inbound link from an existing relevant page/hub.

## Current priority
MetWipe is still coverage-building. Prefer adding proven, genuinely distinct search intents and improving cluster linking over mass rewriting existing titles. Do not consolidate live pages solely from keyword similarity without Search Console evidence.
