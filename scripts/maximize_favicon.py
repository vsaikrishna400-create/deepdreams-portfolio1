from PIL import Image
import os

# Paths
source_path = r"C:\Users\User\.gemini\antigravity\brain\d9f6edc8-e5a3-45c2-8258-2e35874b2cc2\uploaded_media_1769328802662.png"
output_dir = r"c:\Portfolio\portfolio-app\public"

def crop_transparency(img):
    """Crops the transparent whitespace around the image"""
    img = img.convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def create_maximized_favicons():
    # Load and optimize source
    print(f"Loading {source_path}...")
    img = Image.open(source_path)
    
    # 1. CROP whitespace (Make it fill the square)
    print("Cropping transparent borders STRICTLY...")
    img_cropped = crop_transparency(img)
    
    # 2. ZERO PADDING - MAX VISIBILITY
    # We want the logo to touch the edges.
    max_dim = max(img_cropped.size)
    
    # Create square canvas exactly the size of the logo's max dimension
    # No 1.1 multiplication here. Pure pixel maximization.
    final_size = max_dim 
    final_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    
    # Paste centered
    offset_x = (final_size - img_cropped.size[0]) // 2
    offset_y = (final_size - img_cropped.size[1]) // 2
    final_img.paste(img_cropped, (offset_x, offset_y))
    
    print("Generating MAXIMIZED icons...")
    
    sizes = [
        (16, 16, 'favicon-16x16.png'),
        (32, 32, 'favicon-32x32.png'),
        (48, 48, 'favicon-48x48.png'),
        (180, 180, 'apple-touch-icon.png'),
        (192, 192, 'android-chrome-192x192.png'),
        (512, 512, 'android-chrome-512x512.png'),
    ]

    for width, height, filename in sizes:
        # High quality resampling
        # LANCZOS is best for downscaling
        resized = final_img.resize((width, height), Image.Resampling.LANCZOS)
        output_path = os.path.join(output_dir, filename)
        resized.save(output_path, 'PNG')
        print(f"Saved: {filename}")

    # Favicon.ico (Standard)
    final_img.resize((32, 32), Image.Resampling.LANCZOS).save(
        os.path.join(output_dir, 'favicon.ico'), format='ICO'
    )
    
    # App icon for Next.js
    app_dir = r"c:\Portfolio\portfolio-app\src\app"
    final_img.resize((32, 32), Image.Resampling.LANCZOS).save(
        os.path.join(app_dir, 'icon.png'), 'PNG'
    )
    
    print("Done! Icons are now STRICTLY cropped and MAXIMIZED.")

if __name__ == "__main__":
    create_maximized_favicons()
