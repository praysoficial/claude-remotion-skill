// QuartoNoite.tsx — quarto escuro, janela com lua, cama à esquerda,
// escrivaninha com monitor à direita. O monitor é a única luz forte.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const C = theme.cores;

/** Ponto de onde a luz do monitor "sai" — use para posicionar sombras projetadas. */
export const LUZ_MONITOR = { x: 1560, y: 470 };
export const CHAO_Y = 770;

/** Cintilação da tela: lenta + rápida, nunca regular. */
export const useCintilacao = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return 0.93 + 0.035 * Math.sin(t * 2.1) + 0.02 * Math.sin(t * 11.3) + 0.015 * (random(`f${frame}`) - 0.5);
};

const Estrelas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <g>
      {Array.from({ length: 22 }).map((_, i) => {
        const x = 222 + random(`ex${i}`) * 316;
        const y = 162 + random(`ey${i}`) * 300;
        const pisca = 0.45 + 0.4 * Math.sin((frame / fps) * (1.2 + random(`ev${i}`) * 2) + i);
        return <circle key={i} cx={x} cy={y} r={0.8 + random(`er${i}`) * 1.4} fill={C.estrela} opacity={pisca} />;
      })}
    </g>
  );
};

const Tela: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rolagem = (t * 14) % 22; // código rolando devagar
  const cursor = Math.floor(t * 2) % 2 === 0;
  return (
    <g>
      <rect x={1384} y={384} width={312} height={188} rx={4} fill="url(#gTela)" />
      <rect x={1384} y={384} width={312} height={16} fill={C.telaBorda} opacity={0.5} />
      <clipPath id="clipTela">
        <rect x={1384} y={404} width={312} height={168} />
      </clipPath>
      <g clipPath="url(#clipTela)">
        {Array.from({ length: 10 }).map((_, i) => {
          const w = 60 + random(`l${i}`) * 170;
          const ind = (Math.floor(random(`i${i}`) * 3)) * 18;
          return (
            <rect
              key={i}
              x={1400 + ind}
              y={414 + i * 22 - rolagem}
              width={w}
              height={7}
              rx={3.5}
              fill={C.telaBorda}
              opacity={0.55}
            />
          );
        })}
      </g>
      {cursor && <rect x={1400} y={552} width={9} height={12} fill={C.telaBorda} opacity={0.8} />}
    </g>
  );
};

export const QuartoNoite: React.FC = () => {
  const brilho = useCintilacao();
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <defs>
          <linearGradient id="gParede" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.parede} />
            <stop offset="1" stopColor={C.paredeBaixo} />
          </linearGradient>
          <linearGradient id="gChao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.chao} />
            <stop offset="1" stopColor={C.chaoFundo} />
          </linearGradient>
          <linearGradient id="gCeu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.ceuTopo} />
            <stop offset="1" stopColor={C.ceuBaixo} />
          </linearGradient>
          <linearGradient id="gTela" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.tela} />
            <stop offset="1" stopColor={C.luzMonitor} />
          </linearGradient>
          <radialGradient id="gLuzParede" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.luzMonitorForte} stopOpacity={0.55} />
            <stop offset="0.35" stopColor={C.luzMonitor} stopOpacity={0.2} />
            <stop offset="1" stopColor={C.luzMonitor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="gLuzChao" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.luzMonitor} stopOpacity={0.28} />
            <stop offset="1" stopColor={C.luzMonitor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="gLua" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={C.lua} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.lua} stopOpacity={0} />
          </radialGradient>
          <filter id="fDesfoque" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* parede e chão */}
        <rect width={1920} height={CHAO_Y} fill="url(#gParede)" />
        <rect y={CHAO_Y} width={1920} height={1080 - CHAO_Y} fill="url(#gChao)" />
        <rect y={CHAO_Y - 14} width={1920} height={14} fill={C.rodape} />

        {/* janela com cortinas */}
        <rect x={200} y={140} width={360} height={400} rx={6} fill={C.silhueta} />
        <rect x={216} y={156} width={328} height={368} fill="url(#gCeu)" />
        <Estrelas />
        <circle cx={468} cy={236} r={80} fill="url(#gLua)" />
        <circle cx={468} cy={236} r={26} fill={C.lua} opacity={0.9} />
        <circle cx={480} cy={230} r={22} fill={C.ceuTopo} opacity={0.55} />
        <rect x={372} y={156} width={16} height={368} fill={C.silhueta} />
        <rect x={216} y={332} width={328} height={16} fill={C.silhueta} />
        <path d="M150 120 Q195 330 172 560 L240 560 Q232 330 250 120 Z" fill={C.moveis} />
        <path d="M610 120 Q565 330 588 560 L520 560 Q528 330 510 120 Z" fill={C.moveis} />
        <rect x={130} y={112} width={500} height={12} rx={6} fill={C.moveisBorda} />
        {/* luar no chão */}
        <polygon points="250,790 540,790 700,1040 330,1040" fill={C.lua} opacity={0.035} />

        {/* quadro na parede, pegando um pouco da luz do monitor */}
        <rect x={1040} y={200} width={170} height={230} rx={4} fill={C.moveis} stroke={C.moveisBorda} strokeWidth={6} />
        <circle cx={1125} cy={290} r={42} fill={C.moveisBorda} />
        <rect x={1068} y={360} width={114} height={8} rx={4} fill={C.moveisBorda} />
        <rect x={1068} y={378} width={74} height={8} rx={4} fill={C.moveisBorda} />

        {/* brilho do monitor na parede */}
        <ellipse
          cx={LUZ_MONITOR.x}
          cy={LUZ_MONITOR.y}
          rx={820}
          ry={520}
          fill="url(#gLuzParede)"
          opacity={brilho}
          style={{ mixBlendMode: "screen" }}
        />

        {/* cama à esquerda */}
        <rect x={-40} y={560} width={60} height={290} rx={10} fill={C.silhueta} />
        <rect x={-30} y={704} width={600} height={96} rx={26} fill={C.cobertor} />
        <ellipse cx={110} cy={700} rx={92} ry={30} fill={C.moveis} />
        <path d="M200 712 Q380 690 560 716 L570 790 L200 790 Z" fill={C.moveis} opacity={0.8} />
        <rect x={-30} y={792} width={600} height={44} rx={8} fill={C.silhueta} />
        <rect x={540} y={836} width={22} height={44} fill={C.silhueta} />
        {/* borda da cama virada pro monitor pega luz */}
        <rect x={562} y={712} width={6} height={120} rx={3} fill={C.luzMonitor} opacity={0.18 * brilho} />

        {/* escrivaninha */}
        <rect x={1270} y={640} width={600} height={22} rx={4} fill={C.moveis} />
        <rect x={1270} y={640} width={600} height={3} fill={C.luzMonitorForte} opacity={0.35 * brilho} />
        <rect x={1296} y={662} width={22} height={260} fill={C.silhueta} />
        <rect x={1650} y={662} width={196} height={170} rx={4} fill={C.silhueta} />
        <rect x={1824} y={662} width={22} height={260} fill={C.silhueta} />
        <rect x={1730} y={740} width={36} height={6} rx={3} fill={C.moveisBorda} />

        {/* monitor */}
        <rect x={1528} y={590} width={26} height={52} fill={C.silhueta} />
        <ellipse cx={1541} cy={640} rx={70} ry={8} fill={C.silhueta} />
        <rect x={1370} y={370} width={340} height={216} rx={10} fill={C.silhueta} />
        <g opacity={brilho}>
          <Tela />
        </g>
        {/* teclado e caneca */}
        <rect x={1420} y={630} width={220} height={10} rx={3} fill={C.moveisBorda} />
        <rect x={1420} y={630} width={220} height={2} fill={C.luzMonitorForte} opacity={0.5 * brilho} />
        <rect x={1730} y={598} width={38} height={42} rx={6} fill={C.moveis} />
        <rect x={1730} y={598} width={4} height={42} fill={C.luzMonitorForte} opacity={0.4 * brilho} />

        {/* poça de luz no chão */}
        <ellipse cx={1300} cy={900} rx={820} ry={170} fill="url(#gLuzChao)" opacity={brilho} />
      </svg>
    </AbsoluteFill>
  );
};
