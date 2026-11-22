"""Confere legenda × fala: transcreve (Vosk) o áudio de cada bloco de legenda e compara com o texto.
Uso: MODELO_VOSK=... python3 conferir_legendas.py [arquivo_de_audio]  (padrão: ep01_dialogos.wav)"""
import difflib, json, os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from alinhar_vosk import ler, norm, reconhece  # noqa: E402
from separar_falas import SR  # noqa: E402
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
t = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/timeline.json")))
x = ler(sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "public/dentro-da-farda/ep01/ep01_dialogos.wav"))
ruins, notas = [], []
for i, b in enumerate(t["legendas"]):
    a, z = max(0, b["ini"] - 0.1), b["fim"] + 0.15
    ouvido = [w["word"] for w in reconhece(x[int(a * SR): int(z * SR)])]
    esperado = [norm(p["w"]) for p in b["palavras"]]
    nota = difflib.SequenceMatcher(a=esperado, b=[norm(w) for w in ouvido]).ratio()
    notas.append(nota)
    if nota < 0.5:
        ruins.append((b["ini"], " ".join(p["w"] for p in b["palavras"]), " ".join(ouvido), nota))
print(f"{len(t['legendas'])} blocos · semelhança legenda×áudio: mediana {np.median(notas):.2f}, mínima {min(notas):.2f}")
for ini, e, o, n in ruins:
    print(f"  {ini:6.2f}s ({n:.2f}) legenda: {e}\n            ouvido:  {o}")
