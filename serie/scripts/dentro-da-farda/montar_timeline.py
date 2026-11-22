"""Monta a timeline única do episódio 1 a partir das durações REAIS das falas.

Lê   src/dentro-da-farda/ep01/falas.json   (gerado por separar_falas.py)
Gera src/dentro-da-farda/ep01/timeline.json   (o que o Remotion lê: falas, cenas, marcas, legendas)
     public/dentro-da-farda/ep01/ep01_mix.wav       (voz + trilha + efeitos, faixa final)
     public/dentro-da-farda/ep01/ep01_dialogos.wav  (só as falas, na ordem narrativa)
     out/dentro-da-farda/ep01/ep01.srt               (legendas)

Nenhuma fala é acelerada: o vídeo se ajusta ao áudio. Trilha e efeitos são
sintetizados aqui (sem bancos de terceiros), com semente fixa.
"""
import json, math, os, re, subprocess
import numpy as np

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SR = 48000
FPS = 30
rng = np.random.default_rng(31)

falas = json.load(open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/falas.json")))

# ── 1. Ordem, cenas e pausas (segundos de silêncio ANTES de cada fala) ──────────
# Pausas narrativas: 04→05 é o choque (só a goteira); 17→18 é a não-resposta da
# Helena; 12 entra por cima do fim da 11 (Mendes interrompe).
ROTEIRO = [
    ("carro",       [("01", 0.30), ("02", 0.45), ("03", 0.15), ("04", 0.55), ("05", 0.90), ("06", 0.20)]),
    ("arthur",      [("07", 0.40)]),
    ("sala",        [("08", 0.55), ("09", 0.15), ("10", 0.15), ("11", 0.40), ("12", -0.12), ("13", 0.70)]),
    ("corredor",    [("14", 0.55), ("15", 0.20), ("16", 0.15), ("17", 0.40), ("18", 1.60)]),
    ("testemunha",  [("19", 0.55), ("20", 0.20), ("21", 0.25), ("22", 0.70), ("23", 0.30), ("24", 0.25)]),
    ("jogadas",     [("25", 0.60), ("26", None)]),
    ("voto",        [("27", 0.30)]),
]
SEGURA_VOTO = 3.2  # segundos parados no voto depois da última palavra

linhas, cenas = [], []
t = 0.0
fim_jogada_a = None
for cena, itens in ROTEIRO:
    ini_cena = t
    for fid, pausa in itens:
        f = falas[fid]
        if fid == "26":
            # SEGUIR começa quando termina o bloco de INTERROGAR, de mesma duração
            ini = fim_jogada_a
        else:
            ini = t + pausa
        if fid == "25":
            bloco = max(falas["25"]["dur"], falas["26"]["dur"]) + 0.4
            fim_jogada_a = ini + bloco
        linhas.append({**{k: f[k] for k in ("id", "quem", "texto", "arquivo", "dur")},
                       "ini": round(ini, 3), "fim": round(ini + f["dur"], 3),
                       "palavras": [{"w": p["w"], "t0": round(ini + p["t0"], 3), "t1": round(ini + p["t1"], 3)} for p in f["palavras"]],
                       "env": f["env"], "cena": cena})
        t = ini + f["dur"]
        if fid == "26":
            t = max(t, fim_jogada_a + bloco)
    # a cena dura até o começo da próxima fala (a transição fica dentro da pausa)
    cenas.append({"id": cena, "ini": round(ini_cena, 3)})
total = t + SEGURA_VOTO
for i, c in enumerate(cenas):
    c["fim"] = cenas[i + 1]["ini"] if i + 1 < len(cenas) else round(total, 3)
# corta cena no meio da pausa anterior à primeira fala da cena seguinte
for i in range(1, len(cenas)):
    prim = next(l for l in linhas if l["cena"] == cenas[i]["id"])
    ant = [l for l in linhas if l["cena"] == cenas[i - 1]["id"]][-1]
    corte = round(ant["fim"] + (prim["ini"] - ant["fim"]) * 0.45, 3)
    cenas[i - 1]["fim"] = corte; cenas[i]["ini"] = corte
cenas[0]["ini"] = 0.0

L = {l["id"]: l for l in linhas}


def palavra(fid, alvo, qual="t0"):
    for p in L[fid]["palavras"]:
        if re.sub(r"\W", "", p["w"].lower()) == alvo:
            return p[qual]
    raise KeyError((fid, alvo))


# ── 2. Marcas: momentos que imagem e som compartilham ───────────────────────────
M = {
    "celular_achado": L["02"]["ini"] - 0.55,
    "play": L["04"]["ini"] - 0.35,
    "audio_corta": L["04"]["fim"],
    "pasta_empurrada": L["08"]["ini"] + 0.2,
    "mao_estendida": palavra("10", "celular") - 0.15,
    "entrega_celular": L["12"]["fim"] + 0.35,
    "contador": palavra("08", "trinta"),
    "toca_bolso": palavra("13", "áudio") - 0.2,
    "helena_vira": L["16"]["fim"] - 0.3,
    "helena_para": L["17"]["fim"] + 0.15,
    "helena_sai": L["18"]["ini"] - 0.45,
    "porta_mendes_abre": L["21"]["ini"] - 0.45,
    "porta_mendes_fecha": L["21"]["fim"] + 0.25,
    "tic_relogio": L["21"]["fim"] + 0.7,
    "split_a": L["25"]["ini"] - 0.45,
    "split_b": L["26"]["ini"] - 0.45,
    "split_fim": L["26"]["ini"] + max(L["25"]["dur"], L["26"]["dur"]) + 0.4 - 0.05,
    "cartela_voto": palavra("27", "escreve"),
    "fim": total,
}
M = {k: round(v, 3) for k, v in M.items()}


# ── 3. Legendas: blocos curtos (até 2 linhas), quebrando em pontuação ───────────
def blocos_de_legenda(l):
    """Blocos quebram na PONTUAÇÃO (onde há pausa real na voz). Frases de até ~56
    caracteres ficam inteiras (2 linhas); só frases maiores são divididas no meio."""
    ws, out, atual = l["palavras"], [], []
    for i, p in enumerate(ws):
        atual.append(p)
        chars = sum(len(x["w"]) + 1 for x in atual)
        fim_frase = re.search(r"[.?!:…—]$", p["w"])
        virgula = re.search(r",$", p["w"]) and chars > 18
        if fim_frase or virgula or chars > 44 or i == len(ws) - 1:
            out.append(atual); atual = []
    return [{"quem": l["quem"], "ini": b[0]["t0"], "fim": b[-1]["t1"], "palavras": b} for b in out]


legendas = [b for l in linhas for b in blocos_de_legenda(l)]
# cada bloco fica até o próximo começar (no máximo +0.5 s), para não piscar
for i, b in enumerate(legendas):
    prox = legendas[i + 1]["ini"] if i + 1 < len(legendas) else b["fim"] + 0.5
    b["fim"] = round(min(prox - 0.03, b["fim"] + 0.5), 3)

timeline = {"fps": FPS, "duracao": round(total, 3), "frames": math.ceil(total * FPS),
            "cenas": cenas, "falas": linhas, "marcas": M, "legendas": legendas}
os.makedirs(os.path.join(RAIZ, "src/dentro-da-farda/ep01"), exist_ok=True)
json.dump(timeline, open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/timeline.json"), "w"), ensure_ascii=False)


# ── 4. Áudio: falas na ordem ────────────────────────────────────────────────────
def ler(caminho):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", caminho, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


N = int(math.ceil(total * SR)) + SR
voz = np.zeros(N, np.float32)
for l in linhas:
    x = ler(os.path.join(RAIZ, "public/dentro-da-farda/ep01/falas", l["arquivo"]))
    # nivela cada fala pelo RMS dos trechos com voz (vozes geradas separadamente)
    ativo = x[np.abs(x) > 0.02]
    rms = np.sqrt((ativo ** 2).mean()) if len(ativo) else 0.1
    x = x * (0.11 / rms)
    a = int(l["ini"] * SR); voz[a:a + len(x)] += x

# ── 5. Efeitos sintetizados ─────────────────────────────────────────────────────
sfx = np.zeros(N, np.float32)


def por(sinal, t0, ganho=1.0):
    a = int(t0 * SR); b = min(N, a + len(sinal))
    if a < N:
        sfx[a:b] += (sinal[: b - a] * ganho).astype(np.float32)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def ruido(n):
    return rng.standard_normal(n).astype(np.float32)


def passa_baixa(x, fc):
    a = math.exp(-2 * math.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s = (1 - a) * v + a * s; y[i] = s
    return y


def gota():
    n = int(0.18 * SR); tt = np.arange(n) / SR
    f = 1400 * np.exp(-tt * 18) + 600
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.035) * 0.5


def clique_rele(forte=1.0):
    n = int(0.03 * SR)
    return passa_baixa(ruido(n), 3000) * env_exp(n, 0.004) * 1.2 * forte


def passo():
    n = int(0.14 * SR)
    return passa_baixa(ruido(n), 500) * env_exp(n, 0.025) * 1.6 + np.sin(2 * np.pi * 70 * np.arange(n) / SR) * env_exp(n, 0.03) * 0.5


def notificacao():
    n = int(0.32 * SR); tt = np.arange(n) / SR
    s = np.where(tt < 0.12, np.sin(2 * np.pi * 1320 * tt), np.sin(2 * np.pi * 1760 * tt))
    return s * env_exp(n, 0.09) * 0.22


def toque_tela():
    n = int(0.02 * SR)
    return passa_baixa(ruido(n), 5000) * env_exp(n, 0.003) * 0.5


def porta(fecha=True):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    baque = passa_baixa(ruido(n), 260) * env_exp(n, 0.06) * 2.2 + np.sin(2 * np.pi * 55 * tt) * env_exp(n, 0.09) * 0.9
    trinco = np.zeros(n); k = int(0.07 * SR)
    trinco[k:k + int(0.015 * SR)] = passa_baixa(ruido(int(0.015 * SR)), 4000) * 0.8
    return (baque + trinco) if fecha else passa_baixa(ruido(n), 700) * env_exp(n, 0.12) * 0.7


def tic():
    n = int(0.05 * SR)
    return np.sin(2 * np.pi * 2400 * np.arange(n) / SR) * env_exp(n, 0.006) * 0.5


def impacto():
    n = int(1.6 * SR); tt = np.arange(n) / SR
    f = 60 * np.exp(-tt * 2) + 32
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.45) * 0.9
            + passa_baixa(ruido(n), 180) * env_exp(n, 0.2) * 0.6)


def zumbido_fluorescente(dur):
    n = int(dur * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 120 * tt) * 0.5 + np.sin(2 * np.pi * 240 * tt) * 0.2) * 0.035


def carro_passando():
    n = int(2.2 * SR); tt = np.arange(n) / SR
    e = np.exp(-((tt - 1.1) / 0.45) ** 2)
    return passa_baixa(ruido(n), 900) * e * 0.5


def isqueiro():
    n = int(0.25 * SR)
    s = passa_baixa(ruido(n), 6000) * env_exp(n, 0.01) * 0.9
    s[int(0.05 * SR):] += passa_baixa(ruido(n - int(0.05 * SR)), 1500) * env_exp(n - int(0.05 * SR), 0.08) * 0.3
    return s


def teclado(dur):
    out = np.zeros(int(dur * SR), np.float32); t0 = 0.0
    while t0 < dur - 0.1:
        k = int(t0 * SR); c = passa_baixa(ruido(int(0.015 * SR)), 2500) * env_exp(int(0.015 * SR), 0.003) * 0.25
        out[k:k + len(c)] += c[: len(out) - k]
        t0 += rng.uniform(0.07, 0.22) if rng.random() > 0.08 else rng.uniform(0.5, 1.2)
    return out


def ini_cena(c):
    return next(x for x in cenas if x["id"] == c)


# estacionamento: goteira irregular, relé do pisca-alerta
c = ini_cena("carro"); c2 = ini_cena("arthur")
tg = 0.3
gotas = []
while tg < c2["fim"]:
    por(gota(), tg, 0.55); gotas.append(round(tg, 3)); tg += rng.uniform(1.3, 2.3)
for k in range(int((c2["fim"]) / 0.55)):
    por(clique_rele(1.0 if k % 2 == 0 else 0.6), 0.2 + k * 0.55, 0.25)
por(passo(), 0.05, 0.5); por(passo(), 0.55, 0.45)
por(notificacao(), M["celular_achado"])
por(toque_tela(), M["play"])
# gota isolada no silêncio depois do áudio do Victor
por(gota(), M["audio_corta"] + 0.35, 0.8); gotas.append(round(M["audio_corta"] + 0.35, 3))
timeline["gotas"] = sorted(gotas)

# inícios de voz reais na faixa de diálogos (energia por 10 ms, depois de 120 ms de silêncio)
_h = int(0.01 * SR); _n = len(voz) // _h
_db = 20 * np.log10(np.sqrt((voz[: _n * _h].reshape(_n, _h) ** 2).mean(1)) + 1e-9)
_v = _db > _db.max() - 38
inicios_voz = np.array([i / 100 for i in range(12, _n) if _v[i] and not _v[i - 12:i].any()])
ajustes = []
for b in timeline["legendas"]:
    d = inicios_voz - b["ini"]
    k = int(np.argmin(np.abs(d)))
    if abs(d[k]) <= 0.3:
        novo = round(float(inicios_voz[k]) - 0.05, 3)
        ajustes.append(novo - b["ini"])
        desloc = novo - b["ini"]
        b["ini"] = novo
        b["palavras"][0]["t0"] = round(b["palavras"][0]["t0"] + desloc, 3)
for i, b in enumerate(timeline["legendas"]):
    if i + 1 < len(timeline["legendas"]):
        b["fim"] = round(min(b["fim"], timeline["legendas"][i + 1]["ini"] - 0.03), 3)
legendas = timeline["legendas"]
print(f"  legendas: {len(legendas)} blocos, {len(ajustes)} ancorados num início de voz (ajuste médio {np.mean(np.abs(ajustes)) if ajustes else 0:.2f} s)")
timeline["rele_periodo"] = 0.55
json.dump(timeline, open(os.path.join(RAIZ, "src/dentro-da-farda/ep01/timeline.json"), "w"), ensure_ascii=False)

# delegacia: teclado distante e zumbido de lâmpada
s = ini_cena("sala"); por(teclado(s["fim"] - s["ini"]), s["ini"], 0.25)
por(passa_baixa(ruido(int(0.4 * SR)), 300) * env_exp(int(0.4 * SR), 0.08), M["pasta_empurrada"], 0.9)
por(impacto(), M["contador"], 0.55); por(tic(), M["contador"], 0.8)
for cid in ("corredor", "testemunha"):
    cc = ini_cena(cid); por(zumbido_fluorescente(cc["fim"] - cc["ini"]), cc["ini"])
for k in range(3):
    por(passo(), M["helena_sai"] + k * 0.42, 0.45)
por(porta(False), M["porta_mendes_abre"], 0.6)
por(porta(True), M["porta_mendes_fecha"], 0.9)
por(tic(), M["tic_relogio"], 1.0)

# jogadas: porta de interrogatório (A) e rua com isqueiro e carro (B)
por(porta(False), M["split_a"] + 0.3, 0.7)
por(isqueiro(), M["split_b"] + 0.6, 0.8)
por(carro_passando(), M["split_b"] + 1.6, 0.9)
por(impacto(), M["cartela_voto"], 0.5)

# ── 6. Trilha original: drone grave + pulso lento + tensão que sobe no voto ─────
tt = np.arange(N) / SR
drone = (np.sin(2 * np.pi * 55 * tt) + 0.6 * np.sin(2 * np.pi * 55.4 * tt) + 0.3 * np.sin(2 * np.pi * 82.4 * tt)) * 0.10
drone *= 0.75 + 0.25 * np.sin(2 * np.pi * tt / 9.0)
pulso = np.zeros(N, np.float32); periodo = 60 / 72
kick_n = int(0.25 * SR); kt = np.arange(kick_n) / SR
kick = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-kt * 20) + 42) / SR) * env_exp(kick_n, 0.07)
for k in range(int(total / periodo)):
    a = int(k * periodo * SR); pulso[a:a + kick_n] += kick[: max(0, min(kick_n, N - a))] * (0.35 if k % 2 == 0 else 0.2)
alto = np.sin(2 * np.pi * 659.3 * tt) * 0.5 + np.sin(2 * np.pi * 698.5 * tt) * 0.5  # segunda menor: tensão
rampa_voto = np.clip((tt - M["split_a"]) / 6, 0, 1) * np.clip((M["fim"] - 0.4 - tt) / 0.4, 0, 1)
trilha = drone + pulso * np.clip(tt / 3, 0, 1) + alto * 0.02 * rampa_voto

# silêncio como recurso: a trilha some no choque e na não-resposta da Helena
def buraco(t0, t1, rampa=0.25):
    g = np.ones(N)
    dentro = (tt > t0 - rampa) & (tt < t1 + rampa)
    d = np.minimum(np.clip((tt - (t0 - rampa)) / rampa, 0, 1), np.clip(((t1 + rampa) - tt) / rampa, 0, 1))
    g[dentro] = 1 - d[dentro]
    return g


trilha *= buraco(M["audio_corta"], L["05"]["ini"])
trilha *= buraco(L["17"]["fim"], L["18"]["ini"] - 0.2)

# ducking: abaixa a trilha onde há voz (envelope suavizado)
hop = int(0.01 * SR)
ev = np.sqrt(np.convolve(voz ** 2, np.ones(hop) / hop, mode="same"))
ev = np.convolve((ev > 0.01).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
duck = 1 - 0.72 * np.clip(ev * 1.5, 0, 1)
trilha *= duck
fade = np.clip(tt / 1.2, 0, 1) * np.clip((M["fim"] + 0.3 - tt) / 0.6, 0, 1)
trilha *= fade

mix = voz * 1.0 + sfx * 0.55 + trilha.astype(np.float32) * 0.42
mix = mix[: int(total * SR)]
pico = np.abs(mix).max()
mix = mix / pico * 0.89 if pico > 0.89 else mix


def salvar(caminho, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-c:a", "pcm_s16le", caminho], input=x.astype(np.float32).tobytes(), check=True)


pub = os.path.join(RAIZ, "public/dentro-da-farda/ep01")
bruto = os.path.join(pub, "ep01_mix_sem_normalizar.wav")
salvar(bruto, mix)
# loudness para Reels: −14 LUFS integrado, pico verdadeiro −1,5 dBTP (loudnorm em 2 passagens, linear)
med = subprocess.run(["ffmpeg", "-v", "info", "-i", bruto, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
j = json.loads(med[med.rindex("{"): med.rindex("}") + 1])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", bruto, "-af",
                f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true",
                "-ar", str(SR), "-c:a", "pcm_s16le", os.path.join(pub, "ep01_mix.wav")], check=True)
os.remove(bruto)
salvar(os.path.join(pub, "ep01_dialogos.wav"), np.clip(voz[: int(total * SR)], -1, 1))
salvar(os.path.join(pub, "ep01_trilha.wav"), trilha[: int(total * SR)].astype(np.float32) * 0.42)


# ── 7. SRT ──────────────────────────────────────────────────────────────────────
def ts(s):
    h, r = divmod(s, 3600); m, r = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(r):02d},{int(round((r - int(r)) * 1000)):03d}"


srt = []
for i, b in enumerate(legendas, 1):
    texto = " ".join(p["w"] for p in b["palavras"])
    if b["quem"] not in ("NARRADOR",):
        texto = f"{b['quem'].capitalize()}: {texto}"
    srt.append(f"{i}\n{ts(b['ini'])} --> {ts(b['fim'])}\n{texto}\n")
os.makedirs(os.path.join(RAIZ, "out/dentro-da-farda/ep01"), exist_ok=True)
open(os.path.join(RAIZ, "out/dentro-da-farda/ep01/ep01.srt"), "w").write("\n".join(srt))

print(f"duração total {total:.2f} s · {math.ceil(total * FPS)} frames · {len(legendas)} legendas")
for c in cenas:
    print(f"  cena {c['id']:11} {c['ini']:6.2f} → {c['fim']:6.2f}  ({c['fim'] - c['ini']:5.2f} s)")
print("  marcas:", {k: v for k, v in M.items()})
print(f"  INTERROGAR fala {L['25']['dur']:.2f} s · SEGUIR fala {L['26']['dur']:.2f} s · bloco de cada {max(L['25']['dur'], L['26']['dur']) + 0.4:.2f} s")
