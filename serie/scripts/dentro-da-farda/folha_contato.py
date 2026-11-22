"""Junta quadros em uma folha de contato, com o tempo de cada um."""
import sys, os, re
from PIL import Image, ImageDraw, ImageFont
saida, *arqs = sys.argv[1:]
ims = [Image.open(a) for a in arqs]
w, h = ims[0].size
cols = 4 if len(ims) > 6 else len(ims)
lin = (len(ims) + cols - 1) // cols
folha = Image.new("RGB", (cols * w + (cols + 1) * 12, lin * (h + 40) + 12), (20, 20, 24))
try:
    fonte = ImageFont.truetype("public/fontes/JetBrainsMono-700.ttf", 22)
except Exception:
    fonte = None
d = ImageDraw.Draw(folha)
for i, (a, im) in enumerate(zip(arqs, ims)):
    x = 12 + (i % cols) * (w + 12); y = 12 + (i // cols) * (h + 40)
    folha.paste(im, (x, y + 30))
    fr = int(re.search(r"(\d+)\.png$", a).group(1))
    d.text((x, y + 2), f"{i+1:02d} · {fr/30:6.2f}s · f{fr}", fill=(230, 230, 230), font=fonte)
folha.save(saida)
