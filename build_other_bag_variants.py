from PIL import Image, ImageDraw, ImageFont
import os

img_path = r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\3ecca082-e115-4d74-9800-c759f6e5bc73\media__1786400796549.jpg'
out_dir = r'C:\Users\ADMIN\.gemini\antigravity-ide\scratch\danki-coffee-app\public\images'
os.makedirs(out_dir, exist_ok=True)

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 16)
    font_sm = ImageFont.truetype("arial.ttf", 12)
    font_title = ImageFont.truetype("arialbd.ttf", 20)
except:
    font_bold = ImageFont.load_default()
    font_sm = ImageFont.load_default()
    font_title = font_bold

def modify_sticker(roast_text, format_text, weight_text, filename):
    img = Image.open(img_path).convert("RGBA")
    draw = ImageDraw.Draw(img)

    title_box = (185, 626, 460, 646)
    draw.rectangle(title_box, fill=(48, 28, 48, 255))
    draw.text((188, 627), roast_text.upper(), fill=(255, 255, 255, 255), font=font_title)

    tag_box = (188, 650, 265, 670)
    draw.rectangle(tag_box, fill=(255, 255, 255, 255))
    
    bbox = font_bold.getbbox(format_text.upper())
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = 188 + (77 - tw) / 2
    ty = 650 + (20 - th) / 2 - 2
    draw.text((tx, ty), format_text.upper(), fill=(0, 0, 0, 255), font=font_bold)

    weight_box = (470, 720, 560, 736)
    draw.rectangle(weight_box, fill=(45, 25, 45, 255))
    w_str = f"Net Weight {weight_text}"
    draw.text((472, 721), w_str, fill=(255, 255, 255, 255), font=font_sm)

    out_path = os.path.join(out_dir, filename)
    img.convert("RGB").save(out_path, "PNG")
    print(f"Saved: {out_path}")

# 500g variations
modify_sticker("MEDIUM TO DARK ROAST COFFEE", "GROUND", "500g", "bag_500g_meddark_ground.png")
modify_sticker("MEDIUM TO DARK ROAST COFFEE", "BEANS", "500g", "bag_500g_meddark_beans.png")
modify_sticker("MEDIUM ROAST COFFEE", "BEANS", "500g", "bag_500g_medium_beans.png")
modify_sticker("MEDIUM ROAST COFFEE", "GROUND", "500g", "bag_500g_medium_ground.png")
modify_sticker("DARK ROAST COFFEE", "BEANS", "500g", "bag_500g_dark_beans.png")
modify_sticker("DARK ROAST COFFEE", "GROUND", "500g", "bag_500g_dark_ground.png")

# 1kg variations
modify_sticker("MEDIUM TO DARK ROAST COFFEE", "GROUND", "1kg", "bag_1kg_meddark_ground.png")
modify_sticker("MEDIUM TO DARK ROAST COFFEE", "BEANS", "1kg", "bag_1kg_meddark_beans.png")
modify_sticker("MEDIUM ROAST COFFEE", "BEANS", "1kg", "bag_1kg_medium_beans.png")
modify_sticker("MEDIUM ROAST COFFEE", "GROUND", "1kg", "bag_1kg_medium_ground.png")
modify_sticker("DARK ROAST COFFEE", "BEANS", "1kg", "bag_1kg_dark_beans.png")
modify_sticker("DARK ROAST COFFEE", "GROUND", "1kg", "bag_1kg_dark_ground.png")

print("SUCCESS! Generated all 500g and 1kg bag image variations.")
