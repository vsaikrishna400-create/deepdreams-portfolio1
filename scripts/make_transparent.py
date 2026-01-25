from PIL import Image
import numpy as np
from collections import deque

# Use the ORIGINAL logo
input_path = r"c:\Portfolio\portfolio-app\public\images\logo.jpg"
output_path = r"c:\Portfolio\portfolio-app\public\images\logo-clean.png"

img = Image.open(input_path).convert("RGBA")
width, height = img.size
data = np.array(img)

# Alpha channel - starts fully opaque
alpha = np.ones((height, width), dtype=np.uint8) * 255

def is_bg(r, g, b):
    # Pure black only
    return r < 15 and g < 15 and b < 15

# Flood fill ONLY from edges
visited = set()
bg_pixels = set()
queue = deque()

# Seed from all 4 edges
for x in range(width):
    if is_bg(*data[0, x, :3]):
        queue.append((0, x))
    if is_bg(*data[height-1, x, :3]):
        queue.append((height-1, x))

for y in range(height):
    if is_bg(*data[y, 0, :3]):
        queue.append((y, 0))
    if is_bg(*data[y, width-1, :3]):
        queue.append((y, width-1))

# BFS flood fill
while queue:
    y, x = queue.popleft()
    key = (y, x)
    if key in visited:
        continue
    if not (0 <= y < height and 0 <= x < width):
        continue
    if not is_bg(*data[y, x, :3]):
        continue
    
    visited.add(key)
    bg_pixels.add(key)
    
    # 4-connected only (more conservative)
    queue.append((y-1, x))
    queue.append((y+1, x))
    queue.append((y, x-1))
    queue.append((y, x+1))

# Make background transparent
for (y, x) in bg_pixels:
    alpha[y, x] = 0

data[:, :, 3] = alpha
result = Image.fromarray(data, 'RGBA')

# Tight crop
bbox = result.getbbox()
if bbox:
    result = result.crop(bbox)

result.save(output_path, "PNG")
print(f"Saved: {output_path}")
print(f"Size: {result.width}x{result.height}")
