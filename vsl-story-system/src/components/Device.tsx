import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ip } from "./Motion";

// Capturas originais: 1080 × 2388 px
export const SHOT_W = 1080;
export const SHOT_H = 2388;

export type Rect = { x: number; y: number; w: number; h: number };

// Regiões (em px da captura original) — medidas nas imagens enviadas
export const TT = {
  src: "img/tiktok.png",
  avatar: { x: 790, y: 318, w: 270, h: 270 },
  name: { x: 36, y: 290, w: 700, h: 100 },
  following: { x: 36, y: 453, w: 160, h: 90 },
  followers: { x: 234, y: 453, w: 180, h: 90 },
  likes: { x: 466, y: 453, w: 180, h: 90 },
  stats: { x: 36, y: 450, w: 620, h: 95 },
  bio: { x: 36, y: 620, w: 740, h: 200 },
  header: { x: 0, y: 270, w: 1080, h: 560 },
  grid: { x: 0, y: 1267, w: 1080, h: 869 },
  tiles: [
    { x: 0, y: 1267, w: 358, h: 478 },
    { x: 361, y: 1267, w: 358, h: 478 },
    { x: 722, y: 1267, w: 358, h: 478 },
  ],
};

export const IG = {
  src: "img/instagram.png",
  avatar: { x: 38, y: 360, w: 182, h: 182 },
  name: { x: 250, y: 345, w: 500, h: 70 },
  posts: { x: 250, y: 418, w: 110, h: 86 },
  followers: { x: 470, y: 418, w: 200, h: 86 },
  stats: { x: 250, y: 418, w: 720, h: 86 },
  bio: { x: 30, y: 548, w: 740, h: 182 },
  painel: { x: 26, y: 829, w: 1028, h: 118 },
  header: { x: 0, y: 320, w: 1080, h: 420 },
  grid: { x: 0, y: 1143, w: 1080, h: 957 },
  // ordem cronológica provável: [0] = primeiro post (264 mil) … [4] = mais recente
  tiles: [
    { x: 362, y: 1623, w: 358, h: 477 }, // 264 mil
    { x: 0, y: 1623, w: 358, h: 477 }, // 44,6 mil
    { x: 724, y: 1143, w: 356, h: 477 }, // 20,3 mil
    { x: 362, y: 1143, w: 358, h: 477 }, // (contagem encoberta)
    { x: 0, y: 1143, w: 358, h: 477 }, // 6.547
  ],
};

// Geometria do celular no "mundo" (1920×1080)
export const phoneGeom = (left: number, top: number, screenH: number) => {
  const s = screenH / SHOT_H;
  const bezel = Math.round(screenH * 0.016);
  const screenW = SHOT_W * s;
  return {
    s,
    bezel,
    screenW,
    w: screenW + bezel * 2,
    h: screenH + bezel * 2,
    // ponto da captura → coordenada no mundo
    pt: (ix: number, iy: number) => ({ x: left + bezel + ix * s, y: top + bezel + iy * s }),
    center: (r: Rect) => ({ x: left + bezel + (r.x + r.w / 2) * s, y: top + bezel + (r.y + r.h / 2) * s }),
  };
};

export const Phone: React.FC<{
  src: string;
  left: number;
  top: number;
  screenH: number;
  rotY?: number;
  rotX?: number;
  rotZ?: number;
  opacity?: number;
  dimScreen?: number;
  children?: React.ReactNode; // overlay em coordenadas da captura
}> = ({ src, left, top, screenH, rotY = 0, rotX = 0, rotZ = 0, opacity = 1, dimScreen = 0, children }) => {
  const g = phoneGeom(left, top, screenH);
  const radius = screenH * 0.055;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: g.w,
        height: g.h,
        opacity,
        transform: `perspective(2400px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
        transformOrigin: "50% 50%",
        borderRadius: radius + g.bezel,
        padding: g.bezel,
        background: "linear-gradient(145deg, #2a2830, #0d0c11 40%, #1b1a20)",
        boxShadow:
          "0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: g.screenW,
          height: screenH,
          borderRadius: radius,
          overflow: "hidden",
          background: "#000",
        }}
      >
        <Img src={staticFile(src)} style={{ width: g.screenW, height: screenH, display: "block" }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SHOT_W,
            height: SHOT_H,
            transform: `scale(${g.s})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
        {dimScreen > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dimScreen})` }} />}
        {/* reflexo de vidro */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

// Escurece a tela inteira exceto um recorte (spotlight) — em coordenadas da captura
export const Spotlight: React.FC<{ r: Rect; amount: number; pad?: number }> = ({ r, amount, pad = 14 }) => (
  <div
    style={{
      position: "absolute",
      left: r.x - pad,
      top: r.y - pad,
      width: r.w + pad * 2,
      height: r.h + pad * 2,
      borderRadius: 26,
      boxShadow: `0 0 0 4000px rgba(5,4,8,${0.72 * amount})`,
    }}
  />
);

// Câmera: keyframes {f, x, y, z} — centraliza (x,y) do mundo com zoom z
export type CamKey = { f: number; x: number; y: number; z: number; r?: number };
export const Camera: React.FC<{ keys: CamKey[]; drift?: number; children: React.ReactNode }> = ({
  keys,
  drift = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  let k0 = keys[0];
  let k1 = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (frame >= keys[i].f) {
      k0 = keys[i];
      k1 = keys[Math.min(i + 1, keys.length - 1)];
    }
  }
  const p = k1.f === k0.f ? 1 : ip(frame, [k0.f, k1.f], [0, 1], theme.ease.inOut);
  // move só depois que o keyframe seguinte "começa" a puxar: segmentos definidos por pares
  const lerp = (a: number, b: number) => a + (b - a) * p;
  const z = lerp(k0.z, k1.z);
  const x = lerp(k0.x, k1.x) + Math.sin(frame / 47) * 6 * drift;
  const y = lerp(k0.y, k1.y) + Math.cos(frame / 59) * 4 * drift;
  const r = lerp(k0.r ?? 0, k1.r ?? 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${960 - x * z}px, ${540 - y * z}px) scale(${z}) rotate(${r}deg)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Recorte de uma região da captura, renderizado como um card
export const Crop: React.FC<{
  src: string;
  r: Rect;
  width: number;
  radius?: number;
  style?: React.CSSProperties;
  kb?: number; // Ken Burns: progresso 0..1
  children?: React.ReactNode;
}> = ({ src, r, width, radius = 22, style, kb = 0, children }) => {
  const sc = width / r.w;
  const height = r.h * sc;
  const zoom = 1 + kb * 0.06;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: "0 40px 80px -25px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.10)",
        background: "#000",
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: SHOT_W * sc,
          height: SHOT_H * sc,
          left: -r.x * sc,
          top: -r.y * sc,
          transform: `scale(${zoom})`,
          transformOrigin: `${(r.x + r.w / 2) * sc}px ${(r.y + r.h / 2) * sc}px`,
          maxWidth: "none",
        }}
      />
      {children}
    </div>
  );
};

// Toque na interface (ripple) em coordenadas da captura
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1], theme.ease.out);
  if (frame < at || frame > at + 18) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 70,
        top: y - 70,
        width: 140,
        height: 140,
        borderRadius: "50%",
        border: `6px solid ${theme.colors.text}`,
        opacity: interpolate(p, [0, 1], [0.9, 0]),
        transform: `scale(${interpolate(p, [0, 1], [0.3, 1.4])})`,
      }}
    />
  );
};
