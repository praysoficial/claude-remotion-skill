// Teste.tsx — 5s: o boneco acena pra câmera e depois cruza os braços.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Boneco } from "../personagem/Boneco";
import { envelope, poseNoTempo, POSES, somaPose } from "../personagem/pose";
import { QuartoNoite, useCintilacao } from "../cenarios/QuartoNoite";
import { GradeNoite, Grao, Vinheta } from "../componentes/Camadas";

export const TESTE_S = 5;

// roteiro em segundos — todos os frames derivam do fps
const T = {
  levanta: 0.3, // começa a erguer o braço
  acenoIni: 0.75, // mão começa a balançar
  acenoFim: 2.45,
  cruza: 2.55, // começa a cruzar os braços
  acenoHz: 2.3, // balanços por segundo
};

const BONECO = { x: 860, chao: 935, escala: 1.28 };

export const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const brilho = useCintilacao();

  // pose base por chaves
  const base = poseNoTempo(frame, fps, [
    { em: 0, pose: POSES.neutro },
    { em: T.levanta, pose: POSES.aceno, dur: 0.6, curva: "mola" },
    { em: T.cruza, pose: POSES.bracosCruzados, dur: 0.75, curva: "mola" },
  ]);

  // camadas aditivas: aceno, respiração, balanço da cabeça
  const aceno = envelope(frame, fps, T.acenoIni, T.acenoFim, 0.2);
  const onda = Math.sin((t - T.acenoIni) * Math.PI * 2 * T.acenoHz);
  const resp = Math.sin(t * Math.PI * 2 * 0.35);
  const pose = somaPose(base, {
    tronco: resp * 0.5 + onda * aceno * 0.6,
    cabeca: Math.sin(t * 1.7) * 1.2 + onda * aceno * 2.5,
    bracoEsq: { cotovelo: onda * aceno * 20, ombro: onda * aceno * 4 + resp * 1.2 },
    bracoDir: { ombro: resp * 1.2 },
  });
  const proporcoes = { tronco: 150 * (1 + resp * 0.008) };

  // câmera: push-in lento e contínuo
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.cores.chaoFundo }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "860px 620px" }}>
        {/* camada 1–2: cenário */}
        <QuartoNoite />

        {/* sombra projetada na parede (luz vem do monitor, à direita) */}
        <Boneco
          {...BONECO}
          pose={pose}
          proporcoes={proporcoes}
          cor={theme.cores.bonecoSombra}
          style={{
            opacity: 0.6 * brilho,
            filter: "blur(9px)",
            transform: "translate(-120px, -70px) scale(1.08, 1.04)",
          }}
        />
        {/* sombra de contato no chão */}
        <div
          style={{
            position: "absolute",
            left: BONECO.x - 150,
            top: BONECO.chao - 16,
            width: 250,
            height: 32,
            borderRadius: "50%",
            background: theme.cores.bonecoSombra,
            opacity: 0.7,
            filter: "blur(10px)",
          }}
        />

        {/* camada 3: o personagem */}
        <Boneco
          {...BONECO}
          pose={pose}
          proporcoes={proporcoes}
          luz={{ lado: 1, cor: theme.cores.luzMonitor, forca: 0.85 * brilho }}
          style={{ filter: `drop-shadow(0 0 22px ${theme.cores.luzMonitor}33)` }}
        />
      </AbsoluteFill>

      {/* camadas 4–5 */}
      <GradeNoite />
      <Grao />
      <Vinheta />
    </AbsoluteFill>
  );
};
