import sys
from PIL import Image

def remove_white(image_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for r, g, b, a in data:
        avg = (r + g + b) / 3.0
        # Check if it's very close to white (light grey/white)
        # We also check if it's relatively neutral (R, G, B are similar)
        if avg > 220 and abs(r-g) < 20 and abs(g-b) < 20:
            # Distance from 255. 
            # If avg == 255 -> alpha = 0
            # If avg == 220 -> alpha = 255
            alpha = int(255 * (255 - avg) / 35.0)
            alpha = max(0, min(255, alpha))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(image_path, "PNG")

paths = [
    r'apps/corporate/public/logo maxirest ONE.png',
    r'apps/erp/public/logo maxirest ONE.png',
    r'apps/satelital/public/logo maxirest ONE.png'
]

for p in paths:
    try:
        remove_white(p)
        print(f"Processed {p}")
    except Exception as e:
        print(f"Failed {p}: {e}")
