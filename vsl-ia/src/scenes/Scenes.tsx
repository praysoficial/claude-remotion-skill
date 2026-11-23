// VSL "Você não vai viralizar com IA" — 9:16, ~65s.
// Linguagem visual da referência: violeta-quase-preto, bloom, franja RGB, cursor que "seleciona" a palavra,
// varredura de luz vertical, objeto + texto em escada, post em feed claro, rack focus.
// Tempos = segundos do áudio já sem silêncios.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { IG, SHOT_H, SHOT_W, Rect } from "../components/Device";
import { body, display, Glass, Icon, In, ip, LogoMark, useScene, Words } from "../components/Motion";

const C = theme.colors;
const W = 1080;

// franja RGB (aberração cromática) para títulos
export const rgb = (k = 1): string =>
  `${-3 * k}px 0 rgba(255,16,34,0.55), ${3 * k}px 0 rgba(0,229,238,0.55), 0 0 ${40 * k}px rgba(140,60,255,0.35)`;

const crop = (r: Rect, width: number, src = IG.src, z = 1, style?: React.CSSProperties) => {
  const sc = width / r.w;
  return (
    <div style={{ position: "relative", width, height: r.h * sc, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: SHOT_W * sc, height: SHOT_H * sc, left: -r.x * sc, top: -r.y * sc, maxWidth: "none" }} />
      </div>
    </div>
  );
};

// Palavra "selecionada" pelo cursor (motivo da referência): bloco cresce da esquerda, cursor acompanha
const Selected: React.FC<{ text: string; at: number; size: number; color?: string; block?: string; textOn?: string }> = ({ text, at, size, color = C.text, block = C.primary, textOn = C.onPrimary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - (at - 8), fps, config: theme.spring.snappy });
  const sel = ip(frame, [at, at + 9], [0, 1], theme.ease.out);
  const cur = ip(frame, [at - 10, at + 9], [0, 1], theme.ease.inOut);
  const curOut = ip(frame, [at + 16, at + 24], [1, 0]);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 18px", opacity: Math.min(1, appear), transform: `translateY(${interpolate(appear, [0, 1], [30, 0])}px)`, filter: `blur(${(1 - Math.min(1, appear)) * 10}px)` }}>
      <span style={{ position: "absolute", left: 0, top: "8%", bottom: "4%", width: `${sel * 100}%`, background: block, borderTop: `${size * 0.06}px solid #3A2BFF`, boxShadow: `0 0 50px ${block}88` }} />
      <span style={{ position: "relative", ...display(size), color: sel > 0.5 ? textOn : color, textShadow: sel > 0.5 ? "none" : rgb() }}>{text}</span>
      <svg width={size * 0.42} height={size * 0.6} viewBox="0 0 14 20" style={{ position: "absolute", left: `${interpolate(cur, [0, 1], [-5, 96])}%`, top: "52%", opacity: Math.min(1, cur * 3) * curOut, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.6))" }}>
        <path d="M1 1 L1 16 L5 12.5 L8 19 L10.5 18 L7.6 11.6 L13 11.6 Z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

// Objetos de vidro 3D flutuando desfocados (substituem os cérebros da referência)
const GlassIcon: React.FC<{ icon: React.ComponentProps<typeof Icon>["name"]; x: number; y: number; size: number; delay: number; blur?: number }> = ({ icon, x, y, size, delay, blur = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((frame + delay * 3) / 22) * 16,
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: "linear-gradient(145deg, rgba(160,90,255,0.45), rgba(60,20,120,0.25))",
        border: "1.5px solid rgba(220,190,255,0.35)",
        boxShadow: "inset 0 2px 12px rgba(255,255,255,0.25), 0 20px 50px -10px rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, p) * 0.9,
        transform: `scale(${p}) rotate(${Math.sin((frame + delay) / 30) * 10}deg)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <Icon name={icon} size={size * 0.5} color="#F2E8FF" stroke={1.8} />
    </div>
  );
};

// ============ S1 · 0 – 2.3s · "Você não vai viralizar com IA." ============
export const S1: React.FC = () => {
  const { frame, at } = useScene(0);
  const glitch = ip(frame, [at(1.9), at(2.05)], [0, 1]) * (1 - ip(frame, [at(2.1), at(2.3)], [0, 1]));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, paddingBottom: 200, transform: `translateX(${Math.sin(frame * 3) * glitch * 14}px)` }}>
      <Words text="Você não vai" times={[at(0.0), at(0.3), at(0.68)]} style={{ ...display(92, 700), textShadow: rgb(0.8) }} gap={24} />
      <div style={{ marginTop: 10 }}>
        <Selected text="VIRALIZAR" at={at(1.08)} size={148} />
      </div>
      <In delay={at(1.62)} cfg="bouncy" scale={0.6} y={40}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <span style={{ ...display(110, 700), fontStyle: "italic", textShadow: rgb() }}>com</span>
          <span style={{ ...display(190), color: C.accent, fontStyle: "italic", textShadow: `0 0 60px rgba(${C.accentRgb},0.6), ${rgb(1.4)}` }}>IA.</span>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ============ S2 · 2.3 – 8.95s · "não do jeito que todo mundo tá tentando…" ============
export const S2: React.FC = () => {
  const S = 2.3;
  const { frame, fps, at } = useScene(S);
  const shuffle = ip(frame, [at(6.4), at(7.2)], [0, 1], theme.ease.inOut);
  const cards = Array.from({ length: 9 }).map((_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const gx = 120 + col * 290;
    const gy = 640 + row * 260;
    const rx = [80, 600, 330, 720, 150, 480, 40, 640, 360][i];
    const ry = [560, 700, 900, 520, 1020, 610, 820, 980, 740][i];
    const rr = [-14, 9, -6, 16, 7, -18, 12, -8, 20][i];
    return { i, x: interpolate(shuffle, [0, 1], [gx, rx]), y: interpolate(shuffle, [0, 1], [gy, ry]), r: shuffle * rr };
  });
  const hues = ["#5B2BFF", "#B620E0", "#1F7BFF", "#FF3D7F", "#7A2BFF", "#00B3C7", "#E04CFF", "#3A2BFF", "#FF6A3D"];
  const fingers = spring({ frame: frame - at(7.5), fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200 }}>
        <Words text="Do jeito que todo mundo tá tentando:" times={[at(3.28), at(3.44), at(3.64), at(3.82), at(4.02), at(4.32), at(4.5)]} style={{ ...display(64, 700), color: C.textDim, maxWidth: 900 }} gap={16} />
      </div>
      {cards.map((c) => {
        const p = spring({ frame: frame - at(2.5) - c.i * 3, fps, config: theme.spring.smooth });
        return (
          <div
            key={c.i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y + Math.sin((frame + c.i * 13) / 20) * 6,
              width: 250,
              height: 230,
              borderRadius: 22,
              overflow: "hidden",
              opacity: Math.min(1, p) * (1 - ip(frame, [at(8.5), at(8.9)], [0, 0.6])),
              transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) rotate(${c.r}deg)`,
              background: `radial-gradient(circle at 30% 30%, ${hues[c.i]}, #120022 75%)`,
              border: "1.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="30" height="30" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
              </div>
            </div>
            <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", alignItems: "center", gap: 8, ...body(20, 700), color: "#fff" }}>
              <Icon name="spark" size={22} color="#fff" /> gerado com IA
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 22 }}>
        {[
          { t: "bonito", d: at(5.56) },
          { t: "aleatório", d: at(6.54) },
        ].map((w, i) => (
          <In key={i} delay={w.d} cfg="bouncy" scale={0.6} y={30}>
            <div style={{ ...display(76), fontStyle: "italic", color: i === 1 ? C.accent : C.text, textShadow: rgb() }}>{w.t}{i === 0 ? "," : ""}</div>
          </In>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, display: "flex", justifyContent: "center", opacity: Math.min(1, fingers) }}>
        <div style={{ transform: `scale(${fingers}) rotate(${Math.sin(frame / 4) * 6}deg)`, display: "flex", alignItems: "center", gap: 20, padding: "16px 30px", borderRadius: 999, background: "rgba(8,7,12,0.85)", border: `1.5px solid ${C.stroke}` }}>
          <svg width="44" height="44" viewBox="0 0 34 34" style={{ transform: `rotate(${frame * 12}deg)` }}>
            <circle cx="17" cy="17" r="13" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
            <path d="M17 4 a13 13 0 0 1 13 13" fill="none" stroke={C.text} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span style={{ ...body(38, 800), color: C.text, textTransform: "uppercase" }}>torcendo pra dar certo</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ S3 · 8.95 – 12.25s · "Eu fiz diferente. Não criei vídeos. Criei uma história." ============
export const S3: React.FC = () => {
  const S = 8.95;
  const { frame, at } = useScene(S);
  const strike = ip(frame, [at(10.5), at(10.85)], [0, 1]);
  const phase = at(11.05);
  const p1 = 1 - ip(frame, [phase - 4, phase + 4], [0, 1]);
  return (
    <AbsoluteFill>
      <GlassIcon icon="book" x={90} y={330} size={150} delay={at(11.4)} blur={3} />
      <GlassIcon icon="chat" x={820} y={520} size={130} delay={at(11.5)} />
      <GlassIcon icon="hook" x={110} y={1080} size={120} delay={at(11.6)} blur={4} />
      <GlassIcon icon="users" x={790} y={1180} size={160} delay={at(11.7)} blur={1} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 160 }}>
        <Words text="Eu fiz diferente." times={[at(9.02), at(9.14), at(9.28)]} hero={[2]} style={{ ...display(96), textShadow: rgb(0.8), opacity: p1 }} gap={24} />
        <div style={{ height: 40 }} />
        <div style={{ position: "relative", opacity: p1 }}>
          <Words text="Eu não criei vídeos." times={[at(10.06), at(10.1), at(10.18), at(10.5)]} style={{ ...display(70, 700), color: C.textDim }} gap={18} />
          <div style={{ position: "absolute", left: "52%", right: -10, top: "52%", height: 10, borderRadius: 5, background: C.accent, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
        </div>
      </AbsoluteFill>
      {frame > phase - 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10, paddingBottom: 160 }}>
          <Words text="Eu criei" times={[at(11.12), at(11.2)]} style={{ ...display(80, 700), color: C.textDim }} gap={20} />
          <Words text="uma história." times={[at(11.5), at(11.62)]} hero={[0, 1]} style={{ ...display(170), fontStyle: "italic", lineHeight: 0.95, textShadow: `0 0 70px ${C.glow}` }} gap={30} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ S4 · 12.25 – 18.8s · a história ============
const Watch: React.FC<{ size: number; spin: number }> = ({ size, spin }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ filter: `drop-shadow(-3px 0 0 rgba(255,16,34,0.5)) drop-shadow(3px 0 0 rgba(0,229,238,0.5)) drop-shadow(0 0 30px rgba(140,60,255,0.5))` }}>
    <circle cx="50" cy="10" r="7" fill="none" stroke="#CFC8DA" strokeWidth="3" />
    <rect x="45" y="15" width="10" height="9" rx="2" fill="#B9B2C6" />
    <circle cx="50" cy="70" r="44" fill="#2A2533" stroke="#D8D2E2" strokeWidth="4" />
    <circle cx="50" cy="70" r="38" fill="#EEE9F3" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={50 + Math.sin(a) * 31} y1={70 - Math.cos(a) * 31} x2={50 + Math.sin(a) * 36} y2={70 - Math.cos(a) * 36} stroke="#2A2533" strokeWidth={i % 3 === 0 ? 3 : 1.5} />;
    })}
    <line x1="50" y1="70" x2={50 + Math.sin(spin * 0.08) * 20} y2={70 - Math.cos(spin * 0.08) * 20} stroke="#2A2533" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="70" x2={50 + Math.sin(spin) * 30} y2={70 - Math.cos(spin) * 30} stroke="#FF1022" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="70" r="4" fill="#2A2533" />
  </svg>
);

const Store: React.FC<{ w: number; color: string; label: string; glow?: string; icon: React.ComponentProps<typeof Icon>["name"] }> = ({ w, color, label, glow, icon }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", filter: glow ? `drop-shadow(0 0 40px ${glow})` : undefined }}>
    <div style={{ width: w, height: w * 0.2, background: `repeating-linear-gradient(90deg, ${color} 0 ${w / 8}px, #F4F0FA ${w / 8}px ${w / 4}px)`, borderRadius: "16px 16px 6px 6px" }} />
    <div style={{ width: w * 0.92, height: w * 0.9, background: "linear-gradient(180deg, #2B2238, #16111E)", border: `3px solid ${color}`, borderTop: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 18 }}>
      <div style={{ ...body(w * 0.1, 800), color: "#fff", letterSpacing: "0.08em", textAlign: "center" }}>{label}</div>
      <Icon name={icon} size={w * 0.32} color={color} stroke={2} />
      <div style={{ width: w * 0.3, height: w * 0.32, background: "rgba(255,255,255,0.08)", border: `2px solid ${color}`, borderBottom: "none", borderRadius: "10px 10px 0 0" }} />
    </div>
  </div>
);

export const S4: React.FC = () => {
  const S = 12.25;
  const { frame, fps, at } = useScene(S);
  const b2 = at(15.05);
  const b3 = at(16.88);
  const o1 = ip(frame, [b2 - 6, b2 + 2], [0, 1], theme.ease.in);
  const o2 = ip(frame, [b3 - 4, b3 + 4], [0, 1], theme.ease.in);
  const street = ip(frame, [b2, b2 + 14], [0, 1], theme.ease.out);
  const sec = spring({ frame: frame - b3, fps, config: theme.spring.smooth });
  const pulse = 1 + Math.max(0, Math.sin((frame - b3) / 4)) * 0.04;
  return (
    <AbsoluteFill>
      {/* 1 — relógio + "30 dias pra salvar o salão da mãe" (composição objeto + texto em escada da referência) */}
      {frame < b2 + 4 && (
        <AbsoluteFill style={{ opacity: 1 - o1, transform: `scale(${1 + o1 * 0.2})`, filter: o1 > 0 ? `blur(${o1 * 16}px)` : undefined }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 210 }}>
            <Words text="Um garoto com" times={[at(12.28), at(12.36), at(12.68)]} style={{ ...display(64, 700), color: C.textDim }} gap={16} />
          </div>
          <div style={{ position: "absolute", left: 60, top: 420 }}>
            <In delay={at(12.5)} x={-80} y={0} cfg="smooth">
              <Watch size={380} spin={frame / 4} />
            </In>
          </div>
          <div style={{ position: "absolute", left: 470, top: 470, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <In delay={at(12.86)} cfg="bouncy" scale={0.6} y={30}>
              <div style={{ padding: "4px 20px", background: C.accent, ...display(140), color: "#fff", boxShadow: `0 0 50px rgba(${C.accentRgb},0.6)` }}>30 DIAS</div>
            </In>
            <Words text="pra salvar" times={[at(13.68), at(13.84)]} style={{ ...display(70, 700), fontStyle: "italic", textShadow: rgb(), justifyContent: "flex-start" }} gap={16} />
            <Words text="o salão da mãe." times={[at(14.1), at(14.28), at(14.52), at(14.64)]} hero={[1]} style={{ ...display(70, 700), fontStyle: "italic", textShadow: rgb(), justifyContent: "flex-start", maxWidth: 560 }} gap={16} />
          </div>
        </AbsoluteFill>
      )}
      {/* 2 — concorrente do outro lado da rua */}
      {frame > b2 - 6 && frame < b3 + 6 && (
        <AbsoluteFill style={{ opacity: 1 - o2 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 220 }}>
            <Words text="Um concorrente do outro lado da rua" times={[at(15.08), at(15.16), at(15.64), at(15.84), at(16.1), at(16.3), at(16.46)]} hero={[1]} heroColor={C.accent} style={{ ...display(76), maxWidth: 940, textShadow: rgb(0.8) }} gap={18} />
          </div>
          <div style={{ position: "absolute", left: 70, top: 700 }}>
            <In delay={b2 + 2} x={-120} y={0}>
              <Store w={330} color="#E6E0F0" label="SALÃO" icon="scissors" />
            </In>
          </div>
          <div style={{ position: "absolute", left: 530, top: 620 }}>
            <In delay={at(15.2)} x={160} y={0} cfg="bouncy">
              <Store w={440} color={C.accent} label="NOVO SALÃO" icon="spark" glow={`rgba(${C.accentRgb},0.5)`} />
            </In>
          </div>
          <div style={{ position: "absolute", left: 455, top: 600, width: 8, height: 640 * street, background: "repeating-linear-gradient(180deg, #F4F0FA 0 40px, transparent 40px 70px)", opacity: 0.5 }} />
        </AbsoluteFill>
      )}
      {/* 3 — um segredo que ninguém esperava */}
      {frame > b3 - 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40, paddingBottom: 180 }}>
          <div style={{ opacity: Math.min(1, sec), transform: `scale(${interpolate(sec, [0, 1], [1.4, 1]) * pulse})`, filter: `blur(${(1 - Math.min(1, sec)) * 20}px)` }}>
            <svg width="420" height="460" viewBox="0 0 24 26" style={{ filter: `drop-shadow(-4px 0 0 rgba(255,16,34,0.6)) drop-shadow(4px 0 0 rgba(0,229,238,0.5)) drop-shadow(0 0 50px rgba(140,60,255,0.6))` }}>
              <circle cx="12" cy="8" r="5" fill="#0A0710" stroke="#4B3A66" strokeWidth="0.4" />
              <path d="M2 26c0-6 4.5-10.5 10-10.5S22 20 22 26z" fill="#0A0710" stroke="#4B3A66" strokeWidth="0.4" />
              <text x="12" y="10.6" textAnchor="middle" fontSize="7" fontWeight="800" fill={C.accent} fontFamily="Bricolage">?</text>
            </svg>
          </div>
          <Words text="Um segredo que ninguém esperava." times={[at(16.92), at(17.02), at(17.52), at(17.64), at(18.02)]} hero={[1]} heroColor={C.accent} style={{ ...display(80), maxWidth: 900, textShadow: rgb() }} gap={20} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ S5 · 18.8 – 25.85s · o primeiro episódio vira post (recuo para o feed claro) ============
export const S5: React.FC = () => {
  const S = 18.8;
  const { frame, fps, at } = useScene(S);
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  const pull = ip(frame, [at(19.6), at(20.4)], [0, 1], theme.ease.inOut);
  const tile = IG.tiles[0];
  const tiltY = interpolate(pull, [0, 1], [0, -10]) + Math.sin(frame / 40) * 2;
  const choose = ip(frame, [at(23.06), at(23.6)], [0, 1], theme.ease.out);
  const loop = spring({ frame: frame - at(24.1), fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      {/* feed claro com scanlines (referência) */}
      <AbsoluteFill style={{ opacity: pull, background: "radial-gradient(ellipse at center, #E4E1E8 30%, #A9A6AE 100%)" }}>
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 5px)" }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: interpolate(pull, [0, 1], [180, 170]),
          width: 900,
          transform: `perspective(2200px) rotateY(${tiltY}deg) rotateX(${interpolate(pull, [0, 1], [0, 4])}deg) scale(${interpolate(pull, [0, 1], [1.12, 0.92]) * interpolate(enter, [0, 1], [0.9, 1])})`,
          transformOrigin: "50% 40%",
          opacity: Math.min(1, enter * 1.5),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 18px", opacity: pull }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: "linear-gradient(135deg, #FF1022, #00E5EE)" }} />
            <span style={{ ...body(32, 800), color: "#111" }}>episódio 1</span>
          </div>
          <span style={{ ...body(40, 800), color: "#111" }}>···</span>
        </div>
        <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}>{crop({ ...tile, h: tile.h - 55 }, 900, IG.src, 1 + (1 - pull) * 0.06)}</div>
        <div style={{ display: "flex", gap: 34, alignItems: "center", padding: "22px 6px 0", opacity: pull }}>
          {(["chat", "send", "users"] as const).map((n, i) => (
            <Icon key={n} name={n} size={50} color="#111" stroke={2.2} />
          ))}
        </div>
      </div>
      {/* comentários chegando */}
      {Array.from({ length: 7 }).map((_, i) => {
        const d = at(22.0) + i * 3;
        const p = spring({ frame: frame - d, fps, config: theme.spring.bouncy });
        const drift = ip(frame, [d, d + 60], [0, 1], theme.ease.soft);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: [690, 110, 760, 200, 640, 80, 820][i],
              top: [430, 560, 740, 880, 300, 330, 1010][i] - drift * 50,
              opacity: Math.min(1, p) * (1 - ip(frame, [at(25.5), at(25.85)], [0, 1])),
              transform: `scale(${p})`,
            }}
          >
            <div style={{ width: 120, height: 96, borderRadius: "28px 28px 28px 6px", background: "#fff", boxShadow: "0 16px 40px -10px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ width: 13, height: 13, borderRadius: 7, background: "#5B2BFF", opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + k * 5) / 6)) }} />
              ))}
            </div>
          </div>
        );
      })}
      {/* escolheram um lado */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 1150, display: "flex", gap: 20, opacity: Math.min(1, choose * 2) * (1 - ip(frame, [at(25.5), at(25.85)], [0, 1])) }}>
        {["LADO A", "LADO B"].map((l, i) => {
          const fill = interpolate(choose, [0, 1], [0, i === 0 ? 0.62 : 0.38]);
          return (
            <div key={l} style={{ flex: 1, position: "relative", height: 96, borderRadius: 24, background: "#fff", overflow: "hidden", boxShadow: "0 16px 40px -10px rgba(0,0,0,0.4)" }}>
              <div style={{ position: "absolute", inset: 0, width: `${fill * 100}%`, background: i === 0 ? C.primary : "#C9C3D3" }} />
              <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", ...display(40), color: "#111" }}>
                <span>{l}</span>
                <span>{Math.round(fill * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* voltaram */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", opacity: Math.min(1, loop) }}>
        <div style={{ transform: `scale(${loop})`, display: "flex", alignItems: "center", gap: 16, padding: "14px 28px", borderRadius: 999, background: "#111", ...body(34, 800), color: "#fff", textTransform: "uppercase" }}>
          <span style={{ display: "inline-flex", transform: `rotate(${frame * 6}deg)` }}>
            <Icon name="loop" size={40} color={C.primary} stroke={2.6} />
          </span>
          voltaram pro próximo
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ S6 · 25.85 – 29.2s · "Esse vídeo passou de 260 mil visualizações." ============
export const S6: React.FC = () => {
  const S = 25.85;
  const { frame, fps, at } = useScene(S);
  const tile = IG.tiles[0];
  const z = interpolate(frame, [0, at(29.2)], [1, 1.12], { easing: theme.ease.soft, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cnt = ip(frame, [at(26.9), at(28.0)], [0, 1], theme.ease.out);
  const ring = ((frame % 36) / 36);
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 190, top: 160, transform: `perspective(2000px) rotateY(${Math.sin(frame / 30) * 5}deg) scale(${interpolate(enter, [0, 1], [1.3, 1])})`, opacity: Math.min(1, enter * 1.5) }}>
        <div style={{ position: "relative", borderRadius: 30, overflow: "hidden", boxShadow: `0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 5px ${C.primary}, 0 0 80px ${C.glow}` }}>{crop(tile, 700, IG.src, z)}</div>
        <div style={{ position: "absolute", inset: -14, borderRadius: 40, border: `4px solid ${C.primary}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.08})` }} />
        <div style={{ position: "absolute", left: 24, top: 24 }}>
          <In delay={at(25.92)} cfg="bouncy" scale={0.6} y={-20}>
            <div style={{ padding: "10px 20px", borderRadius: 999, background: C.accent, ...body(26, 800), color: "#fff", letterSpacing: "0.1em" }}>O VÍDEO QUE VIRALIZOU</div>
          </In>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...display(210), color: C.primary, fontVariantNumeric: "tabular-nums", textShadow: `0 0 60px ${C.glow}, ${rgb(1.2)}`, opacity: cnt > 0 ? 1 : 0, transform: `scale(${interpolate(cnt, [0, 1], [0.7, 1])})` }}>
          {Math.round(cnt * 264)} mil
        </div>
        <In delay={at(28.2)} y={20}>
          <div style={{ ...body(42, 700), color: C.text }}>visualizações em um único vídeo</div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ============ S7 · 29.2 – 36.0s · resultados ============
const Stat: React.FC<{ at: number; value: string; label: string; sub?: string; hero?: boolean; w?: number }> = ({ at, value, label, sub, hero, w = 900 }) => (
  <In delay={at} cfg="bouncy" y={60} scale={0.75}>
    <Glass active={hero} style={{ width: w, padding: "34px 40px", display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(10,6,18,0.82)" }}>
      <div style={{ ...display(hero ? 170 : 96), color: hero ? C.primary : C.text, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", textShadow: hero ? `0 0 50px ${C.glow}` : rgb(0.6) }}>{value}</div>
      <div style={{ ...body(38, 700), color: C.text, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ ...body(26, 600), color: C.textDim, marginTop: 6, letterSpacing: "0.15em", textTransform: "uppercase" }}>{sub}</div>}
    </Glass>
  </In>
);

export const S7: React.FC = () => {
  const S = 29.2;
  const { at } = useScene(S);
  const pain = IG.painel;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150 }}>
        <Words text="Em 30 dias" times={[at(29.28), at(29.64), at(29.94)]} style={{ ...display(80), textShadow: rgb() }} gap={22} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 330 }}>
        <Stat at={at(30.5)} value="337 mil" label="visualizações no perfil" hero />
      </div>
      {/* print real do painel — prova */}
      <div style={{ position: "absolute", left: 90, top: 710 }}>
        <In delay={at(31.6)} y={30}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: `0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 3px rgba(${C.primaryRgb},0.6)` }}>{crop(pain, 900)}</div>
          <div style={{ ...body(24, 700), color: C.textDim, textAlign: "center", marginTop: 12, letterSpacing: "0.2em" }}>PRINT REAL DO PAINEL</div>
        </In>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 940, display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <Stat at={at(33.54)} value="10,1 mil" label="seguidores" sub="Instagram" w={440} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat at={at(35.3)} value="10,7 mil" label="seguidores" sub="TikTok" w={440} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ S8 · 36.0 – 40.4s · "Tudo criado com IA. Sem rosto, sem câmera, sem estúdio." ============
const NoTile: React.FC<{ icon: React.ComponentProps<typeof Icon>["name"]; label: string; at: number }> = ({ icon, label, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = spring({ frame: frame - at - 5, fps, config: theme.spring.bouncy });
  return (
    <In delay={at - 3} cfg="bouncy" y={60} scale={0.6}>
      <Glass style={{ width: 290, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, position: "relative", overflow: "hidden", background: "rgba(20,10,36,0.8)" }}>
        <div style={{ opacity: 1 - Math.min(1, x) * 0.55 }}>
          <Icon name={icon} size={120} color={C.text} stroke={1.6} />
        </div>
        <div style={{ ...body(38, 800), color: C.text, textTransform: "uppercase", opacity: 1 - Math.min(1, x) * 0.4 }}>{label}</div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(x, [0, 1], [2.4, 1])})`, opacity: Math.min(1, x) }}>
          <Icon name="x" size={230} color={C.accent} stroke={2.6} />
        </div>
      </Glass>
    </In>
  );
};

export const S8: React.FC = () => {
  const S = 36.0;
  const { frame, at } = useScene(S);
  const scan = ip(frame, [at(36.8), at(37.7)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Words text="Tudo criado com" times={[at(36.08), at(36.2), at(36.66)]} style={{ ...display(68, 700), color: C.textDim }} gap={18} />
        <div style={{ position: "relative" }}>
          <Words text="inteligência artificial." times={[at(36.8), at(37.34)]} hero={[0, 1]} style={{ ...display(104), fontStyle: "italic", maxWidth: 960, textShadow: `0 0 60px ${C.glow}` }} gap={24} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${scan * 100}%`, width: 6, background: C.primary, boxShadow: `0 0 30px ${C.primary}`, opacity: scan > 0 && scan < 1 ? 1 : 0 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", gap: 26 }}>
        <NoTile icon="users" label="rosto" at={at(38.18)} />
        <NoTile icon="video" label="câmera" at={at(38.9)} />
        <NoTile icon="spark" label="estúdio" at={at(39.64)} />
      </div>
    </AbsoluteFill>
  );
};

// ============ S9 · 40.4 – 45.45s · "A IA sozinha não viraliza ninguém. O que prende é a história." ============
export const S9: React.FC = () => {
  const S = 40.4;
  const { frame, at } = useScene(S);
  const phase = at(43.4);
  const o = ip(frame, [phase - 5, phase + 3], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill>
      {frame < phase + 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14, paddingBottom: 180, opacity: 1 - o, transform: `scale(${1 + o * 0.2})` }}>
          <Words text="Então não." times={[at(40.46), at(40.76)]} style={{ ...display(70, 700), color: C.textDim }} gap={18} />
          <Words text="A IA sozinha" times={[at(41.32), at(41.42), at(41.58)]} hero={[1]} heroColor={C.accent} style={{ ...display(124), fontStyle: "italic", textShadow: rgb() }} gap={28} />
          <Words text="não viraliza ninguém." times={[at(42.26), at(42.5), at(42.92)]} style={{ ...display(84), textShadow: rgb(0.8) }} gap={20} />
        </AbsoluteFill>
      )}
      {frame > phase - 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, paddingBottom: 180 }}>
          <Words text="O que prende as pessoas é" times={[at(43.46), at(43.64), at(43.94), at(44.02), at(44.4)]} style={{ ...display(68, 700), color: C.textDim, maxWidth: 900 }} gap={16} />
          <Selected text="A HISTÓRIA" at={at(44.8)} size={150} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ S10 · 45.45 – 49.45s · método → Story System ============
export const S10: React.FC = () => {
  const S = 45.45;
  const { frame, fps, at } = useScene(S);
  const hit = at(48.42);
  const m = spring({ frame: frame - hit, fps, config: theme.spring.bouncy });
  const w = spring({ frame: frame - hit - 7, fps, config: theme.spring.snappy });
  const rays = ip(frame, [hit, hit + 30], [0, 1], theme.ease.out);
  const flash = ip(frame, [hit - 2, hit + 1], [0, 1]) * (1 - ip(frame, [hit + 1, hit + 12], [0, 1]));
  const pre = ip(frame, [hit - 6, hit], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: rays }}>
        <div style={{ width: 2400, height: 2400, transform: `rotate(${frame * 0.4}deg) scale(${0.5 + rays * 0.5})`, background: `repeating-conic-gradient(from 0deg, rgba(${C.primaryRgb},0.13) 0deg 7deg, transparent 7deg 20deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 55%)", WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 330, opacity: 1 - pre * 0.6 }}>
        <Words text="Por trás de cada episódio" times={[at(45.58), at(45.7), at(45.9), at(46.08), at(46.26)]} style={{ ...display(64, 700), color: C.textDim }} gap={16} />
        <div style={{ height: 14 }} />
        <Words text="existe um método." times={[at(46.94), at(47.22), at(47.42)]} hero={[2]} style={{ ...display(96), textShadow: `0 0 50px ${C.glow}` }} gap={22} />
      </div>
      {frame >= hit - 1 && (
        <div style={{ position: "absolute", top: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div style={{ transform: `scale(${interpolate(m, [0, 1], [0.2, 1]) * (1 + Math.sin((frame - hit) / 14) * 0.015)}) rotate(${interpolate(m, [0, 1], [-35, 0])}deg)`, opacity: Math.min(1, m * 2) }}>
            <LogoMark size={290} glow={1} />
          </div>
          <div style={{ display: "flex", gap: 26, ...display(128), opacity: Math.min(1, w), transform: `translateY(${interpolate(w, [0, 1], [50, 0])}px)` }}>
            <span style={{ textShadow: rgb(0.8) }}>Story</span>
            <span style={{ color: C.primary, textShadow: `0 0 50px ${C.glow}` }}>System</span>
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.4 }} />
    </AbsoluteFill>
  );
};

// ============ S11 · 49.45 – 56.65s · o que você aprende ============
const Learn: React.FC<{ n: number; icon: React.ComponentProps<typeof Icon>["name"]; title: string; at: number; active: boolean }> = ({ n, icon, title, at, active }) => (
  <In delay={at} x={-90} y={0} cfg="snappy">
    <Glass active={active} style={{ width: 900, height: 200, padding: "0 40px", display: "flex", alignItems: "center", gap: 34, background: active ? undefined : "rgba(20,10,36,0.75)" }}>
      <div style={{ width: 120, height: 120, borderRadius: 30, background: active ? C.primary : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={64} color={active ? C.onPrimary : C.text} stroke={2} />
      </div>
      <div>
        <div style={{ ...body(26, 800), color: active ? C.primary : C.textMute, letterSpacing: "0.22em" }}>0{n}</div>
        <div style={{ ...display(58), color: C.text, marginTop: 4, lineHeight: 1.05 }}>{title}</div>
      </div>
    </Glass>
  </In>
);

export const S11: React.FC = () => {
  const S = 49.45;
  const { frame, at } = useScene(S);
  const active = frame >= at(54.06) ? 2 : frame >= at(52.36) ? 1 : frame >= at(51.24) ? 0 : -1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <In delay={at(49.54)} cfg="smooth" y={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <LogoMark size={86} />
            <span style={{ ...display(64), textShadow: rgb(0.6) }}>
              Story <span style={{ color: C.primary }}>System</span>
            </span>
          </div>
        </In>
        <Words text="você aprende a:" times={[at(50.6), at(50.74), at(51.18)]} style={{ ...display(56, 700), color: C.textDim }} gap={14} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 480, display: "flex", flexDirection: "column", gap: 28 }}>
        <Learn n={1} icon="users" title="Criar seu personagem" at={at(51.2)} active={active === 0} />
        <Learn n={2} icon="book" title="Escrever episódios que prendem" at={at(52.3)} active={active === 1} />
        <Learn n={3} icon="loop" title="Fazer as pessoas voltarem" at={at(54.0)} active={active === 2} />
      </div>
    </AbsoluteFill>
  );
};

// ============ S12 · 56.65 – 61.45s · transparência + caminho ============
const SCRIBBLE = "M90 700 C 180 520, 260 860, 330 640 S 470 420, 430 720 S 600 880, 650 600 S 520 450, 760 540 S 860 820, 720 760 S 940 520, 990 680";

export const S12: React.FC = () => {
  const S = 56.65;
  const { frame, at } = useScene(S);
  const draw = ip(frame, [at(58.8), at(60.0)], [0, 1], theme.ease.soft);
  const straight = ip(frame, [at(60.0), at(60.9)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 260 }}>
        <Words text="Os resultados dependem da sua aplicação." times={[at(56.74), at(56.84), at(57.3), at(57.86), at(58.02), at(58.28)]} style={{ ...display(70, 700), color: C.text, maxWidth: 940 }} gap={18} />
      </div>
      <svg width="1080" height="1300" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={SCRIBBLE} fill="none" stroke={C.textMute} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} opacity={1 - straight} />
        <line x1={90} y1={700} x2={90 + 900 * straight} y2={700} stroke={C.primary} strokeWidth={8} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 16px ${C.primary})` }} />
        <circle cx={90 + 900 * straight} cy={700} r={straight > 0 ? 16 : 0} fill={C.primary} />
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, top: 840 }}>
        <Words text="O caminho, você não precisa descobrir sozinho." times={[at(59.08), at(59.2), at(59.74), at(59.94), at(60.18), at(60.56), at(60.96)]} hero={[1]} style={{ ...display(70), maxWidth: 940, textShadow: rgb(0.6) }} gap={18} />
      </div>
    </AbsoluteFill>
  );
};

// ============ S13 · 61.45 – fim · CTA link da bio ============
export const S13: React.FC = () => {
  const S = 61.45;
  const { frame, fps, at } = useScene(S);
  const tapAt = at(62.58);
  const finger = ip(frame, [at(61.9), tapAt], [0, 1], theme.ease.inOut);
  const press = frame >= tapAt && frame < tapAt + 8;
  const ripple = frame > tapAt ? Math.min(1, (frame - tapAt) / 14) : 0;
  const fade = ip(frame, [at(65.1), at(65.48)], [0, 1]);
  const arrow = Math.abs(Math.sin(frame / 7)) * 18;
  const lockup = spring({ frame: frame - at(63.2), fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Words text="O link tá na minha bio." times={[at(61.54), at(61.62), at(61.8), at(61.96), at(62.04), at(62.16)]} hero={[5]} style={{ ...display(88), textShadow: rgb(0.8) }} gap={22} />
        <div style={{ transform: `translateY(${-arrow}px)` }}>
          <svg width="90" height="110" viewBox="0 0 24 30">
            <path d="M12 28V4M3 13l9-9 9 9" fill="none" stroke={C.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${C.primary})` }} />
          </svg>
        </div>
      </div>
      {/* pílula genérica de link (sem dados do perfil) + toque */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <In delay={at(61.8)} cfg="bouncy" y={40} scale={0.7}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 56px", borderRadius: 999, background: `linear-gradient(180deg, #7FF6FA, ${C.primary})`, boxShadow: `0 20px 70px -10px ${C.glow}`, transform: `scale(${press ? 0.94 : 1 + Math.sin(frame / 7) * 0.02})`, ...display(58), color: C.onPrimary, whiteSpace: "nowrap" }}>
              <svg width="50" height="50" viewBox="0 0 24 24">
                <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" fill="none" stroke={C.onPrimary} strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              Toque no link da bio
            </div>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: 75, border: `6px solid #fff`, opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0, transform: `scale(${0.4 + ripple * 1.4})` }} />
            <div style={{ position: "absolute", left: interpolate(finger, [0, 1], [700, 380]), top: interpolate(finger, [0, 1], [360, 70]), opacity: ip(frame, [at(61.9), at(62.1)], [0, 1]), transform: `scale(${press ? 0.88 : 1})` }}>
              <svg width="120" height="140" viewBox="0 0 22 26">
                <path d="M8 1.5a2 2 0 0 1 4 0V10l5.2.9a2.6 2.6 0 0 1 2.1 3l-1.2 6.6A4 4 0 0 1 14.2 24H9.6a4 4 0 0 1-3.3-1.8L1.6 15.3a1.8 1.8 0 0 1 2.6-2.4L8 15.6z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: Math.min(1, lockup), transform: `translateY(${interpolate(lockup, [0, 1], [50, 0])}px)` }}>
        <LogoMark size={210} glow={0.8} />
        <Words text="Comece a criar a sua história." times={[at(63.28), at(63.66), at(63.84), at(64.0), at(64.14), at(64.32)].slice(0, 6)} hero={[5]} style={{ ...display(78), maxWidth: 940, textShadow: rgb(0.6) }} gap={18} />
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
