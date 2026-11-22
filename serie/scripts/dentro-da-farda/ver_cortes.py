"""Desenha a forma de onda de cada voz com os cortes escolhidos (verificação visual)."""
import json, subprocess, os, numpy as np
from PIL import Image, ImageDraw
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SR = 16000
d = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/falas.json")))
quem = ["NARRADOR", "ARTHUR", "DIEGO", "MENDES", "HELENA", "VICTOR"]
W, H = 1800, 120
img = Image.new("RGB", (W, H * len(quem)), (14, 16, 24)); dr = ImageDraw.Draw(img)
for qi, q in enumerate(quem):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(RAIZ, f"public/dentro-da-farda/ep01/bruto/{q.lower()}.mp3"),
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); dur = len(x) / SR
    n = len(x) // W; env = np.abs(x[: n * W]).reshape(W, n).max(1); env /= env.max()
    y0 = qi * H + H // 2
    linhas = [v for v in d.values() if v["quem"] == q]
    for r in linhas[0]["bruto_trechos"]:
        dr.rectangle([int(r[0] / dur * W), y0 + 40, int(r[1] / dur * W), y0 + 44], fill=(90, 90, 110))
    for i, v in enumerate(env):
        dr.line([(i, y0 - v * 38), (i, y0 + v * 38)], fill=(120, 170, 230))
    for v in linhas:
        a, b = int(v["bruto_ini"] / dur * W), int(v["bruto_fim"] / dur * W)
        dr.rectangle([a, qi * H + 6, b, qi * H + H - 6], outline=(240, 80, 80), width=2)
        dr.text((a + 4, qi * H + 8), v["id"], fill=(255, 210, 210))
    dr.text((4, qi * H + H - 16), f"{q}  {dur:.1f}s", fill=(255, 255, 255))
img.save(os.path.join(RAIZ, "out/dentro-da-farda/verificacao/cortes_das_falas.png"))
