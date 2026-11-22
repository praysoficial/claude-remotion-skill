// Boneco.tsx — o personagem da série. Branco, sem rosto, membros grossos e
// arredondados. Recebe uma Pose (ângulos) e desenha por cinemática direta.
// Os pés ficam sempre apoiados no `chao` informado, qualquer que seja a pose.
import React, { CSSProperties, useId } from "react";
import { theme } from "../theme";
import { Pose, PROPORCOES_PADRAO, Proporcoes } from "./pose";

type V = { x: number; y: number };
const rad = (d: number) => (d * Math.PI) / 180;
const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k });
// rotação em coordenadas de tela (y pra baixo): + = horário na tela
const rot = (v: V, deg: number): V => {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
};
const BAIXO: V = { x: 0, y: 1 };
const CIMA: V = { x: 0, y: -1 };
const DIREITA: V = { x: 1, y: 0 };

export type Esqueleto = {
  quadril: V;
  pescoco: V;
  cabeca: V;
  bracoEsq: [V, V, V];
  bracoDir: [V, V, V];
  pernaEsq: [V, V, V];
  pernaDir: [V, V, V];
};

/** Posições das juntas com o centro do quadril em (0,0). Útil para prender objetos à mão. */
export const esqueleto = (pose: Pose, p: Proporcoes): Esqueleto => {
  const quadril: V = { x: 0, y: 0 };
  const cima = rot(CIMA, pose.tronco);
  const lado = rot(DIREITA, pose.tronco);
  const pescoco = add(quadril, mul(cima, p.tronco));
  const cabeca = add(pescoco, mul(rot(CIMA, pose.tronco + pose.cabeca), p.pescoco + p.cabecaRaio));

  // s = +1 → lado esquerdo do boneco (direita da tela); s = −1 → lado direito
  const braco = (b: Pose["bracoEsq"], s: number): [V, V, V] => {
    const ombro = add(add(pescoco, mul(cima, -p.ombroQueda)), mul(lado, s * p.ombroLargura));
    const cotovelo = add(ombro, mul(rot(BAIXO, pose.tronco - s * b.ombro), p.braco));
    const mao = add(cotovelo, mul(rot(BAIXO, pose.tronco - s * (b.ombro - b.cotovelo)), p.antebraco));
    return [ombro, cotovelo, mao];
  };
  const perna = (l: Pose["pernaEsq"], s: number): [V, V, V] => {
    const q: V = { x: s * p.quadrilLargura, y: 0 };
    const joelho = add(q, mul(rot(BAIXO, -s * l.quadril), p.coxa));
    const pe = add(joelho, mul(rot(BAIXO, -s * (l.quadril - l.joelho)), p.canela));
    return [q, joelho, pe];
  };

  return {
    quadril,
    pescoco,
    cabeca,
    bracoEsq: braco(pose.bracoEsq, 1),
    bracoDir: braco(pose.bracoDir, -1),
    pernaEsq: perna(pose.pernaEsq, 1),
    pernaDir: perna(pose.pernaDir, -1),
  };
};

const caminho = (pts: V[]) =>
  pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(2)} ${q.y.toFixed(2)}`).join(" ");

/** Desenha a silhueta inteira com uma única tinta (cor sólida ou url(#gradiente)). */
const Silhueta: React.FC<{
  e: Esqueleto;
  p: Proporcoes;
  tinta: string;
  frente: "esq" | "dir";
  /** cor da linha de oclusão sob o braço da frente (separa braços cruzados) */
  oclusao?: string;
}> = ({ e, p, tinta, frente, oclusao }) => {
  const membro = {
    fill: "none",
    stroke: tinta,
    strokeWidth: p.membroEspessura,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const braco = (b: [V, V, V]) => (
    <g>
      <path d={caminho(b)} {...membro} />
      <circle cx={b[2].x} cy={b[2].y} r={p.maoRaio} fill={tinta} />
    </g>
  );
  const [atras, naFrente] = frente === "esq" ? [e.bracoDir, e.bracoEsq] : [e.bracoEsq, e.bracoDir];
  // a oclusão só aparece quando a mão passa da linha do meio (braços cruzando);
  // com os braços soltos ela some e não risca o tronco
  const cruzamento = (b: [V, V, V], s: number) =>
    Math.min(1, Math.max(0, (-s * b[2].x) / (p.troncoEspessura * 0.6)));
  const sFrente = frente === "esq" ? 1 : -1;
  const ocFrente = cruzamento(naFrente, sFrente);
  const ocAtras = cruzamento(atras, -sFrente);
  return (
    <g>
      <path d={caminho(e.pernaEsq)} {...membro} />
      <path d={caminho(e.pernaDir)} {...membro} />
      <path
        d={caminho([e.quadril, e.pescoco])}
        {...membro}
        strokeWidth={p.troncoEspessura}
      />
      {oclusao && (
        <path d={caminho(atras)} {...membro} stroke={oclusao} strokeWidth={p.membroEspessura + 5} strokeOpacity={0.14 * ocAtras} />
      )}
      {braco(atras)}
      <circle cx={e.cabeca.x} cy={e.cabeca.y} r={p.cabecaRaio} fill={tinta} />
      {oclusao && (
        <path
          d={caminho(naFrente)}
          {...membro}
          stroke={oclusao}
          strokeWidth={p.membroEspessura + 7}
          strokeOpacity={0.28 * ocFrente}
        />
      )}
      {braco(naFrente)}
    </g>
  );
};

export type Luz = {
  /** de que lado da TELA vem a luz: 1 = direita, −1 = esquerda */
  lado: 1 | -1;
  /** cor do brilho no lado iluminado */
  cor: string;
  /** 0–1: quanto o lado oposto escurece */
  forca: number;
};

export type BonecoProps = {
  pose: Pose;
  /** x do centro do quadril, em px da composição */
  x: number;
  /** y onde os pés tocam o chão */
  chao: number;
  escala?: number;
  cor?: string;
  /** null = cor chapada (útil para sombras projetadas) */
  luz?: Luz | null;
  proporcoes?: Partial<Proporcoes>;
  /** vira o boneco horizontalmente (troca qual braço fica de cada lado) */
  espelhar?: boolean;
  style?: CSSProperties;
};

export const Boneco: React.FC<BonecoProps> = ({
  pose,
  x,
  chao,
  escala = 1,
  cor = theme.cores.boneco,
  luz = null,
  proporcoes,
  espelhar = false,
  style,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = { ...PROPORCOES_PADRAO, ...proporcoes };
  const e = esqueleto(pose, p);
  // apoia o pé mais baixo no chão
  const base = Math.max(e.pernaEsq[2].y, e.pernaDir[2].y) + p.membroEspessura / 2;
  const frente = pose.bracoNaFrente ?? "esq";
  // a luz é dada em coordenadas de tela; se espelhado, inverte dentro do grupo
  const ladoLocal = luz ? (espelhar ? -luz.lado : luz.lado) : 1;
  const meia = p.tronco * 0.75;

  return (
    <svg
      width={1}
      height={1}
      style={{ position: "absolute", left: x, top: chao, overflow: "visible", ...style }}
    >
      {luz && (
        <defs>
          <linearGradient
            id={`sombra${id}`}
            gradientUnits="userSpaceOnUse"
            x1={ladoLocal * meia}
            y1={0}
            x2={-ladoLocal * meia}
            y2={0}
          >
            <stop offset="0" stopColor={theme.cores.bonecoSombra} stopOpacity={0} />
            <stop offset="0.45" stopColor={theme.cores.bonecoSombra} stopOpacity={0.12 * luz.forca} />
            <stop offset="1" stopColor={theme.cores.bonecoSombra} stopOpacity={0.78 * luz.forca} />
          </linearGradient>
          <linearGradient
            id={`brilho${id}`}
            gradientUnits="userSpaceOnUse"
            x1={ladoLocal * meia * 0.55}
            y1={0}
            x2={-ladoLocal * meia * 0.1}
            y2={0}
          >
            <stop offset="0" stopColor={luz.cor} stopOpacity={0.55} />
            <stop offset="1" stopColor={luz.cor} stopOpacity={0} />
          </linearGradient>
          <mask id={`mascara${id}`} maskUnits="userSpaceOnUse" x={-600} y={-900} width={1200} height={1100}>
            {/* conteúdo da máscara usa o espaço do <g> que a referencia */}
            <Silhueta e={e} p={p} tinta="#fff" frente={frente} />
          </mask>
        </defs>
      )}
      <g transform={`scale(${escala * (espelhar ? -1 : 1)} ${escala}) translate(0 ${-base})`}>
        <Silhueta
          e={e}
          p={p}
          tinta={cor}
          frente={frente}
          oclusao={luz ? theme.cores.bonecoSombra : undefined}
        />
        {luz && (
          // a luz é um retângulo de gradiente recortado pela silhueta: uma camada só,
          // sem escurecer em dobro onde os membros se sobrepõem
          <g mask={`url(#mascara${id})`}>
            <rect x={-600} y={-900} width={1200} height={1100} fill={`url(#brilho${id})`} />
            <rect x={-600} y={-900} width={1200} height={1100} fill={`url(#sombra${id})`} />
          </g>
        )}
      </g>
    </svg>
  );
};
