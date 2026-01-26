from PIL import Image
import os

def update_favicons():
    source_path = "public/images/logo-icon-only.png"
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
    
    # Generate PNG favicons
    for size in icon_sizes:
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        output_path = os.path.join(public_dir, f"favicon-{size}x{size}.png")
        resized_img.save(output_path)
        print(f"Generated {output_path}")

    # Generate Apple Touch Icon
    apple_img = img.resize((apple_size, apple_size), Image.Resampling.LANCZOS)
    apple_path = os.path.join(public_dir, "apple-touch-icon.png")
    apple_img.save(apple_path)
    print(f"Generated {apple_path}")
    
    # Generate ICO file (combines sizes)
    ico_path = os.path.join(public_dir, "favicon.ico")
    img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"Generated {ico_path}")

if __name__ == "__main__":
    update_favicons()
