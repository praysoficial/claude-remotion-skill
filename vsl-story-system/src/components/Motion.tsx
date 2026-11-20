import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { HAS_LOGO, LOGO_ASPECT, LOGO_FILE } from "../brand";

type EaseFn = (t: number) => number;

// interpolate sempre com easing + clamp
export const ip = (
  f: number,
  input: [number, number],
  output: [number, number],
  easing: EaseFn = theme.ease.out,
) =>
  interpolate(f, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Converte segundos absolutos da narração em frames locais da cena
export const useScene = (startSec: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (absSec: number) => (absSec - startSec) * fps;
  return { frame, fps, at };
};

export const useSpring = (delay: number, cfg: keyof typeof theme.spring = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[cfg] });
};

// Saída rápida (10 frames) a partir de `outAt`
export const useExit = (outAt?: number, len = 10) => {
  const frame = useCurrentFrame();
  if (outAt === undefined) return 1;
  return 1 - ip(frame, [outAt, outAt + len], [0, 1], theme.ease.in);
};

// Entrada premium: opacidade + subida + escala + desfoque, e saída mais rápida
export const In: React.FC<{
  delay?: number;
  outAt?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  cfg?: keyof typeof theme.spring;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, outAt, y = 40, x = 0, scale = 0.94, blur = 8, cfg = "smooth", style, children }) => {
  const p = useSpring(delay, cfg);
  const e = useExit(outAt);
  const frame = useCurrentFrame();
  const exitY = outAt !== undefined ? ip(frame, [outAt, outAt + 10], [0, -30], theme.ease.in) : 0;
  return (
    <div
      style={{
        opacity: Math.min(p, 1) * e,
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0]) + exitY}px) scale(${interpolate(p, [0, 1], [scale, 1])})`,
        filter: blur ? `blur(${Math.max(0, (1 - p) * blur + (1 - e) * 6)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Revelação palavra a palavra. `times` = frames locais de cada palavra (sincronia com a voz)
export const Words: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  times?: number[];
  hero?: number[];
  outAt?: number;
  heroColor?: string;
  style?: React.CSSProperties;
  gap?: number;
}> = ({ text, delay = 0, per = 3, times, hero = [], outAt, heroColor = theme.colors.primary, style, gap = 22 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useExit(outAt);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: gap,
        rowGap: 0,
        justifyContent: "center",
        opacity: e,
        ...style,
      }}
    >
      {text.split(" ").map((w, i) => {
        const d = times?.[i] ?? delay + i * per;
        const p = spring({ frame: frame - d, fps, config: theme.spring.snappy });
        const isHero = hero.includes(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, p),
              transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
              filter: `blur(${Math.max(0, (1 - p) * 6)}px)`,
              color: isHero ? heroColor : undefined,
              textShadow: isHero ? `0 0 50px ${theme.colors.glow}` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const display = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
  color: theme.colors.text,
});

export const body = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: theme.fonts.body,
  fontWeight: weight,
  fontSize: size,
  color: theme.colors.textDim,
  letterSpacing: "-0.01em",
});

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = theme.colors.textDim,
}) => (
  <div
    style={{
      ...body(22, 700),
      color,
      textTransform: "uppercase",
      letterSpacing: "0.32em",
      display: "flex",
      alignItems: "center",
      gap: 16,
      justifyContent: "center",
    }}
  >
    <span style={{ width: 36, height: 2, background: color, opacity: 0.6 }} />
    {children}
    <span style={{ width: 36, height: 2, background: color, opacity: 0.6 }} />
  </div>
);

export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; active?: boolean }> = ({
  style,
  children,
  active,
}) => (
  <div
    style={{
      background: active
        ? "linear-gradient(160deg, rgba(255,194,26,0.16), rgba(255,194,26,0.04))"
        : "linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
      border: `1px solid ${active ? "rgba(255,194,26,0.55)" : theme.colors.stroke}`,
      borderRadius: 28,
      boxShadow: active
        ? `0 30px 80px -30px rgba(0,0,0,0.8), 0 0 60px -10px ${theme.colors.glow}`
        : "0 30px 80px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Retângulo desenhado (stroke-dashoffset) — destaque em coordenadas locais
export const DrawRect: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  outAt?: number;
  r?: number;
  stroke?: number;
  color?: string;
}> = ({ x, y, w, h, delay, outAt, r = 24, stroke = 8, color = theme.colors.primary }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [delay, delay + 18], [0, 1], theme.ease.out);
  const e = useExit(outAt, 8);
  const per = 2 * (w + h);
  const pulse = 1 + Math.sin((frame - delay) / 6) * 0.06 * (p >= 1 ? 1 : 0);
  return (
    <svg
      style={{ position: "absolute", left: x - stroke, top: y - stroke, overflow: "visible", opacity: e }}
      width={w + stroke * 2}
      height={h + stroke * 2}
    >
      <rect
        x={stroke}
        y={stroke}
        width={w}
        height={h}
        rx={r}
        fill="rgba(255,194,26,0.07)"
        fillOpacity={p}
        stroke={color}
        strokeWidth={stroke * pulse}
        strokeDasharray={per}
        strokeDashoffset={per * (1 - p)}
        style={{ filter: `drop-shadow(0 0 ${stroke * 2.5}px ${theme.colors.glow})` }}
      />
    </svg>
  );
};

// ---------- Logo ----------
// Usa public/logo.png quando HAS_LOGO=true; senão, wordmark tipográfico neutro.
export const Logo: React.FC<{ height: number; glow?: number }> = ({ height, glow = 0 }) => {
  if (HAS_LOGO) {
    return (
      <Img
        src={staticFile(LOGO_FILE)}
        style={{
          height,
          width: height * LOGO_ASPECT,
          objectFit: "contain",
          filter: glow ? `drop-shadow(0 0 ${40 * glow}px ${theme.colors.glow})` : undefined,
        }}
      />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: height * 0.22,
        fontFamily: theme.fonts.display,
        fontWeight: 800,
        fontSize: height,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: theme.colors.text,
        textShadow: glow ? `0 0 ${60 * glow}px ${theme.colors.glow}` : undefined,
        whiteSpace: "nowrap",
      }}
    >
      <span>Story</span>
      <span style={{ color: theme.colors.primary }}>System</span>
    </div>
  );
};

// ---------- Ícones (SVG em cores do tema, nunca emoji) ----------
type IconName =
  | "clock"
  | "eye"
  | "chat"
  | "branch"
  | "camoff"
  | "trend"
  | "x"
  | "check"
  | "book"
  | "layers"
  | "spark"
  | "users"
  | "arrow"
  | "search"
  | "video"
  | "scissors"
  | "send"
  | "bolt"
  | "hook"
  | "loop"
  | "down"
  | "flag";

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({
  name,
  size = 40,
  color = theme.colors.text,
  stroke = 2.2,
}) => {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    clock: (<><circle cx="12" cy="12" r="9" {...p} /><path d="M12 7v5l3 2" {...p} /></>),
    eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...p} /><circle cx="12" cy="12" r="3" {...p} /></>),
    chat: (<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" {...p} />),
    branch: (<><circle cx="6" cy="5" r="2.2" {...p} /><circle cx="6" cy="19" r="2.2" {...p} /><circle cx="18" cy="9" r="2.2" {...p} /><path d="M6 7.2v9.6M18 11.2c0 4-6 3-12 5.6" {...p} /></>),
    camoff: (<><path d="M3 7h3l2-2h6l2 2h1a2 2 0 0 1 2 2v7M18 18H5a2 2 0 0 1-2-2V9" {...p} /><path d="M3 3l18 18" {...p} /></>),
    trend: (<><path d="M3 17l6-6 4 4 8-8" {...p} /><path d="M15 7h6v6" {...p} /></>),
    x: (<path d="M6 6l12 12M18 6L6 18" {...p} />),
    check: (<path d="M5 12.5l4.5 4.5L19 7.5" {...p} />),
    book: (<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" {...p} /><path d="M4 19V5" {...p} /></>),
    layers: (<><path d="M12 3l9 5-9 5-9-5 9-5z" {...p} /><path d="M3 13l9 5 9-5" {...p} /></>),
    spark: (<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" {...p} />),
    users: (<><circle cx="9" cy="8" r="3.2" {...p} /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" {...p} /><circle cx="17" cy="9" r="2.5" {...p} /><path d="M17 14c2.5 0 4 2 4 5" {...p} /></>),
    arrow: (<path d="M4 12h15M13 6l6 6-6 6" {...p} />),
    search: (<><circle cx="11" cy="11" r="6.5" {...p} /><path d="M20 20l-4.2-4.2" {...p} /></>),
    video: (<><rect x="3" y="6" width="13" height="12" rx="2.5" {...p} /><path d="M16 10l5-3v10l-5-3" {...p} /></>),
    scissors: (<><circle cx="6" cy="6" r="2.6" {...p} /><circle cx="6" cy="18" r="2.6" {...p} /><path d="M8.2 7.6L20 18M8.2 16.4L20 6" {...p} /></>),
    send: (<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" {...p} />),
    bolt: (<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" {...p} />),
    hook: (<><path d="M14 3v10a5 5 0 0 1-10 0v-2" {...p} /><path d="M2 13l2-2 2 2" {...p} /><circle cx="14" cy="3" r="1" {...p} /></>),
    loop: (<><path d="M4 12a8 8 0 0 1 14-5.3L20 9" {...p} /><path d="M20 4v5h-5" {...p} /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" {...p} /><path d="M4 20v-5h5" {...p} /></>),
    down: (<path d="M12 4v15M6 13l6 6 6-6" {...p} />),
    flag: (<><path d="M5 21V4" {...p} /><path d="M5 4h11l-2 4 2 4H5" {...p} /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      {paths[name]}
    </svg>
  );
};
