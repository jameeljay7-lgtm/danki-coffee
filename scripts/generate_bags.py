import os
from PIL import Image, ImageDraw, ImageFont

# Define the output directory
output_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\public\images"
os.makedirs(output_dir, exist_ok=True)

# Load the original image
img_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\04ac7e12-9896-42c4-b3c1-d8de6c3ba4e1\.user_uploaded\media_1786439064003.jpg"
original_img = Image.open(img_path)

# Approximate background color of the purple label
label_color = (43, 31, 41) # Dark purple sampled manually, let's use a solid dark purple

# Define the four variations
variations = [
    {"name": "bag_med_dark_ground_250g.jpg", "roast": "MEDIUM TO DARK ROAST COFFEE", "format": "GROUND"},
    {"name": "bag_med_dark_beans_250g.jpg", "roast": "MEDIUM TO DARK ROAST COFFEE", "format": "BEANS"},
    {"name": "bag_dark_ground_250g.jpg", "roast": "DARK ROAST COFFEE", "format": "GROUND"},
    {"name": "bag_dark_beans_250g.jpg", "roast": "DARK ROAST COFFEE", "format": "BEANS"},
]

# Set up simple fallback fonts
try:
    font_roast = ImageFont.truetype("arial.ttf", 20)
    font_format = ImageFont.truetype("arialbd.ttf", 18) # bold
    font_weight = ImageFont.truetype("arial.ttf", 16)
except IOError:
    font_roast = font_format = font_weight = ImageFont.load_default()

for var in variations:
    img = original_img.copy()
    draw = ImageDraw.Draw(img)
    
    # 1. Mask out "MEDIUM TO DARK ROAST COFFEE"
    # Approximate box: x=220 to 520, y=630 to 660
    draw.rectangle([(220, 630), (550, 660)], fill=label_color)
    draw.text((225, 635), var["roast"], fill=(230, 220, 230), font=font_roast)
    
    # 2. Mask out "BEANS" (next to Grade AA)
    # Approximate box: x=220 to 300, y=670 to 695
    draw.rectangle([(220, 665), (310, 695)], fill=(230, 230, 230)) # white background for the badge
    draw.text((225, 670), var["format"], fill=(30, 30, 30), font=font_format)
    
    # 3. Mask out "Net Weight 350g"
    # Approximate box: x=460 to 550, y=780 to 800
    draw.rectangle([(440, 780), (560, 805)], fill=label_color)
    draw.text((450, 782), "Net Weight 250g", fill=(200, 200, 200), font=font_weight)
    
    output_path = os.path.join(output_dir, var["name"])
    img.save(output_path)
    print(f"Generated {output_path}")

print("All 250g bag images successfully generated.")
