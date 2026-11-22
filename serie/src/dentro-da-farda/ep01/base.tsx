// base.tsx — tudo que as cenas do episódio 1 compartilham.
// O tempo vem SEMPRE do frame atual (t = frame / fps): qualquer instante pode ser
// renderizado isoladamente, e nada depende do frame anterior.
import React, { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "./timeline.json";
import { DeltaPose, Pose, mixPose } from "../../personagem/pose";
import { tema } from "../tema";

export const TL = timeline;
export const M = timeline.marcas;
export type Fala = (typeof timeline.falas)[number];
export const FALA: Record<string, Fala> = Object.fromEntries(timeline.falas.map((l) => [l.id, l]));
export const CENA: Record<string, { ini: number; fim: number }> = Object.fromEntries(
  timeline.cenas.map((c) => [c.id, { ini: c.ini, fim: c.fim }]),
);

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Tempo (s) em que uma palavra começa dentro de uma fala. */
export const palavra = (id: string, alvo: string) => {
  const p = FALA[id].palavras.find((w) => w.w.toLowerCase().replace(/[^\p{L}]/gu, "") === alvo);
  if (!p) throw new Error(`palavra ${alvo} não está na fala ${id}`);
  return p.t0;
};

/** Progresso 0→1 entre a e b, com curva (nunca linear). */
export const prog = (t: number, a: number, b: number, ease = tema.ease.inOut) =>
  interpolate(t, [a, b], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Envelope da voz de um personagem no instante t (0–1), suavizado em 3 frames. */
export const voz = (quem: string, t: number) => {
  for (const l of timeline.falas) {
    if (l.quem !== quem || t < l.ini || t > l.fim) continue;
    const i = Math.floor((t - l.ini) * timeline.fps);
    const e = l.env;
    const v = ((e[i - 1] ?? 0) + (e[i] ?? 0) * 2 + (e[i + 1] ?? 0)) / 4;
    return Math.min(1, v * 1.4);
  }
  return 0;
};

/** Corpo acompanha a fala: a cabeça marca as sílabas fortes, o tronco respira junto. */
export const gestoDeFala = (quem: string, t: number, intensidade = 1): DeltaPose => {
  const v = voz(quem, t) * intensidade;
  return {
    cabeca: v * 5 - 1.5 * Math.sin(t * 2.3),
    tronco: v * 1.6,
    bracoEsq: { cotovelo: v * 6 },
    bracoDir: { cotovelo: v * 4 },
  };
};

/** Respiração parada (cada personagem com fase própria). */
export const respira = (t: number, fase = 0): DeltaPose => {
  const s = Math.sin(t * 2 * Math.PI * 0.3 + fase);
  return { tronco: s * 0.6, bracoEsq: { ombro: s * 1.2 }, bracoDir: { ombro: s * 1.2 }, cabeca: Math.sin(t * 0.9 + fase) * 1 };
};

// ── Poses base de perfil (vista "perfil": olha pra direita) ───────────────────
export const PERFIL: Record<string, Pose> = {
  parado: {
    tronco: 1, cabeca: 0,
    bracoEsq: { ombro: 6, cotovelo: 10 }, bracoDir: { ombro: -4, cotovelo: 8 },
    pernaEsq: { quadril: 4, joelho: 2 }, pernaDir: { quadril: -4, joelho: 2 },
  },
  agachado: {
    tronco: 22, cabeca: -6,
    bracoEsq: { ombro: 40, cotovelo: 30 }, bracoDir: { ombro: 55, cotovelo: 20 },
    pernaEsq: { quadril: 62, joelho: 96 }, pernaDir: { quadril: 40, joelho: 105 },
  },
  inclinado: {
    tronco: 22, cabeca: 8,
    bracoEsq: { ombro: 10, cotovelo: 40 }, bracoDir: { ombro: -8, cotovelo: 30 },
    pernaEsq: { quadril: 8, joelho: 4 }, pernaDir: { quadril: -10, joelho: 6 },
  },
};

/** Ciclo de caminhada de perfil (fase em voltas; 1 volta = 2 passos). */
export const passo = (fase: number, amplitude = 1): DeltaPose => {
  const s = Math.sin(fase * 2 * Math.PI);
  const c = Math.cos(fase * 2 * Math.PI);
  return {
    tronco: 3 * amplitude,
    pernaEsq: { quadril: 24 * s * amplitude, joelho: (8 + 26 * Math.max(0, c)) * amplitude },
    pernaDir: { quadril: -24 * s * amplitude, joelho: (8 + 26 * Math.max(0, -c)) * amplitude },
    bracoEsq: { ombro: -20 * s * amplitude, cotovelo: 14 * amplitude },
    bracoDir: { ombro: 20 * s * amplitude, cotovelo: 14 * amplitude },
  };
};

/** Desloca de x0 a x1 entre t0 e t1 andando: devolve x, a fase do passo e quanto anda (0–1). */
export const andar = (t: number, t0: number, t1: number, x0: number, x1: number, passoPx = 120) => {
  const p = prog(t, t0, t1, tema.ease.inOut);
  const x = x0 + (x1 - x0) * p;
  const fase = Math.abs(x - x0) / (passoPx * 2);
  const andando = t > t0 && t < t1 ? Math.min(1, Math.min(t - t0, t1 - t) / 0.25) : 0;
  return { x, fase, andando };
};

export { mixPose };

// ── Câmera: foco (x, y) no centro do quadro, com zoom ────────────────────────
export const Camera: React.FC<{ x: number; y: number; zoom: number; children: ReactNode; style?: CSSProperties }> = ({
  x, y, zoom, children, style,
}) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${x}px ${y}px`,
      transform: `translate(${540 - x}px, ${960 - y}px) scale(${zoom})`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Tremor de câmera na mão, com semente (determinístico). */
export const tremor = (t: number, semente: string, forca = 1) => ({
  x: (random(`${semente}x${Math.floor(t * 8)}`) - 0.5) * 3 * forca + Math.sin(t * 1.3) * 4 * forca,
  y: (random(`${semente}y${Math.floor(t * 8)}`) - 0.5) * 3 * forca + Math.cos(t * 1.1) * 3 * forca,
});

/** Cintilação de lâmpada com semente: 1 = acesa, perto de 0 = falhando. */
export const cintila = (t: number, semente: string, falhas: [number, number][] = []) => {
  for (const [a, b] of falhas) {
    if (t >= a && t <= b) return random(`${semente}${Math.floor(t * 20)}`) > 0.5 ? 0.15 : 0.9;
  }
  return 0.94 + 0.06 * Math.sin(t * 13 + random(semente) * 6);
};
