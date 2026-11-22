"""Alinhamento forçado palavra a palavra, sem modelo de reconhecimento de fala.

Ideia (a mesma de alinhadores como o aeneas):
  1. sintetiza cada palavra da fala com o espeak-ng (pt-br), uma por vez, e concatena;
     assim os limites de cada palavra no áudio sintético são EXATOS;
  2. extrai MFCC do áudio sintético e da gravação real;
  3. alinha as duas sequências por DTW;
  4. leva os limites das palavras do sintético para a gravação real.

Uso: python3 alinhar_palavras.py            (realinha todas as falas de falas.json)
Grava os novos tempos em falas.json (campo "palavras") e guarda a estimativa
anterior em "palavras_estimadas" para comparação.
"""
import json, os, re, subprocess, tempfile
import numpy as np

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SR = 16000
HOP = 160  # 10 ms
WIN = 400  # 25 ms
JSON = os.path.join(RAIZ, "src/dentro-da-farda/ep01/falas.json")
FALAS = os.path.join(RAIZ, "public/dentro-da-farda/ep01/falas")


def ler(caminho):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", caminho, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def sintetiza(palavra, pasta, i):
    arq = os.path.join(pasta, f"w{i}.wav")
    subprocess.run(["espeak-ng", "-v", "pt-br", "-s", "165", "-w", arq, palavra], check=True, capture_output=True)
    x = ler(arq)
    # tira o silêncio que o espeak põe nas pontas
    e = np.abs(x) > 0.01 * np.abs(x).max()
    idx = np.where(e)[0]
    return x[idx[0]: idx[-1] + 1] if len(idx) else x


# ── MFCC em numpy ────────────────────────────────────────────────────────────
def _mel(n_fft=512, n_mels=26):
    def hz2mel(f): return 2595 * np.log10(1 + f / 700)
    def mel2hz(m): return 700 * (10 ** (m / 2595) - 1)
    pts = mel2hz(np.linspace(hz2mel(80), hz2mel(7600), n_mels + 2))
    bins = np.floor((n_fft + 1) * pts / SR).astype(int)
    fb = np.zeros((n_mels, n_fft // 2 + 1))
    for m in range(1, n_mels + 1):
        a, b, c = bins[m - 1], bins[m], bins[m + 1]
        fb[m - 1, a:b] = (np.arange(a, b) - a) / max(1, b - a)
        fb[m - 1, b:c] = (c - np.arange(b, c)) / max(1, c - b)
    return fb


FB = _mel()
DCT = np.cos(np.pi / 26 * (np.arange(26)[None, :] + 0.5) * np.arange(13)[:, None])


def mfcc(x):
    x = np.append(x[0], x[1:] - 0.97 * x[:-1])
    n = 1 + max(0, (len(x) - WIN) // HOP)
    idx = np.arange(WIN)[None, :] + HOP * np.arange(n)[:, None]
    quadros = x[idx] * np.hamming(WIN)
    pot = np.abs(np.fft.rfft(quadros, 512)) ** 2
    m = np.log(pot @ FB.T + 1e-10)
    c = m @ DCT.T
    energia = np.log((quadros ** 2).sum(1) + 1e-10)[:, None]
    f = np.hstack([c[:, 1:], energia])
    f = (f - f.mean(0)) / (f.std(0) + 1e-8)  # normalização por fala
    d = np.vstack([f[1:2] - f[0:1], f[2:] - f[:-2], f[-1:] - f[-2:-1]]) / 2  # deltas
    return np.hstack([f, d])


def dtw(a, b, faixa=0.35):
    """DTW com restrição de faixa (Sakoe-Chiba). Devolve, para cada quadro de a, o quadro de b."""
    na, nb = len(a), len(b)
    an = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-9)
    bn = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-9)
    custo = 1 - an @ bn.T
    w = int(max(na, nb) * faixa) + abs(na - nb)
    INF = 1e18
    D = np.full((na + 1, nb + 1), INF); D[0, 0] = 0
    for i in range(1, na + 1):
        c = i * nb / na
        j0, j1 = max(1, int(c - w)), min(nb, int(c + w))
        for j in range(j0, j1 + 1):
            D[i, j] = custo[i - 1, j - 1] + min(D[i - 1, j], D[i, j - 1], D[i - 1, j - 1])
    # caminho de volta
    i, j = na, nb
    mapa = np.zeros(na, int)
    while i > 0 and j > 0:
        mapa[i - 1] = max(mapa[i - 1], j - 1)
        k = np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]])
        if k == 0: i, j = i - 1, j - 1
        elif k == 1: i -= 1
        else: j -= 1
    # mapa monotônico: primeiro quadro de b alinhado a cada quadro de a
    primeiro = np.zeros(na, int)
    i, j = na, nb
    caminho = []
    while i > 0 and j > 0:
        caminho.append((i - 1, j - 1))
        k = np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]])
        if k == 0: i, j = i - 1, j - 1
        elif k == 1: i -= 1
        else: j -= 1
    caminho.reverse()
    primeiro[:] = -1
    for ia, jb in caminho:
        if primeiro[ia] < 0:
            primeiro[ia] = jb
    for k in range(na):
        if primeiro[k] < 0:
            primeiro[k] = primeiro[k - 1] if k else 0
    return primeiro


def alinhar(texto, real):
    palavras = texto.split()
    limpas = [re.sub(r"[^\w]", "", w, flags=re.UNICODE) or w for w in palavras]
    with tempfile.TemporaryDirectory() as tmp:
        pedacos, inicios, fins = [], [], []
        t = 0
        pausa = np.zeros(int(0.06 * SR), np.float32)
        for i, (w, bruto) in enumerate(zip(limpas, palavras)):
            s = sintetiza(w, tmp, i)
            inicios.append(t); pedacos.append(s); t += len(s); fins.append(t)
            gap = pausa if not re.search(r"[.,:;?!…—]$", bruto) else np.zeros(int(0.22 * SR), np.float32)
            pedacos.append(gap); t += len(gap)
        sint = np.concatenate(pedacos)
    fs, fr = mfcc(sint), mfcc(real)
    mapa = dtw(fs, fr)
    q = lambda amostra: min(len(mapa) - 1, amostra // HOP)
    out = []
    for w, a, b in zip(palavras, inicios, fins):
        t0 = mapa[q(a)] * HOP / SR
        t1 = mapa[q(b - 1)] * HOP / SR + HOP / SR
        out.append({"w": w, "t0": round(float(t0), 3), "t1": round(float(max(t1, t0 + 0.06)), 3)})
    # garante ordem e sem sobreposição
    for i in range(1, len(out)):
        out[i]["t0"] = max(out[i]["t0"], out[i - 1]["t0"] + 0.04)
        out[i - 1]["t1"] = min(out[i - 1]["t1"], max(out[i]["t0"], out[i - 1]["t0"] + 0.04))
    return out


def main():
    d = json.load(open(JSON))
    for k, f in d.items():
        real = ler(os.path.join(FALAS, f["arquivo"]))
        if "palavras_estimadas" not in f:
            f["palavras_estimadas"] = f["palavras"]
        f["palavras"] = alinhar(f["texto"], real)
        dif = [abs(a["t0"] - b["t0"]) for a, b in zip(f["palavras"], f["palavras_estimadas"])]
        print(f"{k} {f['quem']:9} diferença média {np.mean(dif):.2f}s · máx {max(dif):.2f}s")
    json.dump(d, open(JSON, "w"), ensure_ascii=False)


if __name__ == "__main__":
    main()
