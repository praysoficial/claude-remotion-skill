"""Faixa de diálogos inteira com o início de cada bloco de legenda (verde = ancorado num início de voz)."""
import json, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
t = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/timeline.json")))
SR = 16000
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(RAIZ, "public/dentro-da-farda/ep01/ep01_dialogos.wav"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
POR_LINHA = 20.0  # segundos por linha
W, H = 2000, 150
linhas = int(np.ceil(t["duracao"] / POR_LINHA))
img = Image.new("RGB", (W, H * linhas), (12, 14, 20)); dr = ImageDraw.Draw(img)
f = ImageFont.truetype(os.path.join(RAIZ, "public/fontes/Inter-600.ttf"), 14)
h = 160; n = len(x) // h; db = 20 * np.log10(np.sqrt((x[: n * h].reshape(n, h) ** 2).mean(1)) + 1e-9)
v = db > db.max() - 38
inicios = np.array([i / 100 for i in range(12, n) if v[i] and not v[i - 12:i].any()])
for r in range(linhas):
    a = r * POR_LINHA; y0 = r * H + 80
    seg = x[int(a * SR): int((a + POR_LINHA) * SR)]
    k = int(POR_LINHA * SR / W); env = np.abs(seg[: k * (len(seg) // k)]).reshape(-1, k).max(1)
    for i, e in enumerate(env[:W]):
        dr.line([(i, y0 - e * 55), (i, y0 + e * 55)], fill=(80, 100, 130))
    dr.text((4, r * H + 2), f"{a:.0f}s", fill=(200, 200, 200), font=f)
    for b in t["legendas"]:
        if a <= b["ini"] < a + POR_LINHA:
            X = int((b["ini"] - a) / POR_LINHA * W)
            ok = len(inicios) and np.min(np.abs(inicios - (b["ini"] + 0.05))) < 0.02
            cor = (80, 230, 120) if ok else (255, 190, 60)
            dr.line([(X, r * H + 18), (X, y0 + 60)], fill=cor, width=2)
            dr.text((X + 3, r * H + 18), " ".join(w["w"] for w in b["palavras"])[:28], fill=cor, font=f)
img.save(os.path.join(RAIZ, "out/dentro-da-farda/verificacao/legendas_sobre_a_voz.png"))
