from PIL import Image
import os

def crop_logo_text(input_path, output_path):
    try:
        if not os.path.exists(input_path):
            print(f"Error: {input_path} not found.")
            return

        img = Image.open(input_path)
        width, height = img.size
        
        # Assumption: The logo is vertical with Icon on top and Text on bottom.
        # We will keep the top 75% which typically contains the Icon and its background.
        # This removes the embedded text at the bottom.
        crop_height = int(height * 0.75)
        
        icon_only = img.crop((0, 0, width, crop_height))
        
        # Save as PNG to ensure quality, but keep original background pixels
        icon_only.save(output_path)
        print(f"Created {output_path} (Size: {width}x{crop_height})")

    except Exception as e:
        print(f"Error processing image: {e}")

crop_logo_text("public/images/logo.jpg", "public/images/logo-icon-only.png")
