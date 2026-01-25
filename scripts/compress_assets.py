import os
import subprocess

VIDEO_DIR = "public/videos"
FFMPEG_BIN = "ffmpeg.exe"

def compress_videos():
    if not os.path.exists(FFMPEG_BIN):
        print("Error: ffmpeg.exe not found.")
        return

    files = [f for f in os.listdir(VIDEO_DIR) if f.endswith(".mp4")]
    
    print(f"Found {len(files)} videos. Checking sizes...")

    for file in files:
        input_path = os.path.join(VIDEO_DIR, file)
        
        # Check size (skip if < 25MB)
        size_mb = os.path.getsize(input_path) / (1024 * 1024)
        if size_mb < 25:
            print(f"Skipping {file} ({size_mb:.2f} MB), already small enough.")
            continue

        temp_output = os.path.join(VIDEO_DIR, "temp_" + file)
        
        print(f"Compressing {file} ({size_mb:.2f} MB)...")
        
        # Command to compress video: 720p, CRF 28 (good per quality), AAC audio
        cmd = [
            FFMPEG_BIN, "-y", "-i", input_path,
            "-vcodec", "libx264", "-crf", "28", "-preset", "faster",
            "-acodec", "aac", "-b:a", "128k",
            "-vf", "scale=-2:720", 
            temp_output
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Replace original with compressed
            os.replace(temp_output, input_path)
            print(f"DONE: {file}")
            
        except subprocess.CalledProcessError as e:
            print(f"FAILED to compress {file}: {e}")
            if os.path.exists(temp_output):
                os.remove(temp_output)

if __name__ == "__main__":
    compress_videos()
