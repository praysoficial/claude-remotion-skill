import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { BgMesh, Fonts, Grade, Grain, Vignette } from "./components/Layers";
import { Captions } from "./components/Captions";
import { ip, Logo } from "./components/Motion";
import { S1Hook, S2Loop, S3Pain, S4Participate, S5ProofIG } from "./scenes/ActOne";
import { S6Concept, S7Detail, S8Reveal, S9Learn, S10Difference } from "./scenes/ActTwo";
import { S11Path, S12Start, S13Honest, S14CTA } from "./scenes/ActThree";

// Mapa de cenas → trechos da narração (segundos)
export const SCENES: { from: number; to: number; C: React.FC; warm: number; red: number }[] = [
  { from: 0, to: 9.0, C: S1Hook, warm: 0.6, red: 0.2 }, // gancho: perfil sem rosto
  { from: 9.0, to: 21.0, C: S2Loop, warm: 0.3, red: 0.6 }, // o ciclo publicar → torcer → recomeçar
  { from: 21.0, to: 42.4, C: S3Pain, warm: 0.15, red: 0.55 }, // a dor
  { from: 42.4, to: 57.75, C: S4Participate, warm: 0.7, red: 0.3 }, // virada: participar (TikTok)
  { from: 57.75, to: 64.9, C: S5ProofIG, warm: 0.75, red: 0.25 }, // prova: Instagram
  { from: 64.9, to: 76.75, C: S6Concept, warm: 0.7, red: 0.2 }, // conceito
  { from: 76.75, to: 91.1, C: S7Detail, warm: 0.35, red: 0.3 }, // o detalhe / pilares
  { from: 91.1, to: 101.75, C: S8Reveal, warm: 1, red: 0.15 }, // revelação Story System
  { from: 101.75, to: 115.9, C: S9Learn, warm: 0.7, red: 0.15 }, // o que se aprende
  { from: 115.9, to: 135.1, C: S10Difference, warm: 0.55, red: 0.35 }, // a diferença
  { from: 135.1, to: 144.7, C: S11Path, warm: 0.5, red: 0.3 }, // sozinho vs método
  { from: 144.7, to: 158.9, C: S12Start, warm: 0.6, red: 0.2 }, // objeção
  { from: 158.9, to: 167.25, C: S13Honest, warm: 0.4, red: 0.1 }, // transparência
  { from: 167.25, to: 189.6, C: S14CTA, warm: 0.9, red: 0.2 }, // CTA
];

const OVERLAP = 6; // frames de crossfade entre cenas

const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const e = first ? 1 : ip(frame, [0, 10], [0, 1]);
  const x = last ? 0 : ip(frame, [dur - 2, dur + OVERLAP], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill
      style={{
        opacity: e * (1 - x),
        transform: `scale(${interpolate(e, [0, 1], [1.035, 1]) * interpolate(x, [0, 1], [1, 0.975])})`,
        filter: e < 1 || x > 0 ? `blur(${(1 - e) * 8 + x * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // interpola a temperatura da luz entre cenas
  const xs = SCENES.map((s) => s.from + 0.5);
  const warm = interpolate(t, xs, SCENES.map((s) => s.warm), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.soft });
  const red = interpolate(t, xs, SCENES.map((s) => s.red), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.soft });
  return <BgMesh warm={warm} red={red} />;
};

// Marca d'água discreta após a revelação
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const o = ip(t, [101.8, 102.6], [0, 1]) * (1 - ip(t, [166.9, 167.4], [0, 1]));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 64, top: 52, opacity: o * 0.55 }}>
      <Logo height={30} />
    </div>
  );
};

// SFX: [arquivo, segundo, volume] — disparam ~2 frames antes da imagem
const SFX: [string, number, number][] = [
  ...SCENES.slice(1).map((s) => ["whoosh", s.from - 0.12, 0.35] as [string, number, number]),
  ["pop", 10.1, 0.35], ["pop", 11.25, 0.35], ["pop", 12.8, 0.35],
  ["tick", 26.25, 0.4], ["tick", 27.25, 0.4], ["tick", 28.55, 0.4], ["tick", 29.45, 0.4],
  ["pop", 19.7, 0.5],
  ["tick", 51.25, 0.5], ["pop", 53.0, 0.3], ["pop", 53.2, 0.3],
  ["tick", 59.55, 0.5], ["tick", 62.95, 0.5],
  ["pop", 83.75, 0.35], ["pop", 84.95, 0.35], ["pop", 86.15, 0.35], ["pop", 87.65, 0.35],
  ["riser", 91.8, 0.45], ["impact", 93.95, 0.7], ["shimmer", 94.05, 0.35],
  ["pop", 102.5, 0.3], ["pop", 103.7, 0.3], ["pop", 105.1, 0.3], ["pop", 106.6, 0.3],
  ["tick", 150.75, 0.45], ["tick", 152.95, 0.45],
  ["riser", 171.4, 0.35], ["impact", 173.55, 0.6], ["shimmer", 175.05, 0.3], ["shimmer", 186.35, 0.35],
];

export const VSL: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Fonts />
      <Background />
      {SCENES.map((s, i) => {
        const from = Math.round(s.from * fps);
        const dur = Math.round((s.to - s.from) * fps);
        const last = i === SCENES.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={dur + (last ? 0 : OVERLAP)} name={`S${i + 1}`}>
            <SceneShell dur={dur} first={i === 0} last={last}>
              <s.C />
            </SceneShell>
          </Sequence>
        );
      })}
      <Watermark />
      <Captions />
      <Grade />
      <Grain />
      <Vignette />

      <Audio src={staticFile("narracao.mp3")} volume={1} />
      <Audio
        src={staticFile("sfx/bed.wav")}
        volume={(f) => interpolate(f / fps, [0, 187.5, 188.3], [0.13, 0.13, 0.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map(([name, t, v], i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(t * fps))} durationInFrames={Math.round(2.4 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
