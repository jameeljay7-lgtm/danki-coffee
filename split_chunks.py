import os
import re

css_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\styles.css'
js_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\main.js'
html_path = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\index.html'
out_dir = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Chunk 1: Fonts + CSS
chunk1 = f"""
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
{css}
</style>
"""

# Extract parts using simple regex or string slicing
header_hero_match = re.search(r'(<header id="main-nav">.*?</section>)', html, re.DOTALL)
chunk2 = header_hero_match.group(1) if header_hero_match else "ERROR parsing header"

coffee_match = re.search(r'(<section id="coffee".*?</section>)', html, re.DOTALL)
chunk3 = coffee_match.group(1) if coffee_match else "ERROR parsing coffee"

footer_match = re.search(r'(<footer id="contact".*?</footer>)', html, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else "ERROR parsing footer"

chunk4 = f"""
{footer_html}
<script>
{js}
</script>
"""

with open(os.path.join(out_dir, '1_Styles.txt'), 'w', encoding='utf-8') as f:
    f.write(chunk1.strip())
with open(os.path.join(out_dir, '2_HeaderHero.txt'), 'w', encoding='utf-8') as f:
    f.write(chunk2.strip())
with open(os.path.join(out_dir, '3_Coffee.txt'), 'w', encoding='utf-8') as f:
    f.write(chunk3.strip())
with open(os.path.join(out_dir, '4_FooterScript.txt'), 'w', encoding='utf-8') as f:
    f.write(chunk4.strip())

print("Chunks generated successfully.")
