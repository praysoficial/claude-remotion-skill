import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const Fonts: React.FC = () => (
  <style>{`
    @font-face{font-family:Bricolage;font-weight:500;src:url(${staticFile("fonts/bricolage-grotesque-latin-500-normal.woff2")}) format("woff2");}
    @font-face{font-family:Bricolage;font-weight:700;src:url(${staticFile("fonts/bricolage-grotesque-latin-700-normal.woff2")}) format("woff2");}
    @font-face{font-family:Bricolage;font-weight:800;src:url(${staticFile("fonts/bricolage-grotesque-latin-800-normal.woff2")}) format("woff2");}
    @font-face{font-family:Inter;font-weight:400;src:url(${staticFile("fonts/inter-latin-400-normal.woff2")}) format("woff2");}
    @font-face{font-family:Inter;font-weight:500;src:url(${staticFile("fonts/inter-latin-500-normal.woff2")}) format("woff2");}
    @font-face{font-family:Inter;font-weight:600;src:url(${staticFile("fonts/inter-latin-600-normal.woff2")}) format("woff2");}
    @font-face{font-family:Inter;font-weight:700;src:url(${staticFile("fonts/inter-latin-700-normal.woff2")}) format("woff2");}
    @font-face{font-family:Inter;font-weight:800;src:url(${staticFile("fonts/inter-latin-800-normal.woff2")}) format("woff2");}
  `}</style>
);

// Camada 1 — mesh de fundo animado. `warm` 0..1 controla quanto ouro entra na luz.
export const BgMesh: React.FC<{ warm?: number; red?: number; dim?: number }> = ({
  warm = 0.5,
  red = 0.25,
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 70) * 60;
  const d2 = Math.cos(frame / 90) * 50;
  const a = (v: number) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          top: -700,
          left: -300 + d1,
          filter: "blur(80px)",
          background: `radial-gradient(circle, ${theme.colors.primary}${a(warm * 0.22)}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          bottom: -700,
          right: -350 - d2,
          filter: "blur(90px)",
          background: `radial-gradient(circle, ${theme.colors.accent}${a(red * 0.22)}, transparent 65%)`,
        }}
      />
      {/* grade sutil de perspectiva para profundidade */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${(frame * 0.3) % 80}px ${(frame * 0.2) % 80}px`,
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />}
    </AbsoluteFill>
  );
};

// Camada 4 — color grade
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{ backgroundColor: "#FFB000", mixBlendMode: "soft-light", opacity: 0.1 }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 22%, transparent 70%, rgba(0,0,0,0.45))",
      }}
    />
  </AbsoluteFill>
);

// Camada 5a — grão procedural
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Camada 5b — vinheta
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);
