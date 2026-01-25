import os
import urllib.request
import zipfile
import shutil

FFMPEG_URL = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
ZIP_PATH = "ffmpeg.zip"
EXTRACT_DIR = "ffmpeg_temp"
TARGET_BIN = "ffmpeg.exe"

def download_ffmpeg():
    print(f"Downloading FFmpeg from {FFMPEG_URL}...")
    try:
        urllib.request.urlretrieve(FFMPEG_URL, ZIP_PATH)
        print("Download complete.")
    except Exception as e:
        print(f"Failed to download: {e}")
        return False

    print("Extracting...")
    try:
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)
        
        # Find ffmpeg.exe
        ffmpeg_path = None
        for root, dirs, files in os.walk(EXTRACT_DIR):
            if TARGET_BIN in files:
                ffmpeg_path = os.path.join(root, TARGET_BIN)
                break
        
        if ffmpeg_path:
            shutil.move(ffmpeg_path, TARGET_BIN)
            print(f"Success! {TARGET_BIN} is ready.")
        else:
            print("Could not find ffmpeg.exe in the zip.")
            
    except Exception as e:
        print(f"Extraction failed: {e}")
        return False
    finally:
        # Cleanup
        if os.path.exists(ZIP_PATH):
            os.remove(ZIP_PATH)
        if os.path.exists(EXTRACT_DIR):
            shutil.rmtree(EXTRACT_DIR)

    return True

if __name__ == "__main__":
    download_ffmpeg()
