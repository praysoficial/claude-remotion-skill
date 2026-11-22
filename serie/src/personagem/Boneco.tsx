// Boneco.tsx — o boneco base das séries. Branco, sem rosto, membros grossos e
// arredondados. Recebe uma Pose (ângulos) e desenha por cinemática direta.
// Os pés ficam sempre apoiados no `chao` informado, qualquer que seja a pose.
//
// Vistas:
//   "frente" — convenções de pose.ts (ângulos espelhados por lado).
//   "perfil" — o boneco olha para a DIREITA da tela (use `espelhar` para a esquerda).
//              ombro + = braço vai pra frente · cotovelo + = antebraço dobra pra frente/cima
//              quadril + = coxa pra frente · joelho + = canela dobra pra trás
//              O lado esquerdo do boneco fica perto da câmera; o direito, atrás e mais escuro.
//
// Acessórios (o que diferencia cada personagem) entram por três camadas:
//   atras(e, p, tinta)  — desenhado antes do corpo (ex.: rabo de cavalo atrás da cabeça)
//   corpo(e, p, tinta)  — da cor do corpo, recebe a mesma luz (ex.: topete)
//   roupa(e, p, chapado) — cores próprias por cima (gravata, boné, gola, objetos na mão)
import React, { CSSProperties, ReactNode, useId } from "react";
import { theme } from "../theme";
import { Pose, PROPORCOES_PADRAO, Proporcoes } from "./pose";

export type V = { x: number; y: number };
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

export type Vista = "frente" | "perfil";

export type Esqueleto = {
  quadril: V;
  pescoco: V;
  cabeca: V;
  /** ângulo absoluto da cabeça e do tronco (graus, + = horário) */
  angCabeca: number;
  angTronco: number;
  bracoEsq: [V, V, V];
  bracoDir: [V, V, V];
  pernaEsq: [V, V, V];
  pernaDir: [V, V, V];
  vista: Vista;
};

/** Posições das juntas com o centro do quadril em (0,0). Útil para prender objetos à mão. */
export const esqueleto = (pose: Pose, p: Proporcoes, vista: Vista = "frente"): Esqueleto => {
  const quadril: V = { x: 0, y: 0 };
  const cima = rot(CIMA, pose.tronco);
  const lado = rot(DIREITA, pose.tronco);
  const pescoco = add(quadril, mul(cima, p.tronco));
  const angCabeca = pose.tronco + pose.cabeca;
  const cabeca = add(pescoco, mul(rot(CIMA, angCabeca), p.pescoco + p.cabecaRaio));
  const perfil = vista === "perfil";

  // frente: s = +1 → lado esquerdo do boneco (direita da tela); s = −1 → lado direito
  const braco = (b: Pose["bracoEsq"], s: number): [V, V, V] => {
    const larg = perfil ? 0 : s * p.ombroLargura;
    const ombro = add(add(pescoco, mul(cima, -p.ombroQueda)), mul(lado, larg));
    const a1 = perfil ? pose.tronco - b.ombro : pose.tronco - s * b.ombro;
    const a2 = perfil ? pose.tronco - (b.ombro + b.cotovelo) : pose.tronco - s * (b.ombro - b.cotovelo);
    const cotovelo = add(ombro, mul(rot(BAIXO, a1), p.braco));
    const mao = add(cotovelo, mul(rot(BAIXO, a2), p.antebraco));
    return [ombro, cotovelo, mao];
  };
  const perna = (l: Pose["pernaEsq"], s: number): [V, V, V] => {
    const q: V = { x: perfil ? 0 : s * p.quadrilLargura, y: 0 };
    const a1 = perfil ? -l.quadril : -s * l.quadril;
    const a2 = perfil ? -(l.quadril - l.joelho) : -s * (l.quadril - l.joelho);
    const joelho = add(q, mul(rot(BAIXO, a1), p.coxa));
    const pe = add(joelho, mul(rot(BAIXO, a2), p.canela));
    return [q, joelho, pe];
  };

  return {
    quadril,
    pescoco,
    cabeca,
    angCabeca,
    angTronco: pose.tronco,
    bracoEsq: braco(pose.bracoEsq, 1),
    bracoDir: braco(pose.bracoDir, -1),
    pernaEsq: perna(pose.pernaEsq, 1),
    pernaDir: perna(pose.pernaDir, -1),
    vista,
  };
};

export const caminho = (pts: V[]) =>
  pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(2)} ${q.y.toFixed(2)}`).join(" ");

/** Grupo no espaço da cabeça: (0,0) = centro, −y = topo, já girado com a cabeça. */
export const NaCabeca: React.FC<{ e: Esqueleto; children: ReactNode }> = ({ e, children }) => (
  <g transform={`translate(${e.cabeca.x} ${e.cabeca.y}) rotate(${e.angCabeca})`}>{children}</g>
);
/** Grupo no espaço do tronco: (0,0) = pescoço, +y desce pelo tronco. */
export const NoTronco: React.FC<{ e: Esqueleto; children: ReactNode }> = ({ e, children }) => (
  <g transform={`translate(${e.pescoco.x} ${e.pescoco.y}) rotate(${e.angTronco})`}>{children}</g>
);
/** Grupo na mão: (0,0) = mão, girado na direção do antebraço (+x aponta pra fora). */
export const NaMao: React.FC<{ b: [V, V, V]; children: ReactNode }> = ({ b, children }) => {
  const ang = (Math.atan2(b[2].y - b[1].y, b[2].x - b[1].x) * 180) / Math.PI;
  return <g transform={`translate(${b[2].x} ${b[2].y}) rotate(${ang})`}>{children}</g>;
};

export type Camada = (e: Esqueleto, p: Proporcoes, tinta: string) => ReactNode;
export type CamadaRoupa = (e: Esqueleto, p: Proporcoes, chapado: string | null) => ReactNode;

/** Desenha a silhueta inteira com uma única tinta (cor sólida ou url(#gradiente)). */
const Silhueta: React.FC<{
  e: Esqueleto;
  p: Proporcoes;
  tinta: string;
  frente: "esq" | "dir";
  /** tinta dos membros do lado de lá, no perfil (profundidade) */
  tintaLonge?: string;
  /** cor da linha de oclusão sob o braço da frente (separa membros sobrepostos) */
  oclusao?: string;
  corpo?: Camada;
  atras?: Camada;
}> = ({ e, p, tinta, frente, tintaLonge, oclusao, corpo, atras }) => {
  const membro = (cor: string) => ({
    fill: "none",
    stroke: cor,
    strokeWidth: p.membroEspessura,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  });
  const braco = (b: [V, V, V], cor: string) => (
    <g>
      <path d={caminho(b)} {...membro(cor)} />
      <circle cx={b[2].x} cy={b[2].y} r={p.maoRaio} fill={cor} />
    </g>
  );
  const linhaOclusao = (b: [V, V, V], op: number, extra = 7) =>
    oclusao && op > 0 ? (
      <path d={caminho(b)} {...membro(oclusao)} strokeWidth={p.membroEspessura + extra} strokeOpacity={op} />
    ) : null;
  const tronco = (
    <path d={caminho([e.quadril, e.pescoco])} {...membro(tinta)} strokeWidth={p.troncoEspessura} />
  );
  const cabeca = <circle cx={e.cabeca.x} cy={e.cabeca.y} r={p.cabecaRaio} fill={tinta} />;

  if (e.vista === "perfil") {
    const longe = tintaLonge ?? tinta;
    return (
      <g>
        {atras?.(e, p, tinta)}
        {braco(e.bracoDir, longe)}
        <path d={caminho(e.pernaDir)} {...membro(longe)} />
        {tronco}
        {linhaOclusao(e.pernaEsq, 0.22, 5)}
        <path d={caminho(e.pernaEsq)} {...membro(tinta)} />
        {cabeca}
        {corpo?.(e, p, tinta)}
        {linhaOclusao(e.bracoEsq, 0.26)}
        {braco(e.bracoEsq, tinta)}
      </g>
    );
  }

  const [atrasB, naFrente] = frente === "esq" ? [e.bracoDir, e.bracoEsq] : [e.bracoEsq, e.bracoDir];
  // a oclusão só aparece quando a mão passa da linha do meio (braços cruzando)
  const cruzamento = (b: [V, V, V], s: number) =>
    Math.min(1, Math.max(0, (-s * b[2].x) / (p.troncoEspessura * 0.6)));
  const sFrente = frente === "esq" ? 1 : -1;
  return (
    <g>
      {atras?.(e, p, tinta)}
      <path d={caminho(e.pernaEsq)} {...membro(tinta)} />
      <path d={caminho(e.pernaDir)} {...membro(tinta)} />
      {tronco}
      {linhaOclusao(atrasB, 0.14 * cruzamento(atrasB, -sFrente), 5)}
      {braco(atrasB, tinta)}
      {cabeca}
      {corpo?.(e, p, tinta)}
      {linhaOclusao(naFrente, 0.28 * cruzamento(naFrente, sFrente))}
      {braco(naFrente, tinta)}
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
  /** luz vinda de baixo (tela de celular): escurece o topo em vez do lado */
  deBaixo?: boolean;
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
  vista?: Vista;
  /** vira o boneco horizontalmente (no perfil: olha para a esquerda) */
  espelhar?: boolean;
  atras?: Camada;
  corpo?: Camada;
  roupa?: CamadaRoupa;
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
  vista = "frente",
  espelhar = false,
  atras,
  corpo,
  roupa,
  style,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = { ...PROPORCOES_PADRAO, ...proporcoes };
  const e = esqueleto(pose, p, vista);
  // apoia o pé mais baixo no chão
  const base = Math.max(e.pernaEsq[2].y, e.pernaDir[2].y) + p.membroEspessura / 2;
  const frente = pose.bracoNaFrente ?? "esq";
  // a luz é dada em coordenadas de tela; se espelhado, inverte dentro do grupo
  const ladoLocal = luz ? (espelhar ? -luz.lado : luz.lado) : 1;
  const meia = p.tronco * 0.75;
  const chapado = luz ? null : cor;
  const longe = luz ? "#C3C8D6" : cor;
  const altura = p.tronco + p.pescoco + p.cabecaRaio * 2;

  return (
    <svg
      width={1}
      height={1}
      style={{ position: "absolute", left: x, top: chao, overflow: "visible", ...style }}
    >
      {luz && (
        <defs>
          {luz.deBaixo ? (
            <linearGradient id={`sombra${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={60} x2={0} y2={-altura - 40}>
              <stop offset="0" stopColor={theme.cores.bonecoSombra} stopOpacity={0.05 * luz.forca} />
              <stop offset="0.5" stopColor={theme.cores.bonecoSombra} stopOpacity={0.3 * luz.forca} />
              <stop offset="1" stopColor={theme.cores.bonecoSombra} stopOpacity={0.8 * luz.forca} />
            </linearGradient>
          ) : (
            <linearGradient id={`sombra${id}`} gradientUnits="userSpaceOnUse" x1={ladoLocal * meia} y1={0} x2={-ladoLocal * meia} y2={0}>
              <stop offset="0" stopColor={theme.cores.bonecoSombra} stopOpacity={0} />
              <stop offset="0.45" stopColor={theme.cores.bonecoSombra} stopOpacity={0.12 * luz.forca} />
              <stop offset="1" stopColor={theme.cores.bonecoSombra} stopOpacity={0.78 * luz.forca} />
            </linearGradient>
          )}
          {luz.deBaixo ? (
            <linearGradient id={`brilho${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={-altura * 0.35} x2={0} y2={-altura * 0.75}>
              <stop offset="0" stopColor={luz.cor} stopOpacity={0.45} />
              <stop offset="1" stopColor={luz.cor} stopOpacity={0} />
            </linearGradient>
          ) : (
            <linearGradient id={`brilho${id}`} gradientUnits="userSpaceOnUse" x1={ladoLocal * meia * 0.55} y1={0} x2={-ladoLocal * meia * 0.1} y2={0}>
              <stop offset="0" stopColor={luz.cor} stopOpacity={0.55} />
              <stop offset="1" stopColor={luz.cor} stopOpacity={0} />
            </linearGradient>
          )}
          <mask id={`mascara${id}`} maskUnits="userSpaceOnUse" x={-600} y={-900} width={1200} height={1100}>
            {/* conteúdo da máscara usa o espaço do <g> que a referencia */}
            <Silhueta e={e} p={p} tinta="#fff" frente={frente} corpo={corpo} atras={atras} />
          </mask>
        </defs>
      )}
      <g transform={`scale(${escala * (espelhar ? -1 : 1)} ${escala}) translate(0 ${-base})`}>
        <Silhueta
          e={e}
          p={p}
          tinta={cor}
          tintaLonge={longe}
          frente={frente}
          oclusao={luz ? theme.cores.bonecoSombra : undefined}
          corpo={corpo}
          atras={atras}
        />
        {luz && (
          // a luz é um retângulo de gradiente recortado pela silhueta: uma camada só,
          // sem escurecer em dobro onde os membros se sobrepõem
          <g mask={`url(#mascara${id})`}>
            <rect x={-600} y={-900} width={1200} height={1100} fill={`url(#brilho${id})`} />
            <rect x={-600} y={-900} width={1200} height={1100} fill={`url(#sombra${id})`} />
          </g>
        )}
        {roupa?.(e, p, chapado)}
      </g>
    </svg>
  );
};
