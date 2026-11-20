import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { BgMesh, Fonts, Grade, Grain, Vignette } from "./components/Layers";
import { Captions } from "./components/Captions";
import { ip } from "./components/Motion";
import { SBrand, SCTA, SGoodStory, SHooked, SImagine, SMadeWithAI, SMethod, SProof, SStory } from "./scenes/Short";

// Cenas ↔ trechos da narração (segundos do áudio já sem silêncios)
export const SCENES: { from: number; to: number; C: React.FC; warm: number; red: number }[] = [
  { from: 0, to: 15.35, C: SStory, warm: 0.2, red: 0.6 }, // a história (gancho)
  { from: 15.35, to: 19.0, C: SHooked, warm: 0.5, red: 0.5 }, // viu como te prendeu?
  { from: 19.0, to: 21.32, C: SGoodStory, warm: 0.8, red: 0.2 }, // uma boa história
  { from: 21.32, to: 28.0, C: SMadeWithAI, warm: 0.8, red: 0.3 }, // feito com IA
  { from: 28.0, to: 37.95, C: SProof, warm: 0.8, red: 0.2 }, // prova: perfis
  { from: 37.95, to: 45.5, C: SMethod, warm: 0.7, red: 0.25 }, // o método
  { from: 45.5, to: 47.85, C: SBrand, warm: 1, red: 0.2 }, // Story System
  { from: 47.85, to: 51.05, C: SImagine, warm: 0.8, red: 0.3 }, // imagina
  { from: 51.05, to: 55.4, C: SCTA, warm: 1, red: 0.3 }, // CTA
];

const OVERLAP = 8;

// Transição entre cenas: a cena que sai acelera para a câmera (zoom + desfoque), a nova assenta
const SceneShell: React.FC<{ dur: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ dur, first, last, children }) => {
  const frame = useCurrentFrame();
  const e = first ? 1 : ip(frame, [0, OVERLAP + 2], [0, 1], theme.ease.out);
  const x = last ? 0 : ip(frame, [dur, dur + OVERLAP], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, e * 1.6) * (1 - x),
        transform: `scale(${interpolate(e, [0, 1], [0.86, 1]) * interpolate(x, [0, 1], [1, 1.25])}) rotate(${(1 - e) * -2 + x * 2}deg)`,
        filter: e < 1 || x > 0 ? `blur(${(1 - e) * 18 + x * 18}px)` : undefined,
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
  const xs = SCENES.map((s) => s.from + 0.3);
  const o = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: theme.ease.soft };
  return <BgMesh warm={interpolate(t, xs, SCENES.map((s) => s.warm), o)} red={interpolate(t, xs, SCENES.map((s) => s.red), o)} />;
};

const SFX: [string, number, number][] = [
  ...SCENES.slice(1).map((s) => ["whoosh", s.from - 0.15, 0.4] as [string, number, number]),
  ["whoosh", 2.85, 0.35], ["whoosh", 7.15, 0.35], ["whoosh", 9.6, 0.35], ["whoosh", 13.12, 0.35],
  ["impact", 0.55, 0.45], ["pop", 4.9, 0.4],
  ["pop", 8.3, 0.25], ["pop", 8.56, 0.25], ["pop", 8.84, 0.25], ["pop", 9.06, 0.25], ["pop", 9.34, 0.25],
  ["riser", 13.0, 0.4], ["impact", 15.18, 0.55],
  ["pop", 23.15, 0.4], ["pop", 24.2, 0.4], ["pop", 25.15, 0.4], ["shimmer", 26.75, 0.35],
  ["tick", 30.2, 0.5], ["tick", 32.0, 0.5], ["impact", 35.25, 0.4],
  ["tick", 41.45, 0.4], ["tick", 42.58, 0.4], ["tick", 43.62, 0.4], ["tick", 44.64, 0.4],
  ["riser", 44.7, 0.4], ["impact", 46.8, 0.65], ["shimmer", 46.9, 0.35],
  ["pop", 52.42, 0.45], ["shimmer", 52.7, 0.3],
];

export const VSL: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Fonts />
      <Background />
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
      <Captions
        top={1420}
        hide={[
          [15.35, 21.32], // tipografia da cena já é a legenda
          [37.95, 41.45],
          [45.5, 51.05],
        ]}
      />
      <Grade />
      <Grain />
      <Vignette />
      <Audio src={staticFile("narracao.mp3")} />
      <Audio src={staticFile("sfx/bed.wav")} volume={(f) => interpolate(f / fps, [0, 15.1, 15.2, 15.6, 54.6, 55.4], [0.16, 0.16, 0, 0.16, 0.2, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {SFX.map(([n, t, v], i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(t * fps))} durationInFrames={Math.round(2.4 * fps)} name={`sfx-${n}`}>
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
