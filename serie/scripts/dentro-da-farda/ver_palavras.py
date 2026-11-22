"""Forma de onda de cada fala com os inícios de palavra: vermelho = estimativa por sílabas (em cima), ciano = alinhamento DTW (embaixo)."""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
d = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/falas.json")))
ids = sys.argv[2:] or list(d)
W, H = 1900, 170
img = Image.new("RGB", (W, H * len(ids)), (12, 14, 20)); dr = ImageDraw.Draw(img)
fonte = ImageFont.truetype(os.path.join(RAIZ, "public/fontes/Inter-600.ttf"), 15)
for r, k in enumerate(ids):
    f = d[k]
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(RAIZ, "public/dentro-da-farda/ep01/falas", f["arquivo"]), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
    dur = len(x) / 16000; n = len(x) // W
    env = np.sqrt((x[: n * W].reshape(W, n) ** 2).mean(1)); env /= env.max() + 1e-9
    y0 = r * H + H // 2
    for i, v in enumerate(env):
        dr.line([(i, y0 - v * 45), (i, y0 + v * 45)], fill=(90, 110, 140))
    for p in f.get("palavras_estimadas", []):
        X = int(p["t0"] / dur * W); dr.line([(X, r * H + 4), (X, y0)], fill=(255, 80, 90), width=2)
        dr.text((X + 2, r * H + 4), p["w"], fill=(255, 140, 150), font=fonte)
    for p in f["palavras"]:
        X = int(p["t0"] / dur * W); dr.line([(X, y0), (X, r * H + H - 4)], fill=(60, 230, 255), width=2)
        dr.text((X + 2, r * H + H - 22), p["w"], fill=(140, 240, 255), font=fonte)
    dr.text((W - 90, r * H + 4), f"fala {k}", fill=(255, 255, 255), font=fonte)
img.save(sys.argv[1])
