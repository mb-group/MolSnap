from PIL import Image
import os

def convert_and_resize(input_path, output_dir=None):
    # Open the image
    img = Image.open(input_path)

    # Convert to PNG if not already
    if img.format != "PNG":
        img = img.convert("RGBA")  # ensure transparency support
        print("Converted to PNG.")

    # Resize if needed
    if img.size != (384, 384):
        img = img.resize((384, 384), Image.LANCZOS)
        print("Resized to 384x384.")

    # Build output path
    base = os.path.splitext(os.path.basename(input_path))[0]
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, base + ".png")
    else:
        output_path = os.path.join(os.path.dirname(input_path), base + ".png")

    # Save as PNG
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")