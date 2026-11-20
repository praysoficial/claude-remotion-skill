import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PAGES } from "../captions";
import { theme } from "../theme";

// Legendas estilo vídeo curto: 1–3 palavras, grandes, palavra ativa em destaque.
// `hideBetween` esconde as legendas em trechos onde a tipografia da cena já diz a frase.
export const Captions: React.FC<{ top?: number; hide?: [number, number][] }> = ({ top = 1330, hide = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hide.some(([a, b]) => t >= a && t < b)) return null;

  let idx = -1;
  for (let i = 0; i < PAGES.length; i++) if (t >= PAGES[i][0].s - 0.06) idx = i;
  if (idx < 0) return null;
  const page = PAGES[idx];
  const last = page[page.length - 1];
  const next = PAGES[idx + 1];
  const endT = next ? Math.min(next[0].s - 0.06, last.e + 0.6) : last.e + 0.8;
  if (t > endT) return null;

  const startF = (page[0].s - 0.06) * fps;
  const p = spring({ frame: frame - startF, fps, config: { damping: 13, stiffness: 220, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 26,
          transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
          opacity: Math.min(1, p * 1.5),
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 78,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          textTransform: "uppercase",
        }}
      >
        {page.map((w, i) => {
          const active = t >= w.s - 0.04 && t < (page[i + 1] ? page[i + 1].s - 0.04 : endT);
          const spoken = t >= w.s - 0.04;
          const wp = spring({ frame: frame - (w.s - 0.04) * fps, fps, config: theme.spring.snappy });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? theme.colors.primary : theme.colors.text,
                opacity: spoken ? 1 : 0.35,
                transform: `translateY(${active ? interpolate(wp, [0, 1], [-14, -4]) : 0}px)`,
                textShadow: active
                  ? `0 0 40px ${theme.colors.glow}, 0 6px 0 rgba(0,0,0,0.55)`
                  : "0 6px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.6)",
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
