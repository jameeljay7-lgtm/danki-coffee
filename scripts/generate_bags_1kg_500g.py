import os
from PIL import Image, ImageDraw, ImageFont

output_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\danki-coffee\public\images"
os.makedirs(output_dir, exist_ok=True)

img_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\04ac7e12-9896-42c4-b3c1-d8de6c3ba4e1\.user_uploaded\media_1786454117901.png"
original_img = Image.open(img_path)

label_color = (17, 15, 16, 255) # Dark label background
badge_bg_color = (250, 250, 250, 255) # White for the badge
badge_text_color = (11, 11, 11, 255) # Dark text on white badge

try:
    font_roast = ImageFont.truetype("arial.ttf", 10)
    font_format = ImageFont.truetype("arialbd.ttf", 9)
    font_weight = ImageFont.truetype("arial.ttf", 8)
except IOError:
    font_roast = font_format = font_weight = ImageFont.load_default()

roasts = {
    "medium": "MEDIUM ROAST COFFEE",
    "dark": "DARK ROAST COFFEE",
    "medium-dark": "MEDIUM TO DARK ROAST COFFEE"
}

formats = ["BEANS", "GROUND"]
weights = ["1kg", "500g"]

for weight in weights:
    for format_key in formats:
        for roast_key, roast_name in roasts.items():
            img = original_img.copy()
            draw = ImageDraw.Draw(img)
            
            # Mask Roast
            draw.rectangle([(110, 321), (285, 337)], fill=label_color)
            draw.text((112, 324), roast_name, fill=(230, 230, 230, 255), font=font_roast)
            
            # Mask Format Badge
            draw.rectangle([(110, 340), (160, 355)], fill=badge_bg_color)
            draw.text((113, 343), format_key, fill=badge_text_color, font=font_format)
            
            # Mask Weight
            draw.rectangle([(220, 396), (288, 411)], fill=label_color)
            draw.text((225, 398), f"Net Weight: {weight}", fill=(200, 200, 200, 255), font=font_weight)
            
            # Lowercase the format for the filename
            filename = f"bag_{roast_key}_{format_key.lower()}_{weight}.jpg"
            
            # Save as jpg so convert to RGB first (since original is PNG with alpha)
            rgb_im = img.convert('RGB')
            output_path = os.path.join(output_dir, filename)
            rgb_im.save(output_path)
            print(f"Generated {filename}")

print("All 1kg and 500g bag images successfully generated.")
