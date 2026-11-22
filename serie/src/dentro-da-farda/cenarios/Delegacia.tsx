// Delegacia.tsx — cenários da delegacia à noite: sala do Mendes, corredor em
// perspectiva, sala de interrogatório e a rua em frente.
// Corredor: a sala de interrogatório fica na parede ESQUERDA (luz vermelha "EM USO")
// e a saída na DIREITA (placa ciano). É o mesmo lado das opções na cartela de voto.
import React, { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { tema } from "../tema";

const C = tema.cor;

// ── SALA DO MENDES ────────────────────────────────────────────────────────────
export const SalaMendes: React.FC<{ luzRua: number }> = ({ luzRua }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920}>
      <defs>
        <linearGradient id="smParede" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B1F26" />
          <stop offset="1" stopColor="#111419" />
        </linearGradient>
        <radialGradient id="smAbajur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.lampadaQuente} stopOpacity={0.5} />
          <stop offset="1" stopColor={C.lampadaQuente} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="smMesa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2C22" />
          <stop offset="1" stopColor="#1A130E" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#smParede)" />
      {/* lambri de madeira */}
      <rect y={1080} width={1080} height={840} fill="#17120E" />
      <rect y={1074} width={1080} height={10} fill="#2A2019" />
      {/* janela com persiana: listras de luz da rua */}
      <rect x={300} y={300} width={480} height={560} fill="#0C1520" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={300} y={306 + i * 35} width={480} height={22} fill="#33414F" opacity={0.85} />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={`l${i}`} x={300} y={328 + i * 35} width={480} height={7} fill={C.luzFria} opacity={0.18 * luzRua} />
      ))}
      <rect x={290} y={290} width={500} height={580} fill="none" stroke="#2A303A" strokeWidth={14} />
      {/* listras da persiana projetadas na parede */}
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={`p${i}`} d={`M 790 ${420 + i * 70} L 1080 ${470 + i * 80} L 1080 ${500 + i * 80} L 790 ${440 + i * 70} Z`} fill={C.luzFria} opacity={0.05 * luzRua} />
      ))}
      {/* estante e diplomas */}
      <rect x={40} y={420} width={190} height={620} fill="#14100C" />
      {[520, 680, 840].map((y) => <rect key={y} x={40} y={y} width={190} height={10} fill="#2A2019" />)}
      {[[60, 460, 30, 60], [100, 470, 26, 50], [140, 455, 34, 65], [60, 610, 70, 60], [150, 770, 40, 70]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#2A2420" />
      ))}
      <rect x={860} y={420} width={140} height={100} fill="#1F242C" stroke="#3A3F48" strokeWidth={6} />
      <rect x={860} y={560} width={140} height={100} fill="#1F242C" stroke="#3A3F48" strokeWidth={6} />
      {/* abajur e mesa */}
      <ellipse cx={230} cy={1100} rx={380} ry={300} fill="url(#smAbajur)" />
    </svg>
  </AbsoluteFill>
);

/** Frente da mesa do Mendes (desenhada POR CIMA dele, esconde as pernas). */
export const MesaMendes: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="mmTampo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4A382B" />
        <stop offset="1" stopColor="#2E231B" />
      </linearGradient>
    </defs>
    <rect x={250} y={1180} width={830} height={34} fill="url(#mmTampo)" />
    <rect x={270} y={1214} width={790} height={420} fill="#211912" />
    <rect x={270} y={1214} width={790} height={8} fill="#000" opacity={0.4} />
    {/* abajur sobre a mesa */}
    <path d="M 330 1182 L 350 1060 L 300 1060 Z" fill="#14100C" />
    <path d="M 270 1070 L 390 1070 L 360 990 L 300 990 Z" fill="#6B5232" />
    <path d="M 270 1070 L 390 1070 L 384 1056 L 276 1056 Z" fill={C.lampadaQuente} opacity={0.9} />
  </svg>
);

// ── CORREDOR em perspectiva (ponto de fuga no centro) ────────────────────────
const VP = { x: 540, fundoTopo: 700, fundoBase: 1180, fundoEsq: 360, fundoDir: 720 };
/** Ponto numa parede lateral: d = profundidade (0 frente, 1 fundo), h = altura (0 chão, 1 teto). */
export const paredeEsq = (d: number, h: number) => {
  const x = VP.fundoEsq * d;
  const yChao = 1656 + (VP.fundoBase - 1656) * d;
  const yTeto = 224 + (VP.fundoTopo - 224) * d;
  return { x, y: yChao + (yTeto - yChao) * h };
};
export const paredeDir = (d: number, h: number) => {
  const p = paredeEsq(d, h);
  return { x: 1080 - p.x, y: p.y };
};
const quad = (f: (d: number, h: number) => { x: number; y: number }, d0: number, d1: number, h0: number, h1: number) => {
  const a = f(d0, h0), b = f(d1, h0), c = f(d1, h1), d = f(d0, h1);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} L ${d.x} ${d.y} Z`;
};

export const Corredor: React.FC<{
  lampadas: [number, number, number];
  /** 0–1: porta do Mendes no fundo aberta */
  portaMendes?: number;
  relogio?: string;
  /** conteúdo visto pela janela da sala de interrogatório (já recortado) */
  janela?: ReactNode;
  luzInterrogatorio?: number;
  luzSaida?: number;
}> = ({ lampadas, portaMendes = 0, relogio = "21:47", janela, luzInterrogatorio = 1, luzSaida = 1 }) => {
  const jan = quad(paredeEsq, 0.12, 0.46, 0.34, 0.72);
  const poligonoJanela = [paredeEsq(0.12, 0.34), paredeEsq(0.46, 0.34), paredeEsq(0.46, 0.72), paredeEsq(0.12, 0.72)]
    .map((q) => `${q.x}px ${q.y}px`).join(", ");
  const portaI = quad(paredeEsq, 0.52, 0.7, 0, 0.62);
  const portaS = quad(paredeDir, 0.3, 0.52, 0, 0.62);
  const lampI = paredeEsq(0.61, 0.7);
  const placaS = paredeDir(0.41, 0.72);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="crChao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14181F" />
            <stop offset="1" stopColor="#07090D" />
          </linearGradient>
          <linearGradient id="crParE" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#151A22" />
            <stop offset="1" stopColor="#222937" />
          </linearGradient>
          <linearGradient id="crParD" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#151A22" />
            <stop offset="1" stopColor="#222937" />
          </linearGradient>
          <radialGradient id="crVerm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.vermelho} stopOpacity={0.5} />
            <stop offset="1" stopColor={C.vermelho} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="crCiano" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.ciano} stopOpacity={0.45} />
            <stop offset="1" stopColor={C.ciano} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="crQuente" cx="0.5" cy="1" r="1">
            <stop offset="0" stopColor={C.lampadaQuente} stopOpacity={0.55} />
            <stop offset="1" stopColor={C.lampadaQuente} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* teto, paredes, chão e fundo */}
        <path d="M 0 0 L 1080 0 L 1080 224 L 720 700 L 360 700 L 0 224 Z" fill="#0D1016" />
        <path d="M 0 224 L 360 700 L 360 1180 L 0 1656 Z" fill="url(#crParE)" />
        <path d="M 1080 224 L 720 700 L 720 1180 L 1080 1656 Z" fill="url(#crParD)" />
        <path d="M 0 1656 L 360 1180 L 720 1180 L 1080 1656 L 1080 1920 L 0 1920 Z" fill="url(#crChao)" />
        <rect x={360} y={700} width={360} height={480} fill="#1D232E" />
        {/* rodapés */}
        <path d={quad(paredeEsq, 0, 1, 0, 0.04)} fill="#0B0D12" />
        <path d={quad(paredeDir, 0, 1, 0, 0.04)} fill="#0B0D12" />
        {/* luminárias no teto (perspectiva) */}
        {[0.18, 0.5, 0.78].map((d, i) => {
          const y = 40 + (690 - 40) * d * 0.95;
          const w = 360 * (1 - d * 0.7);
          return (
            <g key={d} opacity={lampadas[i]}>
              <rect x={540 - w / 2} y={y} width={w} height={22 * (1 - d * 0.6)} rx={4} fill={C.fluorescente} />
              <ellipse cx={540} cy={y + 500 * (1 - d * 0.5)} rx={w * 1.4} ry={520 * (1 - d * 0.5)} fill={C.fluorescente} opacity={0.05} />
            </g>
          );
        })}
        {/* reflexo das luminárias no chão */}
        <ellipse cx={540} cy={1500} rx={300} ry={70} fill={C.fluorescente} opacity={0.05 * lampadas[0]} />

        {/* porta do Mendes no fundo */}
        <rect x={478} y={905} width={124} height={275} fill="#0A0C10" />
        <rect x={478} y={905} width={124} height={275} fill="url(#crQuente)" opacity={portaMendes} />
        <rect x={478 + 124 * portaMendes * 0.85} y={905} width={124 * (1 - portaMendes * 0.85)} height={275} fill="#2B241D" />
        <rect x={470} y={897} width={140} height={8} fill="#2B303A" />
        <text x={540} y={880} textAnchor="middle" fontFamily={tema.fonte.mono} fontSize={14} fill="#7C8594" letterSpacing={3}>CHEFIA</text>
        {/* relógio digital sobre a porta */}
        <rect x={488} y={790} width={104} height={48} rx={6} fill="#07090C" stroke="#2B303A" strokeWidth={3} />
        <text x={540} y={826} textAnchor="middle" fontFamily={tema.fonte.mono} fontWeight={700} fontSize={30} fill={C.texto}>{relogio}</text>

        {/* ESQUERDA: janela da sala de interrogatório + porta com luz vermelha */}
        <path d={jan} fill="#C9D2DA" opacity={0.18} />
        <path d={portaI} fill="#0E1116" stroke="#2B303A" strokeWidth={4} />
        <circle cx={lampI.x} cy={lampI.y} r={10} fill={C.vermelho} opacity={luzInterrogatorio} />
        <circle cx={lampI.x} cy={lampI.y} r={120} fill="url(#crVerm)" opacity={luzInterrogatorio} />
        <text x={lampI.x} y={lampI.y - 18} textAnchor="middle" fontFamily={tema.fonte.mono} fontWeight={700} fontSize={13} fill={C.vermelho} opacity={0.9 * luzInterrogatorio}>EM USO</text>

        {/* DIREITA: saída com placa ciano + quadro de avisos */}
        <path d={portaS} fill="#0E1116" stroke="#2B303A" strokeWidth={4} />
        <rect x={placaS.x - 46} y={placaS.y - 16} width={92} height={32} rx={4} fill="#06161B" stroke={C.ciano} strokeWidth={3} opacity={luzSaida} />
        <text x={placaS.x} y={placaS.y + 7} textAnchor="middle" fontFamily={tema.fonte.mono} fontWeight={700} fontSize={18} fill={C.ciano} opacity={luzSaida}>SAÍDA</text>
        <circle cx={placaS.x} cy={placaS.y} r={140} fill="url(#crCiano)" opacity={luzSaida * 0.8} />
        <path d={quad(paredeDir, 0.6, 0.86, 0.36, 0.62)} fill="#3A3226" opacity={0.6} />
        {[0.64, 0.72, 0.8].map((d) => (
          <path key={d} d={quad(paredeDir, d, d + 0.05, 0.42, 0.56)} fill="#BDB6A6" opacity={0.25} />
        ))}
      </svg>
      {/* conteúdo dentro da janela (o segurança sentado), recortado pela janela */}
      {janela && (
        <>
          <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${poligonoJanela})` }}>{janela}</div>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d={jan} fill="none" stroke="#2B303A" strokeWidth={10} />
          </svg>
        </>
      )}
    </AbsoluteFill>
  );
};

// ── SALA DE INTERROGATÓRIO (meia tela, 1080×960) ─────────────────────────────
export const SalaInterrogatorio: React.FC<{ porta: number; persiana: number }> = ({ porta, persiana }) => (
  <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="siLuz" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#E6EEF5" stopOpacity={0.3} />
        <stop offset="1" stopColor="#E6EEF5" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="siPorta" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor={C.vermelho} stopOpacity={0.55} />
        <stop offset="1" stopColor={C.vermelho} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={1080} height={960} fill="#1A1F24" />
    <rect y={760} width={1080} height={200} fill="#0D1014" />
    {/* janela com persiana: alguém pode estar olhando */}
    <rect x={110} y={170} width={330} height={250} fill="#0A0D11" />
    {Array.from({ length: 9 }).map((_, i) => {
      const abre = i === 4 ? persiana : 0;
      return <rect key={i} x={110} y={176 + i * 27 + (i > 4 ? abre * 10 : 0)} width={330} height={18 - (i === 4 ? abre * 12 : 0)} fill="#3B4450" />;
    })}
    {persiana > 0.05 && <rect x={250} y={290} width={80} height={14 * persiana} fill="#000" opacity={0.9} />}
    {/* luminária pendente */}
    <line x1={540} y1={0} x2={540} y2={150} stroke="#222" strokeWidth={4} />
    <path d="M 470 150 L 610 150 L 580 120 L 500 120 Z" fill="#2A2F36" />
    <ellipse cx={540} cy={170} rx={520} ry={700} fill="url(#siLuz)" />
    {/* porta à direita, com a luz vermelha do corredor entrando */}
    <rect x={880} y={260} width={170} height={500} fill="#0B0D11" />
    <rect x={880} y={260} width={170} height={500} fill="url(#siPorta)" opacity={porta} />
    <rect x={880 + 170 * porta * 0.8} y={260} width={170 * (1 - porta * 0.8)} height={500} fill="#2A2F36" />
  </svg>
);

/** Mesa da sala de interrogatório (desenhada por cima das pernas). */
export const MesaInterrogatorio: React.FC = () => (
  <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
    <rect x={380} y={640} width={400} height={22} fill="#3A4048" />
    <rect x={400} y={662} width={14} height={150} fill="#2A2F36" />
    <rect x={746} y={662} width={14} height={150} fill="#2A2F36" />
  </svg>
);

// ── RUA em frente à delegacia (meia tela, 1080×960) ──────────────────────────
export const RuaNoite: React.FC<{ farol: number; brasa: number }> = ({ farol, brasa }) => (
  <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="ruPoste" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor={C.ciano} stopOpacity={0.4} />
        <stop offset="1" stopColor={C.ciano} stopOpacity={0} />
      </radialGradient>
      <radialGradient id="ruPorta" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={C.lampadaQuente} stopOpacity={0.45} />
        <stop offset="1" stopColor={C.lampadaQuente} stopOpacity={0} />
      </radialGradient>
      <linearGradient id="ruFarol" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.35} />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={1080} height={960} fill="#07090D" />
    {/* prédios ao fundo */}
    {[[440, 120, 170, 520], [620, 60, 200, 580], [840, 160, 240, 480]].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#0E1219" />
        {Array.from({ length: 6 }).map((_, k) => (
          <rect key={k} x={x + 20 + (k % 3) * 50} y={y + 40 + Math.floor(k / 3) * 90} width={22} height={34} fill={k === 4 ? C.lampadaQuente : "#1A2130"} opacity={k === 4 ? 0.5 : 1} />
        ))}
      </g>
    ))}
    {/* fachada da delegacia à esquerda */}
    <rect x={0} y={150} width={420} height={590} fill="#1A1F28" />
    <rect x={0} y={150} width={420} height={40} fill="#232A36" />
    <text x={210} y={180} textAnchor="middle" fontFamily={tema.fonte.mono} fontWeight={700} fontSize={22} fill="#8A93A2" letterSpacing={4}>DELEGACIA</text>
    <rect x={130} y={420} width={170} height={320} fill="#2A2418" />
    <ellipse cx={215} cy={600} rx={260} ry={260} fill="url(#ruPorta)" />
    {/* calçada e rua */}
    <rect y={740} width={1080} height={40} fill="#1A1E26" />
    <rect y={780} width={1080} height={180} fill="#0B0D12" />
    {[60, 300, 540, 780, 1020].map((x) => <rect key={x} x={x} y={866} width={120} height={8} fill="#5A5F66" opacity={0.4} />)}
    {/* poste com luz ciano */}
    <rect x={850} y={170} width={16} height={570} fill="#2A303A" />
    <path d="M 858 170 L 780 170" stroke="#2A303A" strokeWidth={10} />
    <rect x={758} y={168} width={50} height={14} rx={4} fill={C.ciano} />
    <ellipse cx={783} cy={190} rx={260} ry={560} fill="url(#ruPoste)" />
    {/* faróis passando */}
    {farol > 0 && farol < 1 && <rect x={-600 + farol * 2300} y={600} width={600} height={300} fill="url(#ruFarol)" />}
    {/* brasa do cigarro (laranja, não é o vermelho de destaque) */}
    {brasa > 0 && <circle cx={470} cy={470} r={6} fill="#FF9A3C" opacity={brasa} />}
    {brasa > 0 && <circle cx={470} cy={470} r={26} fill="#FF9A3C" opacity={0.25 * brasa} />}
  </svg>
);
