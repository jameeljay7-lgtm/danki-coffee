import cv2
import os
import shutil
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

source_video = r"C:\Users\ADMIN\Downloads\Cinematic_continuous_FPV_camer.mp4"
output_video = r"public\videodanki.mp4"
output_frames_dir = r"public\frames"

os.makedirs(output_frames_dir, exist_ok=True)

# Copy the original video as well
shutil.copy(source_video, output_video)
print(f"Copied original video to {output_video}")

cap = cv2.VideoCapture(source_video)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
target_count = 150

print(f"Processing {target_count} frames from {total_frames} total frames with 4K/2K Lanczos Super-Sampling...")

frame_indices = np.linspace(0, total_frames - 1, target_count, dtype=int)

for i, idx in enumerate(frame_indices):
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if not ret:
        continue

    # Convert BGR to RGB
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)

    # 4K/2.5K Super-Sampling Upscale (2560 x 1440) using Lanczos Filter
    target_w, target_h = (2560, 1440)
    upscaled = pil_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Unsharp Mask to recover ultra-crisp edges & micro-textures
    sharpened = upscaled.filter(ImageFilter.UnsharpMask(radius=2.0, percent=140, threshold=2))

    # Enhance color richness (golden roasted tones, vibrant greenery)
    color_enhancer = ImageEnhance.Color(sharpened)
    color_img = color_enhancer.enhance(1.10)

    # Enhance contrast curve
    contrast_enhancer = ImageEnhance.Contrast(color_img)
    final_img = contrast_enhancer.enhance(1.06)

    # Save as high-quality frame
    filename = f"frame_{(i + 1):04d}.jpg"
    out_path = os.path.join(output_frames_dir, filename)
    final_img.save(out_path, "JPEG", quality=94, optimize=True)

    if (i + 1) % 30 == 0 or (i + 1) == target_count:
        print(f"Enhanced {i + 1}/{target_count} frames: {filename}")

cap.release()
print("All 150 4K/2K super-sampled frames successfully generated!")
