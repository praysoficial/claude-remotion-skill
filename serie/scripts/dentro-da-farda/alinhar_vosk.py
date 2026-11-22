"""Separa as falas e marca o tempo de cada palavra USANDO RECONHECIMENTO DE FALA (Vosk).

Substitui o corte por tamanho do separar_falas.py, que não sabia o que estava sendo dito
e, quando faltava uma fala na gravação, empurrava as falas seguintes para o texto errado.

1. Transcreve cada arquivo bruto de personagem (Vosk, modelo pequeno de português).
2. Casa o texto esperado (todas as falas do personagem, em ordem) com as palavras reconhecidas.
3. Corta cada fala no maior silêncio entre a última palavra dela e a primeira da seguinte.
   Fala sem nenhuma palavra reconhecida = AUSENTE na gravação (não rouba áudio da vizinha).
4. Em cada fala cortada, roda o Vosk de novo restrito ao vocabulário dela para obter o tempo
   de cada palavra; o que não for reconhecido (nomes, por exemplo) é interpolado por sílabas
   entre as palavras reconhecidas vizinhas, só no tempo com voz.

Requer: pip install vosk (o pacote "srt" pode ser substituído por um stub) e o modelo
vosk-model-small-pt-0.3 (alphacephei.com). Caminho do modelo em MODELO_VOSK.
"""
import difflib, json, os, re, subprocess, sys, unicodedata
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from falas_ep01 import F  # noqa: E402
from separar_falas import (BRUTO, JSON_OUT, SAIDA, SR, envelope, filtro_telefone, ler, regioes, salvar, silabas)  # noqa: E402

import vosk  # noqa: E402

vosk.SetLogLevel(-1)
MODELO = vosk.Model(os.environ.get("MODELO_VOSK", "modelos/vosk-model-small-pt-0.3"))
SINONIMOS = {"pra": "para", "ta": "esta", "tem": "tem"}


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"[^a-z]", "", w)
    return SINONIMOS.get(w, w)


def reconhece(x, gramatica=None):
    """Reconhece um trecho (float32, SR) com o Vosk; opcionalmente restrito a uma gramática."""
    y = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                                      "-ar", "16000", "-f", "f32le", "-"], input=x.astype(np.float32).tobytes(),
                                     capture_output=True, check=True).stdout, np.float32)
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()
    r = vosk.KaldiRecognizer(MODELO, 16000, json.dumps(gramatica, ensure_ascii=False)) if gramatica else vosk.KaldiRecognizer(MODELO, 16000)
    r.SetWords(True)
    ws = []
    for i in range(0, len(pcm), 8000):
        if r.AcceptWaveform(pcm[i:i + 8000]):
            ws += json.loads(r.Result()).get("result", [])
    ws += json.loads(r.FinalResult()).get("result", [])
    return ws


GRAMATICA_SIN = {"pra": "para", "tá": "está"}


def forma_gramatica(w):
    """Palavra como o vocabulário do modelo espera: minúscula, COM acento, sem pontuação."""
    w = re.sub(r"[^\w]", "", w.lower())
    return GRAMATICA_SIN.get(w, w)


def casar(esperadas, ouvidas):
    """Pares (índice esperado, índice ouvido) das palavras que batem."""
    a = [norm(w) for w in esperadas]
    b = [norm(w["word"]) for w in ouvidas]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    pares = []
    for bl in sm.get_matching_blocks():
        for k in range(bl.size):
            pares.append((bl.a + k, bl.b + k))
    return pares


def tempos_das_palavras(texto, x, trechos):
    """Tempo de cada palavra da fala (relativo ao início do trecho x)."""
    palavras = texto.split()
    vocab = sorted({forma_gramatica(w) for w in palavras if forma_gramatica(w)})
    ouvidas = reconhece(x, [" ".join(forma_gramatica(w) for w in palavras), *vocab, "[unk]"])
    ouvidas = [w for w in ouvidas if w["word"] != "[unk]"]
    pares = casar(palavras, ouvidas)
    t0 = [None] * len(palavras); t1 = [None] * len(palavras)
    for i, j in pares:
        t0[i], t1[i] = ouvidas[j]["start"], ouvidas[j]["end"]
    # interpola as que faltam por sílabas, dentro do tempo com voz entre as âncoras
    voz = [(a, b) for a, b in trechos]
    def no_tempo_de_voz(ini, fim, fracs):
        segs = [(max(a, ini), min(b, fim)) for a, b in voz if b > ini and a < fim] or [(ini, fim)]
        dur = np.array([b - a for a, b in segs]); ac = np.concatenate([[0], np.cumsum(dur)])
        out = []
        for f in fracs:
            v = f * dur.sum(); k = min(int(np.searchsorted(ac, v, side="right")) - 1, len(segs) - 1)
            out.append(segs[k][0] + (v - ac[k]))
        return out
    inicio_voz = voz[0][0] if voz else 0.0
    fim_voz = voz[-1][1] if voz else len(x) / SR
    i = 0
    while i < len(palavras):
        if t0[i] is not None:
            i += 1; continue
        j = i
        while j < len(palavras) and t0[j] is None:
            j += 1
        ini = t1[i - 1] if i > 0 else inicio_voz
        fim = t0[j] if j < len(palavras) else fim_voz
        if fim <= ini:
            fim = ini + 0.08 * (j - i)
        pesos = np.array([max(1, silabas(w)) + 0.4 for w in palavras[i:j]])
        cum = np.concatenate([[0], np.cumsum(pesos)]) / pesos.sum()
        pts = no_tempo_de_voz(ini, fim, cum)
        for k in range(i, j):
            t0[k], t1[k] = pts[k - i], pts[k - i + 1]
        i = j
    return [{"w": w, "t0": round(float(a), 3), "t1": round(float(max(b, a + 0.05)), 3), "reconhecida": any(p[0] == k for p in pares)}
            for k, (w, a, b) in enumerate(zip(palavras, t0, t1))]


def main():
    por_quem = {}
    for i, (q, t) in enumerate(F, 1):
        por_quem.setdefault(q, []).append((i, t))
    resultado, relatorio = {}, []
    for quem, linhas in por_quem.items():
        x = ler(os.path.join(BRUTO, f"{quem.lower()}.mp3"))
        regs = regioes(x)
        ouvidas = reconhece(x)
        esperadas, dono = [], []
        for num, texto in linhas:
            for w in texto.split():
                esperadas.append(w); dono.append(num)
        pares = casar(esperadas, ouvidas)
        por_linha = {}
        for i, j in pares:
            por_linha.setdefault(dono[i], []).append(ouvidas[j])
        presentes = [(n, t) for n, t in linhas if len(por_linha.get(n, [])) >= 1]
        ausentes = [n for n, _ in linhas if n not in dict(presentes)]
        # limites: corta no maior silêncio entre a última palavra de uma fala e a primeira da seguinte
        limites = []
        for k, (n, _) in enumerate(presentes):
            ini_pal = min(w["start"] for w in por_linha[n]); fim_pal = max(w["end"] for w in por_linha[n])
            limites.append([ini_pal, fim_pal])
        cortes = []
        for k in range(len(presentes) - 1):
            a, b = limites[k][1], limites[k + 1][0]
            gaps = [(regs[g + 1][0] - regs[g][1], regs[g][1], regs[g + 1][0]) for g in range(len(regs) - 1)
                    if regs[g][1] >= a - 0.25 and regs[g + 1][0] <= b + 0.25]
            if gaps:
                _, g0, g1 = max(gaps)
            else:
                g0 = g1 = (a + b) / 2
            cortes.append((g0, g1))
        for k, (n, texto) in enumerate(presentes):
            ini = regs[0][0] if k == 0 else cortes[k - 1][1]
            fim = regs[-1][1] if k == len(presentes) - 1 else cortes[k][0]
            # tira estalos/respirações nas bordas: trecho de voz curto e fraco
            dentro = [r for r in regs if r[1] > ini and r[0] < fim]
            def energia(r):
                s = x[int(r[0] * SR): int(r[1] * SR)]; return float(np.sqrt((s ** 2).mean()))
            topo = max(energia(r) for r in dentro)
            while len(dentro) > 1 and dentro[0][1] - dentro[0][0] < 0.3 and energia(dentro[0]) < 0.35 * topo and dentro[0][1] < limites[k][0]:
                dentro = dentro[1:]
            while len(dentro) > 1 and dentro[-1][1] - dentro[-1][0] < 0.6 and energia(dentro[-1]) < 0.2 * topo and dentro[-1][0] > limites[k][1]:
                dentro = dentro[:-1]
            ini, fim = max(ini, dentro[0][0]), min(fim, dentro[-1][1])
            s0, s1 = max(0, ini - 0.05), min(len(x) / SR, fim + 0.12)
            trecho = x[int(s0 * SR): int(s1 * SR)].copy()
            f = int(0.01 * SR); rampa = np.linspace(0, 1, f)
            trecho[:f] *= rampa; trecho[-f:] *= rampa[::-1]
            internos = [(max(a, ini) - s0, min(b, fim) - s0) for a, b in dentro]
            palavras = tempos_das_palavras(texto, trecho, internos)
            if quem == "VICTOR":
                trecho = filtro_telefone(trecho)
            nome = f"ep01_{n:02d}_{quem.lower()}.wav"
            salvar(os.path.join(SAIDA, nome), trecho)
            rec = sum(p["reconhecida"] for p in palavras)
            resultado[f"{n:02d}"] = {"id": f"{n:02d}", "quem": quem, "texto": texto, "arquivo": nome,
                                     "dur": round(len(trecho) / SR, 3), "palavras": palavras, "env": envelope(trecho),
                                     "bruto_ini": round(s0, 3), "bruto_fim": round(s1, 3),
                                     "reconhecidas": f"{rec}/{len(palavras)}"}
            relatorio.append((n, quem, s0, s1, f"{rec}/{len(palavras)}", texto[:50]))
        for n in ausentes:
            texto = dict(linhas)[n]
            resultado[f"{n:02d}"] = {"id": f"{n:02d}", "quem": quem, "texto": texto, "ausente": True}
            relatorio.append((n, quem, -1, -1, "AUSENTE", texto[:50]))
    json.dump(dict(sorted(resultado.items())), open(JSON_OUT, "w"), ensure_ascii=False)
    for n, q, a, b, rec, t in sorted(relatorio):
        print(f"{n:02d} {q:9} {'' if a < 0 else f'{a:6.2f}-{b:6.2f}':13} reconhecidas {rec:8} {t}")


if __name__ == "__main__":
    main()
