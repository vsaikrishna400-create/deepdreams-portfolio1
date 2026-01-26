from PIL import Image
import os

# Source image path
source_path = r"C:\Users\User\.gemini\antigravity\brain\d9f6edc8-e5a3-45c2-8258-2e35874b2cc2\uploaded_media_1769328802662.png"  
output_dir = r"c:\Portfolio\portfolio-app\public"

# Load the original image
img = Image.open(source_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create multiple sizes for proper favicon display
sizes = [
    (16, 16, 'favicon-16x16.png'),
    (32, 32, 'favicon-32x32.png'),
    (48, 48, 'favicon-48x48.png'),
    (180, 180, 'apple-touch-icon.png'),  # For iOS
    (192, 192, 'android-chrome-192x192.png'),  # For Android
    (512, 512, 'android-chrome-512x512.png'),  # For Android splash
]

for width, height, filename in sizes:
    resized = img.resize((width, height), Image.Resampling.LANCZOS)
    output_path = os.path.join(output_dir, filename)
    resized.save(output_path, 'PNG')
    print(f"Created: {filename}")

# Create main favicon.png at 32x32 (standard size)
favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
favicon.save(os.path.join(output_dir, 'favicon.png'), 'PNG')
print("Created: favicon.png (32x32)")

# Also create favicon.ico (multi-size ICO file for maximum compatibility)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
ico_images[0].save(
    os.path.join(output_dir, 'favicon.ico'),
    format='ICO',
    sizes=ico_sizes
)
print("Created: favicon.ico (multi-size)")

# Update src/app/icon.png for Next.js
app_dir = r"c:\Portfolio\portfolio-app\src\app"
icon_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
icon_32.save(os.path.join(app_dir, 'icon.png'), 'PNG')
print("Created: src/app/icon.png")

print("\n✅ All favicon files created successfully!")
