from PIL import Image
import numpy as np
import os

def fix_black_spots(input_path, output_path):
    print(f"Processing {input_path}...")
    
    try:
        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)
        
        # Define black threshold (pixels darker than this will be made transparent)
        threshold = 30
        
        # Get RGB channels
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        
        # mask is True where pixel is 'black' (darker than threshold)
        mask = (r < threshold) & (g < threshold) & (b < threshold)
        
        # Set alpha to 0 where mask is True
        data[:,:,3][mask] = 0
        
        # Create new image
        new_img = Image.fromarray(data)
        
        # Save
        new_img.save(output_path)
        print(f"Saved cleaned logo to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

# Run on the original logo to create the clean version
if os.path.exists("public/images/logo.jpg"):
    fix_black_spots("public/images/logo.jpg", "public/images/logo-clean.png")
else:
    print("logo.jpg not found!")
