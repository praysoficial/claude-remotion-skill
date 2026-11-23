import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Fonts, Grade, Grain, Vignette } from "./components/Layers";
import { Captions } from "./components/Captions";
import { ip } from "./components/Motion";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 } from "./scenes/Scenes";

// Cenas ↔ trechos da narração (áudio sem silêncios)
export const SCENES: { from: number; to: number; C: React.FC; wipe?: boolean }[] = [
  { from: 0, to: 2.3, C: S1 }, // "Você não vai viralizar com IA."
  { from: 2.3, to: 8.95, C: S2 }, // o jeito de todo mundo
  { from: 8.95, to: 12.25, C: S3, wipe: true }, // eu criei uma história
  { from: 12.25, to: 18.8, C: S4, wipe: true }, // garoto / concorrente / segredo
  { from: 18.8, to: 25.85, C: S5 }, // o episódio vira post
  { from: 25.85, to: 29.2, C: S6 }, // 264 mil
  { from: 29.2, to: 36.0, C: S7, wipe: true }, // resultados
  { from: 36.0, to: 40.4, C: S8 }, // tudo com IA
  { from: 40.4, to: 45.45, C: S9, wipe: true }, // a IA sozinha não viraliza
  { from: 45.45, to: 49.45, C: S10 }, // Story System
  { from: 49.45, to: 56.65, C: S11, wipe: true }, // o que aprende
  { from: 56.65, to: 61.45, C: S12 }, // transparência
  { from: 61.45, to: 65.5, C: S13, wipe: true }, // CTA
];

const OVERLAP = 8;

const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const e = first ? 1 : ip(frame, [0, OVERLAP + 2], [0, 1], theme.ease.out);
  const x = last ? 0 : ip(frame, [dur, dur + OVERLAP], [0, 1], theme.ease.in);
  // empurrão contínuo de câmera em toda cena
  const push = interpolate(frame, [0, dur + OVERLAP], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, e * 1.6) * (1 - x),
        transform: `scale(${push * interpolate(e, [0, 1], [0.9, 1]) * interpolate(x, [0, 1], [1, 1.2])})`,
        filter: e < 1 || x > 0 ? `blur(${(1 - e) * 16 + x * 16}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Fundo da referência: violeta quase preto, névoa roxa, grade fina e um disco gigante escuro com borda
const VioletBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const discX = interpolate(t, [0, 65], [-420, -260]);
  const discY = 980 + Math.sin(t / 3) * 40;
  const light = t > 18.8 && t < 25.85 ? 0 : 1; // no feed claro o fundo some
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #12001F 0%, #0A0014 55%, #040008 100%)", opacity: light }}>
      <div style={{ position: "absolute", left: 540 - 700 + Math.sin(t / 2) * 80, top: 500 + Math.cos(t / 2.6) * 70, width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(110,40,255,0.30), transparent 62%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", left: 300, top: 1200, width: 1100, height: 1100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,16,34,0.10), transparent 65%)", filter: "blur(60px)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(180,140,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: `0 ${(frame * 0.6) % 64}px`,
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: discX,
          top: discY,
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 35%, #1C0638, #0B0217 70%)",
          boxShadow: "inset 10px 10px 40px rgba(170,120,255,0.18), 0 0 120px rgba(90,30,200,0.25)",
          border: "2px solid rgba(160,110,255,0.15)",
        }}
      />
    </AbsoluteFill>
  );
};

// Varredura de luz vertical (transição da referência), da direita para a esquerda
const LightWipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f0 = at * fps - 7;
  const p = ip(frame, [f0, f0 + 12], [0, 1], theme.ease.inOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${Math.sin(p * Math.PI) * 0.45})` }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 260,
          left: interpolate(p, [0, 1], [1100, -360]),
          background: "linear-gradient(90deg, transparent, rgba(120,60,255,0.55) 35%, rgba(210,180,255,0.85) 50%, rgba(120,60,255,0.55) 65%, transparent)",
          filter: "blur(6px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

const SFX: [string, number, number][] = [
  ["pop", 1.0, 0.35], ["impact", 1.9, 0.5],
  ["whoosh", 2.2, 0.35], ["pop", 5.05, 0.25], ["pop", 5.5, 0.3], ["whoosh", 6.5, 0.4],
  ["whoosh", 8.85, 0.45], ["shimmer", 11.5, 0.3],
  ["whoosh", 12.15, 0.45], ["impact", 12.85, 0.35], ["whoosh", 15.0, 0.35], ["impact", 16.9, 0.45],
  ["whoosh", 18.7, 0.4], ["pop", 22.0, 0.2], ["pop", 22.1, 0.2], ["pop", 22.2, 0.2], ["tick", 23.05, 0.4], ["pop", 24.1, 0.35],
  ["whoosh", 25.75, 0.4], ["riser", 25.9, 0.3], ["impact", 26.85, 0.55],
  ["whoosh", 29.1, 0.45], ["pop", 30.45, 0.35], ["tick", 31.55, 0.4], ["pop", 33.5, 0.35], ["pop", 35.25, 0.35],
  ["whoosh", 35.9, 0.4], ["shimmer", 36.8, 0.3], ["pop", 38.2, 0.35], ["pop", 38.92, 0.35], ["pop", 39.66, 0.35],
  ["whoosh", 40.3, 0.45], ["impact", 41.4, 0.35], ["pop", 44.75, 0.4],
  ["whoosh", 45.35, 0.4], ["riser", 46.3, 0.4], ["impact", 48.38, 0.7], ["shimmer", 48.5, 0.35],
  ["whoosh", 49.35, 0.45], ["tick", 51.2, 0.4], ["tick", 52.32, 0.4], ["tick", 54.02, 0.4],
  ["whoosh", 56.55, 0.35],
  ["whoosh", 61.35, 0.45], ["pop", 62.56, 0.5], ["shimmer", 63.2, 0.35],
];

export const VSL: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#F0EEF3" }}>
      <Fonts />
      <VioletBg />
      {SCENES.map((s, i) => {
        const last = i === SCENES.length - 1;
        const dur = Math.round((s.to - s.from) * fps);
        return (
          <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={dur + (last ? 0 : OVERLAP)} name={`S${i + 1}`}>
            <SceneShell dur={dur} first={i === 0} last={last}>
              <s.C />
            </SceneShell>
          </Sequence>
        );
      })}
      {SCENES.filter((s) => s.wipe).map((s, i) => (
        <LightWipe key={i} at={s.from} />
      ))}
      <Captions
        top={1440}
        hide={[
          [0, 2.3], // tipografia da cena = legenda
          [8.95, 12.25],
          [40.4, 49.45],
          [56.65, 65.5],
        ]}
      />
      <Grade />
      <Grain />
      <Vignette />
      <Audio src={staticFile("narracao.mp3")} />
      <Audio src={staticFile("sfx/bed.wav")} volume={(f) => interpolate(f / fps, [0, 1, 64.6, 65.5], [0.1, 0.16, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {SFX.map(([n, t, v], i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(t * fps))} durationInFrames={Math.round(2.4 * fps)} name={`sfx-${n}`}>
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
