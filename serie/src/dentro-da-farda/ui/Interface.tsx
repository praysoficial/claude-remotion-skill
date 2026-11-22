// Interface.tsx — contador, legendas, cartela de voto e acabamento (grão + vinheta).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tema } from "../tema";

const C = tema.cor;

// ── Contador discreto no canto: DIA 1/31 ─────────────────────────────────────
export const Contador: React.FC<{ dia: number; total: number; desde: number; t: number }> = ({ dia, total, desde, t }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const s = spring({ frame: Math.round((t - desde) * fps), fps, config: { damping: 18, stiffness: 140 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 168,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: s * 0.9,
        transform: `translateY(${(1 - s) * -14}px)`,
        fontFamily: tema.fonte.mono,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 5,
        color: C.texto,
        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.vermelho, boxShadow: `0 0 12px ${C.vermelho}` }} />
      DIA {dia}/{total}
    </div>
  );
};

// ── Legendas por frase, ancoradas no início real da voz (no máximo 2 linhas) ─
type Palavra = { w: string; t0: number; t1: number };
type Bloco = { quem: string; ini: number; fim: number; palavras: Palavra[] };

const DESTAQUE: [RegExp, string][] = [
  [/^interrogar/i, C.vermelho],
  [/^seguir/i, C.ciano],
];
// "trinta e um dias" em vermelho, como unidade
const ehPrazo = (ws: Palavra[], i: number) => {
  const j = ws.map((w) => w.w.toLowerCase().replace(/[^\p{L}]/gu, ""));
  for (let k = Math.max(0, i - 3); k <= i; k++) {
    if (j[k] === "trinta" && j[k + 1] === "e" && j[k + 2] === "um" && j[k + 3] === "dias" && i <= k + 3) return true;
  }
  return false;
};

export const Legendas: React.FC<{ blocos: Bloco[]; t: number; y: number; ocultarDesde?: number }> = ({ blocos, t, y, ocultarDesde }) => {
  if (ocultarDesde !== undefined && t >= ocultarDesde) return null;
  const b = blocos.find((x) => t >= x.ini && t < x.fim);
  if (!b) return null;
  const entrada = interpolate(t, [b.ini, b.ini + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: tema.ease.out });
  const nome = b.quem === "NARRADOR" ? null : b.quem;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {nome && (
        <div style={{ fontFamily: tema.fonte.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.textoFraco, opacity: entrada, textShadow: "0 2px 8px #000" }}>
          {nome}
        </div>
      )}
      <div
        style={{
          fontFamily: tema.fonte.texto,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.12,
          textAlign: "center",
          color: C.texto,
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 10}px)`,
          textShadow: "0 3px 0 rgba(0,0,0,0.85), 0 0 18px rgba(0,0,0,0.9)",
          maxWidth: 940,
        }}
      >
        {b.palavras.map((p, i) => {
          let cor: string = C.texto;
          for (const [re, c] of DESTAQUE) if (re.test(p.w)) cor = c;
          if (ehPrazo(b.palavras, i)) cor = C.vermelho;
          return (
            <span key={i} style={{ color: cor }}>
              {p.w}
              {i < b.palavras.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ── Cartela de voto: INTERROGAR | SEGUIR, mesmo tamanho, mesma entrada ──────
export const CartelaVoto: React.FC<{ desde: number; t: number }> = ({ desde, t }) => {
  const { fps } = useVideoConfig();
  if (t < desde) return null;
  const f = Math.round((t - desde) * fps);
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 150, mass: 0.8 } });
  const s2 = spring({ frame: f - 8, fps, config: { damping: 20, stiffness: 120 } });
  const pulso = 1 + 0.015 * Math.sin((t - desde) * 5);
  const caixa = (texto: string, cor: string) => (
    <div
      style={{
        width: 470,
        height: 190,
        borderRadius: 22,
        border: `5px solid ${cor}`,
        background: `linear-gradient(180deg, ${cor}40, ${cor}14), #07090D`,
        boxShadow: `0 0 50px ${cor}55, inset 0 0 30px ${cor}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: tema.fonte.titulo,
        fontSize: 84,
        letterSpacing: 2,
        color: C.texto,
        textShadow: `0 0 24px ${cor}`,
        transform: `scale(${pulso})`,
      }}
    >
      {texto}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
      {/* fundo escuro atrás da cartela: nada do cenário atravessa o voto */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,7,0.92) 0%, rgba(3,4,7,0.88) 36%, rgba(3,4,7,0) 48%)", opacity: s }} />
      <div style={{ position: "relative", opacity: s2, fontFamily: tema.fonte.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: C.textoFraco, marginBottom: 26 }}>
        O QUE O ARTHUR FAZ?
      </div>
      <div style={{ display: "flex", gap: 40, opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})` }}>
        {caixa("INTERROGAR", C.vermelho)}
        {caixa("SEGUIR", C.ciano)}
      </div>
      <div
        style={{
          marginTop: 34,
          position: "relative",
          opacity: s2,
          transform: `translateY(${(1 - s2) * 20}px)`,
          fontFamily: tema.fonte.texto,
          fontWeight: 800,
          fontSize: 50,
          color: C.texto,
          textShadow: "0 3px 0 #000",
        }}
      >
        Escreva nos comentários
      </div>
    </AbsoluteFill>
  );
};

// ── Acabamento: grade, grão (com semente) e vinheta — sempre no topo ─────────
export const Acabamento: React.FC<{ grao?: number }> = ({ grao = 0.08 }) => {
  const frame = useCurrentFrame();
  const ruido = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  const ox = Math.floor(random(`gx${frame}`) * 240);
  const oy = Math.floor(random(`gy${frame}`) * 240);
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 22%, transparent 70%, rgba(0,0,0,0.45))" }} />
      <AbsoluteFill style={{ backgroundImage: ruido, backgroundSize: "240px", backgroundPosition: `${ox}px ${oy}px`, opacity: grao, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(0,0,0,0.62) 100%)" }} />
    </>
  );
};
