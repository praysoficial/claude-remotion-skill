// theme.ts — fonte única de cores, fontes, easings e springs.
// Paleta derivada do perfil (sol dourado do avatar + vermelho das capas).
// Se a logo oficial usar outras cores, ajuste apenas este arquivo.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#09080D",
    bgAlt: "#13111A",
    surface: "rgba(255,255,255,0.045)",
    stroke: "rgba(255,255,255,0.10)",
    primary: "#00E5EE", // ciano da logo — cor-herói, no máximo 1 elemento por frame
    accent: "#FF1022", // vermelho da logo — tensão/conflito
    text: "#F6F3EC",
    textDim: "#A29EAB",
    textMute: "#5E5A66",
    glow: "rgba(0, 229, 238, 0.45)",
    primaryRgb: "0, 229, 238",
    accentRgb: "255, 16, 34",
    onPrimary: "#04191B",
  },
  fonts: {
    display: "Bricolage",
    body: "Inter",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    soft: Easing.bezier(0.45, 0, 0.2, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slow: { damping: 26, stiffness: 50, mass: 1 },
  },
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_S = 55.4;
