import os
import re

html_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\index.html'
css_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\styles.css'
js_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\main.js'
out_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\sitejourney_export.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace CSS link
css_tag = f"<style>\n{css}\n</style>"
html = re.sub(r'<link rel="stylesheet" href="styles.css">', css_tag, html)

# Replace JS script
js_tag = f"<script>\n{js}\n</script>"
html = re.sub(r'<script src="main.js"></script>', js_tag, html)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)
