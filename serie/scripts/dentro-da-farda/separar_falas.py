"""Separa o áudio de cada personagem em falas e estima o tempo de cada palavra.

Entrada:  public/dentro-da-farda/ep01/bruto/<personagem>.mp3 (um arquivo por voz, falas na ordem)
Saída:    public/dentro-da-farda/ep01/falas/ep01_NN_<personagem>.wav
          src/dentro-da-farda/ep01/falas.json (duração, palavras com tempo, envelope por frame)

Por que não cortar só nos silêncios: nestas gravações as pausas entre falas têm o
mesmo tamanho das pausas dentro de uma fala. Então o corte é escolhido por
programação dinâmica, cruzando os silêncios com o tamanho esperado de cada fala
(proporcional às sílabas do texto).

O tempo por palavra é ESTIMADO pela forma de onda: pausas internas são casadas com a
pontuação, e dentro de cada trecho as palavras são distribuídas por sílabas. Não há
reconhecimento de fala neste ambiente.
"""
import json, math, os, re, subprocess, sys
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
sys.path.insert(0, AQUI)
from falas_ep01 import F  # noqa: E402

SR = 48000
FPS = 30
BRUTO = os.path.join(RAIZ, "public/dentro-da-farda/ep01/bruto")
SAIDA = os.path.join(RAIZ, "public/dentro-da-farda/ep01/falas")
JSON_OUT = os.path.join(RAIZ, "src/dentro-da-farda/ep01/falas.json")


def ler(caminho):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", caminho, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def salvar(caminho, x):
    x = np.clip(x, -1, 1)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-c:a", "pcm_s16le", caminho], input=x.astype(np.float32).tobytes(), check=True)


def rms_db(x, hop=0.01):
    n = int(SR * hop)
    m = len(x) // n
    fr = x[: m * n].reshape(m, n)
    return 20 * np.log10(np.sqrt((fr ** 2).mean(axis=1)) + 1e-9), hop


def regioes(x, limiar_rel=-38, min_sil=0.18, min_fala=0.06):
    """Trechos com voz: [(ini, fim)] em segundos."""
    db, hop = rms_db(x)
    limiar = db.max() + limiar_rel
    voz = db > limiar
    out, ini = [], None
    for i, v in enumerate(voz):
        if v and ini is None:
            ini = i
        if not v and ini is not None:
            out.append([ini * hop, i * hop]); ini = None
    if ini is not None:
        out.append([ini * hop, len(voz) * hop])
    # junta trechos separados por silêncio curto demais
    junt = []
    for r in out:
        if junt and r[0] - junt[-1][1] < min_sil:
            junt[-1][1] = r[1]
        else:
            junt.append(r)
    return [r for r in junt if r[1] - r[0] >= min_fala]


VOG = "aeiouáéíóúâêôãõàü"


def silabas(t):
    t = t.lower()
    grupos = re.findall(f"[{VOG}y]+", t)
    return max(1, len(grupos))


def segmentar(regs, textos):
    """Escolhe N-1 cortes entre os trechos de voz (programação dinâmica)."""
    n, k = len(textos), len(regs)
    assert k >= n, f"só {k} trechos de voz para {n} falas"
    syl = np.array([sum(silabas(w) for w in re.findall(r"\w+", t)) for t in textos], float)
    fala_total = sum(r[1] - r[0] for r in regs)
    esperado = fala_total * syl / syl.sum()

    def custo_seg(a, b, j):  # trechos a..b-1 formam a fala j
        dur = regs[b - 1][1] - regs[a][0]
        return (math.log(dur / esperado[j])) ** 2

    def bonus_corte(i):  # corte entre trecho i-1 e i
        return -0.35 * math.log(regs[i][0] - regs[i - 1][1] + 1e-3)

    INF = 1e18
    dp = [[INF] * (k + 1) for _ in range(n + 1)]
    pai = [[-1] * (k + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    for j in range(1, n + 1):
        for b in range(j, k + 1):
            for a in range(j - 1, b):
                if dp[j - 1][a] >= INF:
                    continue
                c = dp[j - 1][a] + custo_seg(a, b, j - 1) + (bonus_corte(a) if a > 0 else 0)
                if c < dp[j][b]:
                    dp[j][b], pai[j][b] = c, a
    cortes, b = [], k
    for j in range(n, 0, -1):
        a = pai[j][b]; cortes.append((a, b)); b = a
    cortes.reverse()
    return cortes, esperado


def frases(texto):
    """Quebra a fala em frases nos sinais de pausa, preservando as palavras."""
    partes = re.split(r"(?<=[.,:;?!…—])\s+", texto.strip())
    return [p for p in partes if re.search(r"\w", p)]


def tempos_palavras(texto, trechos, t0):
    """Distribui as palavras pelo tempo COM VOZ da fala (tempos relativos a t0).

    1. Cada silêncio entre trechos é casado com a fronteira de frase (pontuação)
       mais próxima na proporção de sílabas; silêncios sem pontuação perto ficam
       dentro da frase.
    2. Cada grupo de frases ocupa o intervalo entre seus silêncios, e dentro dele
       as palavras se repartem por sílabas, pulando qualquer silêncio restante.
    """
    ws = texto.split()
    pesos = np.array([max(1, silabas(w)) + 0.4 for w in ws])
    cum = np.concatenate([[0], np.cumsum(pesos)]) / pesos.sum()  # fração antes de cada palavra
    tr = [list(x) for x in trechos]
    voz = np.array([b - a for a, b in tr]); V = voz.sum()
    acc = np.concatenate([[0], np.cumsum(voz)]) / V  # fração de voz no início de cada trecho
    # fronteiras de frase: índice da palavra que começa depois de pontuação
    fronteiras = [i for i in range(1, len(ws)) if re.search(r"[.,:;?!…—]$", ws[i - 1])]
    usados, cortes = set(), []  # (índice da palavra, índice do silêncio)
    for g in range(1, len(tr)):
        cand = [(abs(cum[i] - acc[g]), i) for i in fronteiras if i not in usados]
        if cand:
            d, i = min(cand)
            if d < 0.18:
                usados.add(i); cortes.append((i, g))
    cortes.sort()
    # monta grupos: palavras [w0, w1) ocupam os trechos [g0, g1)
    limites_w = [0] + [i for i, _ in cortes] + [len(ws)]
    limites_g = [0] + [g for _, g in cortes] + [len(tr)]
    palavras = []
    for k in range(len(limites_w) - 1):
        w0, w1 = limites_w[k], limites_w[k + 1]
        g0, g1 = limites_g[k], limites_g[k + 1]
        if g1 <= g0:  # dois cortes no mesmo silêncio (não deve acontecer): usa o trecho anterior
            g0 = max(0, g1 - 1)
        segs = tr[g0:g1]
        vz = np.array([b - a for a, b in segs]); Vg = vz.sum()
        ac = np.concatenate([[0], np.cumsum(vz)])
        pw = pesos[w0:w1]; cw = np.concatenate([[0], np.cumsum(pw)]) / pw.sum() * Vg

        def real(v):  # posição em tempo de voz -> tempo real
            j = min(int(np.searchsorted(ac, v, side="right")) - 1, len(segs) - 1)
            return segs[j][0] + (v - ac[j])

        for i, w in enumerate(ws[w0:w1]):
            palavras.append({"w": w, "t0": round(real(cw[i]) - t0, 3), "t1": round(real(cw[i + 1] - 1e-6) - t0, 3)})
    return palavras


def filtro_telefone(x):
    """Voz de gravação de celular: passa-faixa 300–3400 Hz e leve saturação."""
    tmp = subprocess.run(
        ["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
         "-af", "highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=4,volume=1.4",
         "-f", "f32le", "-"], input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    y = np.frombuffer(tmp, dtype=np.float32).copy()
    return np.tanh(y * 1.6) / np.tanh(1.6)


def envelope(x):
    n = SR // FPS
    m = math.ceil(len(x) / n)
    x = np.pad(x, (0, m * n - len(x)))
    e = np.sqrt((x.reshape(m, n) ** 2).mean(axis=1))
    e = e / (e.max() + 1e-9)
    return [round(float(v), 3) for v in e]


def main():
    os.makedirs(SAIDA, exist_ok=True)
    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)
    por_quem = {}
    for i, (q, t) in enumerate(F, 1):
        por_quem.setdefault(q, []).append((i, t))
    resultado = {}
    relatorio = []
    for quem, linhas in por_quem.items():
        x = ler(os.path.join(BRUTO, f"{quem.lower()}.mp3"))
        regs = regioes(x)
        cortes, esperado = segmentar(regs, [t for _, t in linhas])
        for (a, b), (num, texto), esp in zip(cortes, linhas, esperado):
            # descarta estalos e respirações nas bordas: trecho curto e fraco
            def pico(r):  # energia média: um estalo tem pico alto mas pouca energia
                seg = x[int(r[0] * SR): int(r[1] * SR)]
                return float(np.sqrt((seg ** 2).mean()))
            topo = max(pico(r) for r in regs[a:b])
            while b - a > 1 and regs[a][1] - regs[a][0] < 0.3 and pico(regs[a]) < 0.35 * topo:
                a += 1
            while b - a > 1 and regs[b - 1][1] - regs[b - 1][0] < 0.6 and pico(regs[b - 1]) < 0.2 * topo:
                b -= 1
            ini, fim = regs[a][0], regs[b - 1][1]
            pre, pos = 0.05, 0.12
            s0, s1 = max(0, ini - pre), min(len(x) / SR, fim + pos)
            trecho = x[int(s0 * SR): int(s1 * SR)].copy()
            # fade curto nas pontas para não estalar
            f = int(0.01 * SR); rampa = np.linspace(0, 1, f)
            trecho[:f] *= rampa; trecho[-f:] *= rampa[::-1]
            if quem == "VICTOR":
                trecho = filtro_telefone(trecho)
            nome = f"ep01_{num:02d}_{quem.lower()}.wav"
            salvar(os.path.join(SAIDA, nome), trecho)
            internos = [(r[0], r[1]) for r in regs[a:b]]
            palavras = tempos_palavras(texto, internos, s0)
            dur = len(trecho) / SR
            resultado[f"{num:02d}"] = {
                "id": f"{num:02d}", "quem": quem, "texto": texto, "arquivo": nome,
                "dur": round(dur, 3), "palavras": palavras, "env": envelope(trecho),
                "trechos_de_voz": b - a,
                "bruto_ini": round(s0, 3), "bruto_fim": round(s1, 3),
                "bruto_trechos": [[round(r[0], 3), round(r[1], 3)] for r in regs],
            }
            fala = fim - ini
            relatorio.append((num, quem, round(fala, 2), round(esp, 2), round(fala / esp, 2), b - a, texto[:48]))
    json.dump(dict(sorted(resultado.items())), open(JSON_OUT, "w"), ensure_ascii=False)
    print(f"{'#':>3} {'quem':9} {'real':>5} {'esper':>5} {'razão':>5} trechos  texto")
    for r in sorted(relatorio):
        alerta = "  <-- CONFERIR" if not (0.6 <= r[4] <= 1.6) else ""
        print(f"{r[0]:3d} {r[1]:9} {r[2]:5.2f} {r[3]:5.2f} {r[4]:5.2f} {r[5]:5d}    {r[6]}{alerta}")


if __name__ == "__main__":
    main()
