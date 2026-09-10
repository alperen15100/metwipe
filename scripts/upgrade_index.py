from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str):
    global s
    if old not in s:
        raise SystemExit(f'Missing expected pattern: {label}')
    s = s.replace(old, new, 1)


# Accessibility CSS helpers.
if '.skip-link{' not in s:
    replace_once(
        '</style>',
        '\n.skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}.skip-link:focus{left:12px;top:12px;width:auto;height:auto;overflow:visible;z-index:9999;padding:10px 12px;border-radius:8px;background:#fff;color:#000;font-size:12px;font-weight:800}.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}.drop-title{font-size:16px;margin:0;font-weight:700}\n</style>',
        'style close',
    )

# Skip link.
if 'class="skip-link"' not in s:
    replace_once('<body>', '<body>\n<a class="skip-link" href="#main-content">Skip to main content</a>', 'body')

# Semantic header/nav.
if '<header>' not in s:
    replace_once('<nav>', '<header>\n<nav>', 'nav open')
    replace_once('</nav>', '</nav>\n</header>', 'nav close')

# Main landmark.
if '<main id="main-content">' not in s:
    replace_once('</header>\n\n<section class="hero" id="scanner">', '</header>\n<main id="main-content">\n\n<section class="hero" id="scanner">', 'main open')
    replace_once('<div class="adslot"></div>\n<footer>', '<div class="adslot"></div>\n</main>\n<footer>', 'main close')

# Accessible file input; same IDs and behavior.
old_input = '<input id="file" type="file" accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,.mp3,.wav,.docx,.xlsx,.pptx" multiple hidden>'
if 'for="file" class="sr-only"' not in s:
    new_input = '<label for="file" class="sr-only">Choose files to scan for metadata</label>\n' + old_input.replace(' multiple hidden>', ' multiple hidden aria-label="Choose files to scan for metadata">')
    replace_once(old_input, new_input, 'file input')

# Fix initial heading level jump while preserving visual appearance.
if '<h3>Drop photos here</h3>' in s:
    s = s.replace('<h3>Drop photos here</h3>', '<p class="drop-title">Drop photos here</p>', 1)

# Load progressive WebMCP tools after the existing scanner code.
if '<script src="webmcp.js"></script>' not in s:
    replace_once('\n</body></html>', '\n<script src="webmcp.js"></script>\n</body></html>', 'body close')

p.write_text(s, encoding='utf-8')

# Verification.
checks = [
    'class="skip-link"',
    '<header>',
    '<main id="main-content">',
    'for="file" class="sr-only"',
    'aria-label="Choose files to scan for metadata"',
    '<script src="webmcp.js"></script>',
]
for token in checks:
    if token not in s:
        raise SystemExit(f'Verification failed: {token}')

print('index.html upgraded successfully')
