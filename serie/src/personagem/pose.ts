// pose.ts — esqueleto do boneco descrito só por ângulos (graus).
//
// CONVENÇÕES (boneco de frente pra câmera):
//   • "Esq"/"Dir" são do BONECO. De frente, o braço direito dele aparece
//     à ESQUERDA da tela e o esquerdo à DIREITA.
//   • tronco   — inclinação lateral. + = topo vai pra direita da tela.
//   • cabeca   — inclinação relativa ao tronco. + = topo vai pra direita da tela.
//   • ombro    — 0 = braço caído junto ao corpo. + = abre pra fora;
//                90 = horizontal; 180 = reto pra cima. (relativo ao tronco)
//   • cotovelo — 0 = braço esticado. + = antebraço dobra pra DENTRO (rumo ao
//                peito); − = dobra pra fora/pra cima.
//                Antebraço vertical pra cima: cotovelo = ombro − 180
//                (mais negativo que isso tomba o antebraço por cima da cabeça).
//   • quadril  — 0 = perna reta pra baixo. + = abre pra fora.
//   • joelho   — 0 = reta. + = canela volta pra dentro; − = vai pra fora.
//   Ângulos espelhados por lado: a mesma pose numérica nos dois lados é simétrica.
import { interpolate, spring } from "remotion";
import { theme } from "../theme";

export type Braco = { ombro: number; cotovelo: number };
export type Perna = { quadril: number; joelho: number };

export type Pose = {
  tronco: number;
  cabeca: number;
  bracoEsq: Braco;
  bracoDir: Braco;
  pernaEsq: Perna;
  pernaDir: Perna;
  /** qual braço é desenhado por cima quando se cruzam */
  bracoNaFrente?: "esq" | "dir";
};

/** Comprimentos em px na escala 1 (altura total ≈ 450px). */
export type Proporcoes = {
  tronco: number;
  troncoEspessura: number;
  pescoco: number;
  cabecaRaio: number;
  ombroLargura: number;
  ombroQueda: number;
  braco: number;
  antebraco: number;
  coxa: number;
  canela: number;
  quadrilLargura: number;
  membroEspessura: number;
  maoRaio: number;
};

export const PROPORCOES_PADRAO: Proporcoes = {
  tronco: 150,
  troncoEspessura: 44,
  pescoco: 34,
  cabecaRaio: 44,
  ombroLargura: 19,
  ombroQueda: 14,
  braco: 78,
  antebraco: 70,
  coxa: 86,
  canela: 84,
  quadrilLargura: 14,
  membroEspessura: 28,
  maoRaio: 16,
};

// ── Biblioteca de poses ──────────────────────────────────────────────────
const bracoCaido: Braco = { ombro: 12, cotovelo: 4 };
const pernaPadrao: Perna = { quadril: 5, joelho: 1 };

export const POSES = {
  neutro: {
    tronco: 0,
    cabeca: 0,
    bracoEsq: bracoCaido,
    bracoDir: bracoCaido,
    pernaEsq: pernaPadrao,
    pernaDir: pernaPadrao,
  },
  /** braço esquerdo erguido, antebraço vertical — some a oscilação no cotovelo */
  aceno: {
    tronco: -2,
    cabeca: 5,
    bracoEsq: { ombro: 118, cotovelo: -50 },
    bracoDir: { ombro: 13, cotovelo: 6 },
    pernaEsq: { quadril: 6, joelho: 1 },
    pernaDir: { quadril: 5, joelho: 1 },
  },
  bracosCruzados: {
    tronco: 0.5,
    cabeca: -6,
    bracoEsq: { ombro: 20, cotovelo: 110 },
    bracoDir: { ombro: 32, cotovelo: 142 },
    pernaEsq: { quadril: 9, joelho: 2 },
    pernaDir: { quadril: 9, joelho: 2 },
    bracoNaFrente: "esq",
  },
} satisfies Record<string, Pose>;

// ── Operações ────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixBraco = (a: Braco, b: Braco, t: number): Braco => ({
  ombro: lerp(a.ombro, b.ombro, t),
  cotovelo: lerp(a.cotovelo, b.cotovelo, t),
});
const mixPerna = (a: Perna, b: Perna, t: number): Perna => ({
  quadril: lerp(a.quadril, b.quadril, t),
  joelho: lerp(a.joelho, b.joelho, t),
});

/** Mistura duas poses (t pode passar de 1 numa mola com overshoot). */
export const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  tronco: lerp(a.tronco, b.tronco, t),
  cabeca: lerp(a.cabeca, b.cabeca, t),
  bracoEsq: mixBraco(a.bracoEsq, b.bracoEsq, t),
  bracoDir: mixBraco(a.bracoDir, b.bracoDir, t),
  pernaEsq: mixPerna(a.pernaEsq, b.pernaEsq, t),
  pernaDir: mixPerna(a.pernaDir, b.pernaDir, t),
  bracoNaFrente: t < 0.5 ? a.bracoNaFrente : b.bracoNaFrente,
});

export type DeltaPose = {
  tronco?: number;
  cabeca?: number;
  bracoEsq?: Partial<Braco>;
  bracoDir?: Partial<Braco>;
  pernaEsq?: Partial<Perna>;
  pernaDir?: Partial<Perna>;
};

/** Soma camadas aditivas (respiração, aceno, tremidas) por cima da pose base. */
export const somaPose = (p: Pose, d: DeltaPose): Pose => ({
  ...p,
  tronco: p.tronco + (d.tronco ?? 0),
  cabeca: p.cabeca + (d.cabeca ?? 0),
  bracoEsq: {
    ombro: p.bracoEsq.ombro + (d.bracoEsq?.ombro ?? 0),
    cotovelo: p.bracoEsq.cotovelo + (d.bracoEsq?.cotovelo ?? 0),
  },
  bracoDir: {
    ombro: p.bracoDir.ombro + (d.bracoDir?.ombro ?? 0),
    cotovelo: p.bracoDir.cotovelo + (d.bracoDir?.cotovelo ?? 0),
  },
  pernaEsq: {
    quadril: p.pernaEsq.quadril + (d.pernaEsq?.quadril ?? 0),
    joelho: p.pernaEsq.joelho + (d.pernaEsq?.joelho ?? 0),
  },
  pernaDir: {
    quadril: p.pernaDir.quadril + (d.pernaDir?.quadril ?? 0),
    joelho: p.pernaDir.joelho + (d.pernaDir?.joelho ?? 0),
  },
});

// ── Linha do tempo de poses ──────────────────────────────────────────────
export type Chave = {
  /** segundo em que o boneco COMEÇA a ir para esta pose */
  em: number;
  pose: Pose;
  /** duração da transição em segundos (padrão 0.5) */
  dur?: number;
  /** "mola" tem overshoot (gestos); "suave" é ease-in-out (ajustes) */
  curva?: "mola" | "suave";
};

/** Pose no frame atual a partir de chaves em segundos (derivadas do fps). */
export const poseNoTempo = (frame: number, fps: number, chaves: Chave[]): Pose => {
  let atual = chaves[0].pose;
  for (let i = 1; i < chaves.length; i++) {
    const c = chaves[i];
    const ini = Math.round(c.em * fps);
    const dur = Math.max(1, Math.round((c.dur ?? 0.5) * fps));
    if (frame < ini) break;
    const t =
      c.curva === "suave"
        ? interpolate(frame, [ini, ini + dur], [0, 1], {
            easing: theme.ease.inOut,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : spring({ frame: frame - ini, fps, config: theme.mola.gesto, durationInFrames: dur });
    atual = mixPose(atual, c.pose, t);
  }
  return atual;
};

/** Envelope 0→1→0 com bordas suaves, para ligar/desligar camadas aditivas. */
export const envelope = (
  frame: number,
  fps: number,
  ini: number,
  fim: number,
  rampa = 0.25,
) =>
  interpolate(
    frame,
    [ini * fps, (ini + rampa) * fps, (fim - rampa) * fps, fim * fps],
    [0, 1, 1, 0],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
