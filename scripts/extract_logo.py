from PIL import Image
import numpy as np
from collections import deque

# Paths
input_path = r"C:\Users\User\.gemini\antigravity\brain\d9f6edc8-e5a3-45c2-8258-2e35874b2cc2\uploaded_media_1769238652664.png"
output_path = r"c:\Portfolio\portfolio-app\public\images\logo-transparent.png"

# Load
img = Image.open(input_path).convert("RGBA")
width, height = img.size

# AGGRESSIVE CROP - remove 15% from each edge to eliminate ALL gradient vignette
crop_x = int(width * 0.15)
crop_y = int(height * 0.15)
img = img.crop((crop_x, crop_y, width - crop_x, height - crop_y))

width, height = img.size
data = np.array(img)
alpha = np.ones((height, width), dtype=np.uint8) * 255

# Force the OUTERMOST 3 pixel border to be completely transparent
# This eliminates any edge artifacts
border = 3
alpha[:border, :] = 0           # Top rows
alpha[-border:, :] = 0          # Bottom rows
alpha[:, :border] = 0           # Left columns
alpha[:, -border:] = 0          # Right columns

def is_dark(r, g, b):
    return (0.299 * r + 0.587 * g + 0.114 * b) < 40

# Flood fill from the now-transparent border
visited = np.zeros((height, width), dtype=bool)
background = np.zeros((height, width), dtype=bool)
queue = deque()

# Mark border as visited and add neighbors to queue
visited[:border, :] = True
visited[-border:, :] = True
visited[:, :border] = True
visited[:, -border:] = True

# Add pixels adjacent to border as seeds
for x in range(border, width - border):
    y = border
    if is_dark(*data[y, x, :3]):
        queue.append((y, x))
        visited[y, x] = True
    y = height - border - 1
    if is_dark(*data[y, x, :3]):
        queue.append((y, x))
        visited[y, x] = True

for y in range(border, height - border):
    x = border
    if is_dark(*data[y, x, :3]):
        queue.append((y, x))
        visited[y, x] = True
    x = width - border - 1
    if is_dark(*data[y, x, :3]):
        queue.append((y, x))
        visited[y, x] = True

# Flood fill
while queue:
    y, x = queue.popleft()
    background[y, x] = True
    for dy, dx in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
        ny, nx = y + dy, x + dx
        if border <= ny < height-border and border <= nx < width-border and not visited[ny, nx]:
            if is_dark(*data[ny, nx, :3]):
                visited[ny, nx] = True
                queue.append((ny, nx))

alpha[background] = 0
data[:, :, 3] = alpha

result = Image.fromarray(data, 'RGBA')

# Crop to content
bbox = result.getbbox()
if bbox:
    result = result.crop(bbox)

# Upscale
result = result.resize((result.width * 4, result.height * 4), Image.Resampling.LANCZOS)

result.save(output_path, "PNG")
print(f"Done: {result.width}x{result.height}")
