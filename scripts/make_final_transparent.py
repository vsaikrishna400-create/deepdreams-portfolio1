from PIL import Image
import numpy as np
import os

def remove_black_background(input_path, output_path):
    print(f"Processing {input_path}...")
    
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)
        
        # Breakdown of channels
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        
        # Identify black background pixels (darker than threshold)
        # We increase threshold slightly to catch 'dark dark gray' artifacts near edges
        threshold = 40
        mask = (r < threshold) & (g < threshold) & (b < threshold)
        
        # Set alpha to 0 for these pixels -> Transparent
        data[:,:,3][mask] = 0
        
        # Create final image
        new_img = Image.fromarray(data)
        new_img.save(output_path)
        print(f"Success! Saved transparent logo to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

# Process the ORIGINAL logo
remove_black_background("public/images/logo.jpg", "public/images/logo-final.png")
