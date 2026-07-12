import os

out_dir = r'C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee'
artifact_path = r'C:\Users\ADMIN\.gemini\antigravity\brain\a715a9d3-e3c2-4ff1-aea8-a15adab0c4a4\sitejourney_chunks.md'

with open(os.path.join(out_dir, '1_Styles.txt'), 'r', encoding='utf-8') as f:
    chunk1 = f.read()
with open(os.path.join(out_dir, '2_HeaderHero.txt'), 'r', encoding='utf-8') as f:
    chunk2 = f.read()
with open(os.path.join(out_dir, '3_Coffee.txt'), 'r', encoding='utf-8') as f:
    chunk3 = f.read()
with open(os.path.join(out_dir, '4_FooterScript.txt'), 'r', encoding='utf-8') as f:
    chunk4 = f.read()

markdown = f"""# SiteJourney Code Chunks

Here are the 4 chunks to bypass the 2,000-word limit. Add 4 separate "Custom HTML" blocks to your SiteJourney page, and paste one chunk into each.

### Block 1: Fonts & Styles
```html
{chunk1}
```

### Block 2: Header & Hero Section
```html
{chunk2}
```

### Block 3: The Coffee Collection
```html
{chunk3}
```

### Block 4: Footer & Scripts
```html
{chunk4}
```
"""

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(markdown)

print("Artifact created successfully.")
