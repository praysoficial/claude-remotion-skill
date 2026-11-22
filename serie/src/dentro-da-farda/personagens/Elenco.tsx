// Elenco.tsx — os personagens de DENTRO DA FARDA. Todos usam o mesmo <Boneco />
// branco e sem rosto. Cada um tem UMA marca de silhueta que nenhum outro tem:
//
//   ARTHUR  — topete arrepiado (o mais novo; cabeça "em pé")
//   HELENA  — rabo de cavalo que balança
//   MENDES  — o maior do elenco, de gravata escura
//   DIEGO   — boné virado pra trás
//   VICTOR  — sobretudo de gola alta, sempre na penumbra
//   SEGURANÇA (coadjuvante) — capuz
//
// Regra: nenhum acessório pode ter ponto ou abertura dentro do círculo da cabeça
// (parece olho ou boca num personagem que não tem rosto).
// Objetos de mão (celular, lanterna, pasta) também são roupa e seguem a mão.
import React from "react";
import { Boneco, BonecoProps, caminho, Esqueleto, NaCabeca, NaMao, NoTronco, V, esqueleto } from "../../personagem/Boneco";
import { Pose, PROPORCOES_PADRAO, Proporcoes } from "../../personagem/pose";
import { tema } from "../tema";

const C = tema.cor;

export type Objeto = "celular" | "celularAceso" | "lanterna" | "pasta" | null;

type PersonagemProps = Omit<BonecoProps, "atras" | "corpo" | "roupa" | "proporcoes"> & {
  /** objeto na mão esquerda do boneco (a da frente, no perfil) */
  objeto?: Objeto;
  /** objeto na outra mão */
  objetoDir?: Objeto;
  /** 0–1, para acessórios que balançam (rabo de cavalo) */
  balanco?: number;
};

// ── Proporções de cada um ────────────────────────────────────────────────────
export const PROPORCOES: Record<string, Partial<Proporcoes>> = {
  arthur: { tronco: 146, troncoEspessura: 42, membroEspessura: 26, cabecaRaio: 42 },
  helena: { tronco: 140, troncoEspessura: 38, membroEspessura: 24, cabecaRaio: 40, coxa: 84, canela: 82 },
  mendes: { tronco: 162, troncoEspessura: 60, membroEspessura: 30, cabecaRaio: 46, ombroLargura: 24, braco: 82, antebraco: 74 },
  diego: { tronco: 148, troncoEspessura: 46, membroEspessura: 28, cabecaRaio: 43 },
  victor: { tronco: 156, troncoEspessura: 46, membroEspessura: 27, cabecaRaio: 43, coxa: 90, canela: 88 },
  seguranca: { tronco: 150, troncoEspessura: 50, membroEspessura: 28, cabecaRaio: 44 },
};
const prop = (k: string): Proporcoes => ({ ...PROPORCOES_PADRAO, ...PROPORCOES[k] });

// ── Objetos de mão ───────────────────────────────────────────────────────────
const objetoNaMao = (o: Objeto, b: [V, V, V], chapado: string | null) => {
  if (!o) return null;
  const escuro = chapado ?? "#0B0D12";
  if (o === "celular" || o === "celularAceso") {
    return (
      <NaMao b={b}>
        <g transform="rotate(-90)">
          <rect x={-13} y={-8} width={26} height={44} rx={5} fill={escuro} />
          {o === "celularAceso" && !chapado && (
            <>
              <rect x={-10} y={-4} width={20} height={36} rx={3} fill={C.ciano} />
              <circle cx={0} cy={14} r={46} fill={C.ciano} opacity={0.16} />
            </>
          )}
        </g>
      </NaMao>
    );
  }
  if (o === "lanterna") {
    return (
      <NaMao b={b}>
        <rect x={-6} y={-9} width={40} height={18} rx={5} fill={escuro} />
        <rect x={30} y={-12} width={10} height={24} rx={3} fill={chapado ?? "#2A303C"} />
      </NaMao>
    );
  }
  if (o === "pasta") {
    return (
      <NaMao b={b}>
        <g transform="rotate(-90)">
          <rect x={-30} y={-4} width={60} height={78} rx={3} fill={chapado ?? "#6B5A3E"} />
          <rect x={-30} y={-4} width={60} height={10} fill={chapado ?? "#544631"} />
        </g>
      </NaMao>
    );
  }
  return null;
};

const objetos = (e: Esqueleto, chapado: string | null, oE?: Objeto, oD?: Objeto) => (
  <>
    {objetoNaMao(oD ?? null, e.bracoDir, chapado)}
    {objetoNaMao(oE ?? null, e.bracoEsq, chapado)}
  </>
);

// ── ARTHUR: topete ───────────────────────────────────────────────────────────
const topete = (e: Esqueleto, p: Proporcoes, tinta: string) => {
  const r = p.cabecaRaio;
  const perfil = e.vista === "perfil";
  // pontas do topete; no perfil, inclinadas pra frente (+x)
  const d = perfil
    ? `M ${-r * 0.75} ${-r * 0.55} L ${-r * 0.35} ${-r - 16} L ${-r * 0.05} ${-r * 0.92} L ${r * 0.25} ${-r - 24} L ${r * 0.45} ${-r * 0.85} L ${r * 0.85} ${-r - 14} L ${r * 0.8} ${-r * 0.5} Z`
    : `M ${-r * 0.8} ${-r * 0.5} L ${-r * 0.5} ${-r - 14} L ${-r * 0.2} ${-r * 0.9} L ${r * 0.08} ${-r - 22} L ${r * 0.3} ${-r * 0.88} L ${r * 0.62} ${-r - 13} L ${r * 0.82} ${-r * 0.5} Z`;
  return (
    <NaCabeca e={e}>
      <path d={d} fill={tinta} stroke={tinta} strokeWidth={6} strokeLinejoin="round" />
    </NaCabeca>
  );
};

export const Arthur: React.FC<PersonagemProps> = ({ objeto, objetoDir, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.arthur}
    corpo={topete}
    roupa={(e, _p, ch) => objetos(e, ch, objeto, objetoDir)}
  />
);

// ── HELENA: rabo de cavalo ───────────────────────────────────────────────────
const raboDeCavalo = (balanco: number) => (e: Esqueleto, p: Proporcoes, tinta: string) => {
  const r = p.cabecaRaio;
  const perfil = e.vista === "perfil";
  const sw = Math.sin(balanco * Math.PI * 2) * 8;
  // preso no alto da nuca, sobe um pouco e cai pra trás (perfil: −x)
  const d = perfil
    ? `M ${-r * 0.45} ${-r * 0.85} C ${-r * 1.6} ${-r * 1.25}, ${-r * 2.0 + sw * 0.5} ${-r * 0.1}, ${-r * 1.6 + sw} ${r * 1.45} C ${-r * 1.4 + sw} ${r * 0.45}, ${-r * 1.15} ${-r * 0.15}, ${-r * 0.8} ${-r * 0.3} Z`
    : `M ${r * 0.3} ${-r * 0.9} C ${r * 1.45} ${-r * 1.25}, ${r * 1.75 + sw * 0.5} ${-r * 0.1}, ${r * 1.45 + sw} ${r * 1.35} C ${r * 1.25 + sw} ${r * 0.45}, ${r * 1.0} ${-r * 0.2}, ${r * 0.65} ${-r * 0.4} Z`;
  return (
    <NaCabeca e={e}>
      <path d={d} fill={tinta} stroke={tinta} strokeWidth={6} strokeLinejoin="round" />
    </NaCabeca>
  );
};
// elástico: uma faixa escura no começo do rabo, fora do círculo da cabeça
const elastico = (e: Esqueleto, p: Proporcoes, chapado: string | null) => {
  const r = p.cabecaRaio;
  const perfil = e.vista === "perfil";
  const pos = perfil ? { x: -r * 1.05, y: -r * 0.95, a: 65 } : { x: r * 0.92, y: -r * 0.98, a: -65 };
  return (
    <NaCabeca e={e}>
      <rect x={pos.x - 4} y={pos.y - 11} width={8} height={22} rx={3} fill={chapado ?? C.roupaEscura} transform={`rotate(${pos.a} ${pos.x} ${pos.y})`} />
    </NaCabeca>
  );
};

export const Helena: React.FC<PersonagemProps> = ({ objeto, objetoDir, balanco = 0, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.helena}
    atras={raboDeCavalo(balanco)}
    roupa={(e, p, ch) => (
      <>
        {elastico(e, p, ch)}
        {objetos(e, ch, objeto, objetoDir)}
      </>
    )}
  />
);

// ── MENDES: gravata, o maior do elenco ───────────────────────────────────────
const gravata = (e: Esqueleto, p: Proporcoes, chapado: string | null) => {
  const perfil = e.vista === "perfil";
  const cor = chapado ?? C.gravata;
  const comp = p.tronco * 0.62;
  const x0 = perfil ? p.troncoEspessura * 0.38 : 0;
  return (
    <NoTronco e={e}>
      <g transform={`translate(${x0} 0)`}>
        <path d={`M -9 2 L 9 2 L 5 14 L -5 14 Z`} fill={cor} />
        <path d={`M -5 14 L 5 14 L 10 ${comp} L 0 ${comp + 14} L -10 ${comp} Z`} fill={cor} />
        {!chapado && <path d={`M -2 18 L 2 18 L 4 ${comp - 6} L -4 ${comp - 6} Z`} fill="#262C3B" />}
      </g>
    </NoTronco>
  );
};

export const Mendes: React.FC<PersonagemProps> = ({ objeto, objetoDir, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.mendes}
    roupa={(e, p, ch) => (
      <>
        {gravata(e, p, ch)}
        {objetos(e, ch, objeto, objetoDir)}
      </>
    )}
  />
);

// ── DIEGO: boné virado pra trás ──────────────────────────────────────────────
const boneVirado = (e: Esqueleto, p: Proporcoes, chapado: string | null) => {
  const r = p.cabecaRaio;
  const perfil = e.vista === "perfil";
  const cor = chapado ?? C.roupaMedia;
  const aba = chapado ?? C.roupaEscura;
  return (
    <NaCabeca e={e}>
      {/* copa cobrindo o topo da cabeça */}
      <path d={`M ${-r - 3} ${-r * 0.15} A ${r + 3} ${r + 3} 0 0 1 ${r + 3} ${-r * 0.15} Z`} fill={cor} />
      {perfil ? (
        // aba pra trás (−x)
        <path d={`M ${-r * 0.6} ${-r * 0.2} L ${-r * 1.75} ${-r * 0.02} L ${-r * 1.7} ${r * 0.12} L ${-r * 0.5} ${r * 0.02} Z`} fill={aba} />
      ) : (
        // de frente: só a copa e a costura do ajuste (sem nada que pareça rosto)
        <path d={`M ${-r * 0.95} ${-r * 0.32} Q 0 ${-r * 0.46} ${r * 0.95} ${-r * 0.32}`} stroke={aba} strokeWidth={5} fill="none" strokeLinecap="round" />
      )}
    </NaCabeca>
  );
};

export const Diego: React.FC<PersonagemProps> = ({ objeto, objetoDir, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.diego}
    roupa={(e, p, ch) => (
      <>
        {boneVirado(e, p, ch)}
        {objetos(e, ch, objeto, objetoDir)}
      </>
    )}
  />
);

// ── VICTOR: sobretudo de gola alta ───────────────────────────────────────────
const sobretudo = (e: Esqueleto, p: Proporcoes, chapado: string | null) => {
  const cor = chapado ?? C.roupaEscura;
  const borda = chapado ?? "#232A3A";
  const w = p.troncoEspessura / 2 + 8;
  const L = p.tronco + 70;
  return (
    <NoTronco e={e}>
      {/* corpo do casaco */}
      <path d={`M ${-w} -6 L ${w} -6 L ${w + 14} ${L} L ${-w - 14} ${L} Z`} fill={cor} />
      {/* gola alta subindo pelos lados do pescoço */}
      <path d={`M ${-w} 4 L ${-w + 2} ${-p.pescoco - 6} L ${-w + 18} ${-p.pescoco + 4} L ${-6} 10 Z`} fill={borda} />
      <path d={`M ${w} 4 L ${w - 2} ${-p.pescoco - 6} L ${w - 18} ${-p.pescoco + 4} L 6 10 Z`} fill={borda} />
      <line x1={0} y1={10} x2={0} y2={L - 6} stroke={chapado ?? "#0A0D14"} strokeWidth={3} />
    </NoTronco>
  );
};

export const Victor: React.FC<PersonagemProps> = ({ objeto, objetoDir, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.victor}
    roupa={(e, p, ch) => (
      <>
        {sobretudo(e, p, ch)}
        {objetos(e, ch, objeto, objetoDir)}
      </>
    )}
  />
);

// ── SEGURANÇA: capuz ─────────────────────────────────────────────────────────
const capuz = (e: Esqueleto, p: Proporcoes, chapado: string | null) => {
  const r = p.cabecaRaio;
  const perfil = e.vista === "perfil";
  const cor = chapado ?? "#3A4152";
  return (
    <NaCabeca e={e}>
      {perfil ? (
        <path
          d={`M ${r * 0.55} ${-r * 0.95} A ${r + 9} ${r + 9} 0 1 0 ${r * 0.5} ${r * 1.0} L ${r * 0.2} ${r * 0.55} A ${r * 0.8} ${r * 0.8} 0 1 1 ${r * 0.35} ${-r * 0.65} Z`}
          fill={cor}
        />
      ) : (
        <>
          <circle cx={0} cy={0} r={r + 9} fill={cor} />
          <ellipse cx={0} cy={r * 0.12} rx={r * 0.62} ry={r * 0.72} fill={chapado ?? "#0A0C11"} />
        </>
      )}
    </NaCabeca>
  );
};

export const Seguranca: React.FC<PersonagemProps> = ({ objeto, objetoDir, ...b }) => (
  <Boneco
    {...b}
    proporcoes={PROPORCOES.seguranca}
    roupa={(e, p, ch) => (
      <>
        <NoTronco e={e}>
          <path
            d={`M ${-p.troncoEspessura / 2 - 6} -4 L ${p.troncoEspessura / 2 + 6} -4 L ${p.troncoEspessura / 2 + 8} ${p.tronco + 14} L ${-p.troncoEspessura / 2 - 8} ${p.tronco + 14} Z`}
            fill={ch ?? "#3A4152"}
          />
        </NoTronco>
        {capuz(e, p, ch)}
        {objetos(e, ch, objeto, objetoDir)}
      </>
    )}
  />
);

// ── Utilitário: posição de uma junta na tela (para luzes e objetos de cena) ──
export const juntaNaTela = (
  quem: keyof typeof PROPORCOES,
  pose: Pose,
  o: { x: number; chao: number; escala?: number; vista?: "frente" | "perfil"; espelhar?: boolean },
  junta: (e: Esqueleto) => V,
): V => {
  const p = prop(quem);
  const e = esqueleto(pose, p, o.vista ?? "frente");
  const base = Math.max(e.pernaEsq[2].y, e.pernaDir[2].y) + p.membroEspessura / 2;
  const s = o.escala ?? 1;
  const j = junta(e);
  return { x: o.x + j.x * s * (o.espelhar ? -1 : 1), y: o.chao + (j.y - base) * s };
};

export { caminho };
