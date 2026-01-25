import cv2
import numpy as np
import os

def crop_logo():
    input_path = "public/images/logo-clean.png"
    output_path = "public/images/logo-icon.png"
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    # Read image
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    
    if img is None:
        print("Failed to load image.")
        return

    # Get dimensions
    h, w = img.shape[:2]
    
    # Assuming text is in the bottom 30-40%, we'll keep the top 65% to be safe
    # ideally we would use contour detection, but a safe crop is often better for simple stack
    
    # Let's try to detect the main object (Ammonite)
    # Extract alpha channel
    if img.shape[2] == 4:
        alpha = img[:, :, 3]
        
        # Find bounding box of non-transparent areas
        coords = cv2.findNonZero(alpha)
        x, y, w_content, h_content = cv2.boundingRect(coords)
        
        # The text is likely at the bottom of this bounding box.
        # Let's aggressively crop the bottom 25% of the CONTENT height
        # This is a heuristic.
        
        # Safer approach: The logo is circular/spiral. The text is rectangular below.
        # Let's crop to the top 75% of the content.
        
        crop_h = int(h_content * 0.75)
        
        # Crop
        crop = img[y:y+crop_h, x:x+w_content]
        
        cv2.imwrite(output_path, crop)
        print(f"Cropped logo saved to {output_path}")
        
    else:
        print("Image has no alpha channel?")

if __name__ == "__main__":
    # Install opencv if not present (using pip in run_command usually, but here checking avail)
    try:
        import cv2
        crop_logo()
    except ImportError:
        print("OpenCV not found. Please install opencv-python-headless")
