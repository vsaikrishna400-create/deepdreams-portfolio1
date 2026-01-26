from PIL import Image
import os

def update_favicons():
    source_path = "public/images/logo-final-tab.png"
    public_dir = "public"
    
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found. Trying logo-transparent-new.png")
        source_path = "public/images/logo-transparent-new.png"
        if not os.path.exists(source_path):
             print(f"Error: {source_path} not found.")
             return

    print(f"Using source image: {source_path}")
    img = Image.open(source_path)
    
    # Define sizes
    icon_sizes = [16, 32, 48]
    apple_size = 180
    
    # Function to resize with padding and maintain aspect ratio
    def resize_contain(image, size, padding_pct=0.1):
        target_size = (size, size)
        new_img = Image.new("RGBA", target_size, (0, 0, 0, 0))
        
        # Calculate max dimensions for content
        max_dim = int(size * (1 - 2 * padding_pct))
        
        # Calculate scaling factor
        width, height = image.size
        ratio = min(max_dim / width, max_dim / height)
        
        new_w = int(width * ratio)
        new_h = int(height * ratio)
        
        # Resize content
        content = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center position
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        
        new_img.paste(content, (x, y))
        return new_img

    # Generate PNG favicons
    for size in icon_sizes:
        # User requested MAX size, so we remove all padding (0.0)
        padding = 0.0 
        resized_img = resize_contain(img, size, padding)
        output_path = os.path.join(public_dir, f"favicon-{size}x{size}.png")
        resized_img.save(output_path)
        print(f"Generated {output_path}")

    # Generate Apple Touch Icon (0 padding for max visibility on phones too)
    apple_img = resize_contain(img, apple_size, 0.0)
    apple_path = os.path.join(public_dir, "apple-touch-icon.png")
    apple_img.save(apple_path)
    print(f"Generated {apple_path}")
    
    # Generate ICO file
    ico_img_16 = resize_contain(img, 16, 0.0)
    ico_img_32 = resize_contain(img, 32, 0.0)
    ico_img_48 = resize_contain(img, 48, 0.0)
    ico_path = os.path.join(public_dir, "favicon.ico")
    # Save containing multiple sizes
    ico_img_32.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[ico_img_16, ico_img_48])
    print(f"Generated {ico_path}")

if __name__ == "__main__":
    update_favicons()
