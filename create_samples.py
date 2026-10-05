import os
import numpy as np
from PIL import Image, ImageDraw

os.makedirs("backend/sample_images", exist_ok=True)

def create_sample_leaf(filename, color_bg=(34, 139, 34), spot_color=None, spots=15):
    img = Image.new("RGB", (300, 300), (240, 245, 240))
    draw = ImageDraw.Draw(img)
    
    # Draw leaf silhouette
    draw.polygon([(150, 20), (260, 100), (240, 240), (150, 280), (60, 240), (40, 100)], fill=color_bg)
    draw.line([(150, 20), (150, 280)], fill=(20, 100, 20), width=4)
    draw.line([(150, 100), (220, 70)], fill=(20, 100, 20), width=2)
    draw.line([(150, 140), (80, 110)], fill=(20, 100, 20), width=2)
    draw.line([(150, 180), (210, 160)], fill=(20, 100, 20), width=2)
    
    if spot_color:
        np.random.seed(42)
        for _ in range(spots):
            cx = np.random.randint(70, 230)
            cy = np.random.randint(60, 230)
            r = np.random.randint(6, 18)
            draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=spot_color, outline=(40,20,10))
            
    img.save(os.path.join("backend/sample_images", filename), quality=95)
    print(f"Created sample image: {filename}")

create_sample_leaf("apple_scab.jpg", spot_color=(100, 70, 40), spots=12)
create_sample_leaf("corn_rust.jpg", color_bg=(120, 180, 50), spot_color=(180, 60, 20), spots=25)
create_sample_leaf("tomato_blight.jpg", spot_color=(50, 30, 20), spots=18)
create_sample_leaf("grape_rot.jpg", spot_color=(80, 20, 30), spots=15)
create_sample_leaf("healthy_leaf.jpg", color_bg=(45, 160, 45), spot_color=None)
