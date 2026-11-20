import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "../captions";
import { theme } from "../theme";

// Legendas sincronizadas palavra a palavra (timestamps da transcrição do áudio)
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let idx = -1;
  for (let i = 0; i < PAGES.length; i++) {
    if (t >= PAGES[i][0].s - 0.08) idx = i;
  }
  if (idx < 0) return null;
  const page = PAGES[idx];
  const last = page[page.length - 1];
  const next = PAGES[idx + 1];
  const endT = next ? Math.min(next[0].s - 0.08, last.e + 0.9) : last.e + 1.2;
  if (t > endT) return null;

  const startF = (page[0].s - 0.08) * fps;
  const p = spring({ frame: frame - startF, fps, config: theme.spring.snappy });
  const outP = interpolate(t, [endT - 0.12, endT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 58,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          padding: "14px 30px 16px",
          borderRadius: 18,
          background: "rgba(8,7,12,0.62)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          opacity: Math.min(1, p) * outP,
          transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
          fontFamily: theme.fonts.body,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: "-0.015em",
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        {page.map((w, i) => {
          const active = t >= w.s - 0.04 && t < Math.max(w.e, (page[i + 1]?.s ?? w.e) ) - 0.02;
          const spoken = t >= w.s - 0.04;
          const wp = spring({ frame: frame - (w.s - 0.04) * fps, fps, config: theme.spring.snappy });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? theme.colors.primary : theme.colors.text,
                opacity: spoken ? 1 : 0.38,
                transform: `translateY(${active ? -2 * Math.min(1, wp) : 0}px) scale(${active ? interpolate(wp, [0, 1], [1, 1.07]) : 1})`,
                textShadow: active ? `0 0 28px ${theme.colors.glow}` : "none",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};
