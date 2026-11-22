// Camadas.tsx — acabamento por cima de qualquer cena: grade, grão, vinheta.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Camada 4 — grade noturna: empurra sombras pro azul e escurece as bordas verticais
export const GradeNoite: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{ backgroundColor: theme.cores.luzMonitor, mixBlendMode: "soft-light", opacity: 0.12 }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 30%, transparent 70%, rgba(0,0,0,0.35))",
      }}
    />
  </AbsoluteFill>
);

// Camada 5a — grão procedural que se move a cada frame
export const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  const ruido = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: ruido,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Camada 5b — vinheta, sempre no topo
export const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at 55% 50%, transparent 48%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);
