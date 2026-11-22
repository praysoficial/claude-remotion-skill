// Estacionamento.tsx — subsolo B2 à noite: concreto, lâmpadas fluorescentes,
// o sedã do Victor de porta aberta e pisca-alerta ligado (vermelho).
import React from "react";
import { AbsoluteFill } from "remotion";
import { tema } from "../tema";

const C = tema.cor;

export const Estacionamento: React.FC<{
  t: number;
  /** 0–1: pisca-alerta aceso */
  alerta: number;
  /** brilho de cada lâmpada (0–1) */
  lampadas: [number, number];
  /** gota caindo: progresso 0–1 da queda (ou -1 se nenhuma) */
  gota: number;
  respingo: number;
}> = ({ alerta, lampadas, gota, respingo }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="estParede" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C212B" />
          <stop offset="1" stopColor="#10141B" />
        </linearGradient>
        <linearGradient id="estChao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12161E" />
          <stop offset="1" stopColor="#06080C" />
        </linearGradient>
        <radialGradient id="estLuz" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor={C.fluorescente} stopOpacity={0.32} />
          <stop offset="0.5" stopColor={C.fluorescente} stopOpacity={0.06} />
          <stop offset="1" stopColor={C.fluorescente} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="estAlerta" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.vermelho} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.vermelho} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="estCarro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3140" />
          <stop offset="0.5" stopColor="#151A24" />
          <stop offset="1" stopColor="#0B0E14" />
        </linearGradient>
        <linearGradient id="estVidro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#202838" />
          <stop offset="1" stopColor="#090C12" />
        </linearGradient>
      </defs>

      {/* teto e vigas */}
      <rect width={1080} height={380} fill="#0B0E14" />
      <rect y={110} width={1080} height={34} fill="#141922" />
      <rect y={300} width={1080} height={40} fill="#161B25" />
      {/* parede de concreto com juntas */}
      <rect y={340} width={1080} height={900} fill="url(#estParede)" />
      {[520, 720, 920, 1110].map((y) => (
        <rect key={y} y={y} width={1080} height={3} fill="#0D1016" opacity={0.7} />
      ))}
      {/* pilares com faixa de sinalização */}
      {[40, 890].map((x) => (
        <g key={x}>
          <rect x={x} y={340} width={150} height={900} fill="#232A36" />
          <rect x={x} y={340} width={14} height={900} fill="#2E3644" />
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M ${x} ${1110 + i * 24} l 150 -40 v 14 l -150 40 Z`} fill={C.faixaAmarela} opacity={0.35} />
          ))}
          <rect x={x} y={1090} width={150} height={150} fill="#000" opacity={0.25} />
        </g>
      ))}
      <text x={115} y={700} textAnchor="middle" fontFamily={tema.fonte.titulo} fontSize={110} fill="#3A4252">B2</text>

      {/* lâmpadas e cones de luz */}
      {[260, 800].map((x, i) => (
        <g key={x} opacity={lampadas[i]}>
          <rect x={x - 90} y={338} width={180} height={14} rx={4} fill={C.fluorescente} />
          <ellipse cx={x} cy={360} rx={420} ry={900} fill="url(#estLuz)" />
        </g>
      ))}

      {/* chão com faixas de vaga em perspectiva */}
      <rect y={1240} width={1080} height={680} fill="url(#estChao)" />
      {[-300, 120, 540, 960, 1380].map((x) => (
        <path key={x} d={`M ${540 + (x - 540) * 0.55} 1240 L ${540 + (x - 540) * 1.6} 1920`} stroke="#B9C2CF" strokeOpacity={0.13} strokeWidth={8} />
      ))}
      {/* poça com reflexo do pisca-alerta */}
      <ellipse cx={420} cy={1330} rx={260} ry={26} fill="#1A2030" opacity={0.8} />
      <ellipse cx={420} cy={1330} rx={200} ry={20} fill={C.vermelho} opacity={0.22 * alerta} />

      {/* sedã do Victor (lado do motorista, traseira à esquerda) */}
      <g>
        <ellipse cx={780} cy={1262} rx={430} ry={22} fill="#000" opacity={0.6} />
        <path d="M 360 1210 L 360 1080 Q 362 1040 420 1032 L 560 1022 L 650 940 Q 670 925 720 925 L 960 925 Q 1010 927 1040 960 L 1110 1030 L 1110 1210 Z" fill="url(#estCarro)" />
        <path d="M 600 1022 L 670 952 L 830 952 L 830 1022 Z" fill="url(#estVidro)" />
        <path d="M 846 952 L 960 952 Q 990 954 1010 980 L 1040 1022 L 846 1022 Z" fill="url(#estVidro)" />
        <rect x={360} y={1120} width={750} height={6} fill="#2C3444" />
        {/* porta aberta: vão escuro + folha da porta virada pra câmera */}
        <path d="M 560 1030 L 835 1030 L 835 1205 L 560 1205 Z" fill="#05070B" />
        <path d="M 835 960 L 700 990 L 690 1252 L 835 1214 Z" fill="#1E2533" />
        <path d="M 835 960 L 700 990 L 700 1046 L 835 1024 Z" fill="#0E131C" />
        <rect x={712} y={1100} width={40} height={8} rx={3} fill="#3A4354" />
        {/* rodas */}
        {[500, 980].map((x) => (
          <g key={x}>
            <circle cx={x} cy={1212} r={66} fill="#07090D" />
            <circle cx={x} cy={1212} r={34} fill="#1C222D" />
          </g>
        ))}
        {/* lanterna traseira: pisca-alerta */}
        <rect x={362} y={1058} width={22} height={46} rx={4} fill={alerta > 0.5 ? C.vermelho : "#3A1418"} />
        <circle cx={373} cy={1080} r={150} fill="url(#estAlerta)" opacity={alerta} />
      </g>

      {/* goteira: gota caindo e respingo na poça */}
      {gota >= 0 && <ellipse cx={470} cy={360 + gota * 960} rx={4} ry={9} fill="#9FB3C8" opacity={0.8} />}
      {respingo > 0 && (
        <ellipse cx={470} cy={1326} rx={10 + respingo * 50} ry={3 + respingo * 8} fill="none" stroke="#9FB3C8" strokeOpacity={0.6 * (1 - respingo)} strokeWidth={3} />
      )}
    </svg>
  </AbsoluteFill>
);

/** Feixe de lanterna: cone do ponto (x0,y0) mirando (x1,y1). */
export const FeixeLanterna: React.FC<{ x0: number; y0: number; x1: number; y1: number; abertura?: number; forca?: number }> = ({
  x0, y0, x1, y1, abertura = 0.22, forca = 1,
}) => {
  const dx = x1 - x0, dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const w = L * abertura;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="feixe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF6E0" stopOpacity={0.55 * forca} />
          <stop offset="1" stopColor="#FFF6E0" stopOpacity={0.05 * forca} />
        </linearGradient>
        <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6E0" stopOpacity={0.5 * forca} />
          <stop offset="1" stopColor="#FFF6E0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${x0} ${y0}) rotate(${ang})`}>
        <path d={`M 0 -6 L ${L} ${-w} L ${L} ${w} L 0 6 Z`} fill="url(#feixe)" />
        <ellipse cx={L} cy={0} rx={w * 0.5} ry={w * 1.1} fill="url(#spot)" />
      </g>
    </svg>
  );
};
