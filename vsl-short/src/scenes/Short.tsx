// VSL curta (9:16, ~55s). Cada cena acompanha um trecho da narração (segundos absolutos do áudio sem silêncios).
import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Camera, IG, Phone, phoneGeom, Rect, SHOT_H, SHOT_W, Spotlight, Tap, TT } from "../components/Device";
import { body, display, DrawRect, Glass, Icon, In, ip, Logo, LogoMark, useScene, Words } from "../components/Motion";

const C = theme.colors;
const W = 1080;
const H = 1920;

// ---------- peças reutilizáveis ----------

// Capa de episódio (recorte da captura) com zoom focado e respiração contínua
const TileArt: React.FC<{ r: Rect; src: string; width: number; z: number; fx?: number; fy?: number; style?: React.CSSProperties; filter?: string }> = ({
  r,
  src,
  width,
  z,
  fx = 0.5,
  fy = 0.5,
  style,
  filter,
}) => {
  const sc = width / r.w;
  const height = r.h * sc;
  return (
    <div style={{ position: "relative", width, height, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <Img
          src={staticFile(src)}
          style={{ position: "absolute", width: SHOT_W * sc, height: SHOT_H * sc, left: -r.x * sc, top: -r.y * sc, maxWidth: "none", filter }}
        />
      </div>
    </div>
  );
};

// Fundo: a mesma arte em tela cheia, desfocada e escurecida
const BlurBg: React.FC<{ r: Rect; src: string; dim?: number; tint?: string }> = ({ r, src, dim = 0.55, tint }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -260, top: -120, transform: `scale(${1.1 + Math.sin(frame / 50) * 0.03})` }}>
        <TileArt r={r} src={src} width={1600} z={1} style={{ filter: "blur(46px) saturate(1.3)" }} />
      </div>
      <AbsoluteFill style={{ background: `rgba(6,5,10,${dim})` }} />
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

// Batida da história: entra com "whip" (deslize + desfoque + giro) e sai do mesmo jeito
const WHIP = 9;
const Beat: React.FC<{ dur: number; dir?: 1 | -1; children: React.ReactNode; noIn?: boolean; noOut?: boolean }> = ({ dur, dir = 1, children, noIn, noOut }) => {
  const frame = useCurrentFrame();
  const i = noIn ? 1 : ip(frame, [0, WHIP], [0, 1], theme.ease.out);
  const o = noOut ? 0 : ip(frame, [dur - 2, dur + WHIP - 2], [0, 1], theme.ease.in);
  const x = (1 - i) * dir * W * 0.7 - o * dir * W * 0.7;
  const blur = (1 - i) * 26 + o * 26;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px) rotate(${((1 - i) * 4 - o * 4) * dir}deg) scale(${1 + (1 - i) * 0.08 + o * 0.08})`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        opacity: Math.min(1, i * 2) * (1 - o * 0.4),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Card da arte com moldura, sombra e balanço 3D sutil
const ArtCard: React.FC<{ r: Rect; src: string; z0: number; z1: number; dur: number; fx?: number; fy?: number; filter?: string; children?: React.ReactNode; top?: number; width?: number }> = ({
  r,
  src,
  z0,
  z1,
  dur,
  fx,
  fy,
  filter,
  children,
  top = 250,
  width = 820,
}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur + WHIP], [z0, z1], { easing: theme.ease.soft, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: (W - width) / 2,
        top,
        transform: `perspective(2000px) rotateY(${Math.sin(frame / 34) * 3}deg) rotateX(${Math.cos(frame / 41) * 2}deg) translateY(${Math.sin(frame / 27) * 6}px)`,
        borderRadius: 36,
        overflow: "hidden",
        boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,255,255,0.10)",
      }}
    >
      <TileArt r={r} src={src} width={width} z={z} fx={fx} fy={fy} filter={filter} />
      {children}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number }> = ({ children, color = C.text, bg = "rgba(8,7,12,0.82)", size = 40 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 28px",
      borderRadius: 999,
      background: bg,
      border: `1.5px solid ${C.stroke}`,
      backdropFilter: "blur(12px)",
      ...body(size, 800),
      color,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; outAt?: number }> = ({ at, children, style, outAt }) => (
  <In delay={at} outAt={outAt} cfg="bouncy" y={30} scale={0.6} blur={6} style={style}>
    {children}
  </In>
);

// ================= A · A história (0 – 15.35s) =================
export const SStory: React.FC = () => {
  const { frame, fps, at } = useScene(0);
  const T = (a: number, b: number) => ({ from: Math.round(at(a)), durationInFrames: Math.round(at(b) - at(a)) + WHIP });
  const b1 = T(0, 2.95);
  const b2 = T(2.95, 7.25);
  const b3 = T(7.25, 9.7);
  const b4 = T(9.7, 13.22);
  const b5 = T(13.22, 15.36);
  const dur = (b: { durationInFrames: number }) => b.durationInFrames - WHIP;
  // contagem regressiva 30 → no "30 dias"
  const countP = ip(frame, [at(0.0), at(0.7)], [0, 1], theme.ease.out);
  const shown = Math.round(interpolate(countP, [0, 1], [99, 30]));
  return (
    <AbsoluteFill>
      {/* 1 · trinta dias */}
      <Sequence {...b1}>
        <Beat dur={dur(b1)} noIn>
          <BlurBg r={IG.tiles[1]} src={IG.src} />
          <ArtCard r={{ ...IG.tiles[1], y: IG.tiles[1].y + 125, h: IG.tiles[1].h - 165 }} src={IG.src} z0={1.05} z1={1.3} fx={0.3} fy={0.55} dur={dur(b1)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center" }}>
            <In delay={0} cfg="bouncy" y={-40} scale={0.7}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px 14px 24px", borderRadius: 999, background: C.accent, boxShadow: `0 20px 60px -10px rgba(${C.accentRgb},0.7)` }}>
                <Icon name="clock" size={58} color="#fff" stroke={2.6} />
                <span style={{ ...display(84), color: "#fff", fontVariantNumeric: "tabular-nums" }}>{shown} DIAS</span>
              </div>
            </In>
          </div>
        </Beat>
      </Sequence>

      {/* 2 · o concorrente do outro lado da rua */}
      <Sequence {...b2}>
        <Beat dur={dur(b2)}>
          <BlurBg r={IG.tiles[4]} src={IG.src} />
          <ArtCard r={{ ...IG.tiles[4], y: IG.tiles[4].y + 125, h: IG.tiles[4].h - 165 }} src={IG.src} z0={1.0} z1={1.45} fx={0.85} fy={0.5} dur={dur(b2)} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Pop at={at(3.0) - b2.from}>
              <Chip>
                <Icon name="arrow" size={40} color={C.text} stroke={3} /> do outro lado da rua
              </Chip>
            </Pop>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 16 }}>
            <Pop at={at(4.98) - b2.from}>
              <Chip color="#fff" bg={C.accent}>concorrente novo</Chip>
            </Pop>
          </div>
          {/* dinheiro caindo — "cheio de dinheiro" */}
          {Array.from({ length: 14 }).map((_, i) => {
            const s = at(6.0) - b2.from + i * 2;
            const p = ip(frame - b2.from, [s, s + 40], [0, 1], theme.ease.soft);
            if (p <= 0 || p >= 1) return null;
            const x = 90 + ((i * 137) % 900);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: interpolate(p, [0, 1], [-120, 1300]),
                  transform: `rotate(${(i % 2 ? 1 : -1) * p * 220}deg)`,
                  width: 92,
                  height: 92,
                  borderRadius: 46,
                  background: "linear-gradient(160deg, #FFE27A, #E0A400)",
                  border: "4px solid #FFF1B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...display(56),
                  color: "#7A5300",
                  boxShadow: "0 16px 30px -8px rgba(0,0,0,0.6)",
                }}
              >
                $
              </div>
            );
          })}
        </Beat>
      </Sequence>

      {/* 3 · as clientes sumindo, uma por uma */}
      <Sequence {...b3}>
        <Beat dur={dur(b3)}>
          <BlurBg r={IG.tiles[0]} src={IG.src} dim={0.72} />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
            <Words text="as clientes começaram a sumir" times={[at(7.38), at(7.48), at(7.8), at(8.24), at(8.36)].map((v) => v - b3.from)} hero={[4]} heroColor={C.accent} style={{ ...display(96), maxWidth: 900 }} gap={24} />
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 90, right: 90, top: 760, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 34 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const goneAt = [8.36, 8.62, 8.9, 9.12, 9.4][i];
              const enter = spring({ frame: frame - b3.from - 2 - i * 2, fps, config: theme.spring.snappy });
              const g = goneAt ? ip(frame, [at(goneAt), at(goneAt) + 8], [0, 1], theme.ease.in) : 0;
              return (
                <div key={i} style={{ width: 230, height: 230, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, enter) * (1 - g), transform: `scale(${Math.min(1, enter) * (1 - g * 0.5)}) translateY(${-g * 60}px)`, filter: `blur(${g * 14}px)` }}>
                  <svg width="190" height="190" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4.2" fill={i === 5 ? C.text : "rgba(255,255,255,0.85)"} />
                    <path d="M3.5 22c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z" fill={i === 5 ? C.text : "rgba(255,255,255,0.85)"} />
                  </svg>
                </div>
              );
            })}
          </div>
        </Beat>
      </Sequence>

      {/* 4 · uma noite… */}
      <Sequence {...b4}>
        <Beat dur={dur(b4)} dir={-1}>
          <BlurBg r={TT.tiles[1]} src={TT.src} dim={0.75} tint="#2A3B7A" />
          <ArtCard r={{ ...TT.tiles[1], y: TT.tiles[1].y + 120, h: TT.tiles[1].h - 120 }} src={TT.src} z0={1.1} z1={1.6} fx={0.55} fy={0.4} dur={dur(b4)} filter="saturate(0.6) brightness(0.75) hue-rotate(-15deg)" />
          {/* lanterna */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${50 + Math.sin(frame / 18) * 14}% ${42 + Math.cos(frame / 23) * 8}%, transparent 0px, transparent 230px, rgba(3,4,12,0.88) 520px)`,
            }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
            <Pop at={at(10.2) - b4.from}>
              <Chip>
                <Icon name="eye" size={42} color={C.text} /> uma noite…
              </Chip>
            </Pop>
          </div>
        </Beat>
      </Sequence>

      {/* 5 · quem estava por trás era— */}
      <Sequence {...b5}>
        <Beat dur={dur(b5)} noOut>
          <BlurBg r={IG.tiles[3]} src={IG.src} dim={0.8} />
          {(() => {
            const lf = frame - b5.from;
            const cut = at(15.2) - b5.from;
            const glitch = ip(lf, [cut - 7, cut], [0, 1]);
            const beat = 1 + Math.max(0, Math.sin(lf / 4.2)) * 0.02 * (1 + glitch * 3);
            const sh = glitch * 16;
            return (
              <AbsoluteFill style={{ opacity: lf > cut ? 0 : 1, transform: `scale(${beat}) translate(${Math.sin(lf * 7.3) * sh}px, ${Math.cos(lf * 5.1) * sh}px)` }}>
                <ArtCard r={{ ...IG.tiles[3], y: IG.tiles[3].y + 125, h: IG.tiles[3].h - 165 }} src={IG.src} z0={1.2} z1={2.4} fx={0.8} fy={0.42} dur={dur(b5)} filter={`contrast(${1 + glitch * 0.6}) saturate(${1 - glitch * 0.5})`}>
                  <AbsoluteFill style={{ background: `rgba(255,16,34,${glitch * 0.35})`, mixBlendMode: "screen", transform: `translateX(${glitch * 18}px)` }} />
                  <AbsoluteFill style={{ background: `rgba(0,229,238,${glitch * 0.3})`, mixBlendMode: "screen", transform: `translateX(${-glitch * 18}px)` }} />
                </ArtCard>
                <div style={{ position: "absolute", left: 0, right: 0, top: 140, display: "flex", justifyContent: "center" }}>
                  <Pop at={at(13.3) - b5.from}>
                    <Chip color="#fff" bg={C.accent}>quem estava por trás?</Chip>
                  </Pop>
                </div>
              </AbsoluteFill>
            );
          })()}
          {/* corte seco para o preto com scanlines */}
          <AbsoluteFill
            style={{
              opacity: ip(frame - b5.from, [at(15.2) - b5.from, at(15.2) - b5.from + 1], [0, 1]),
              background: "#000",
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)",
            }}
          />
        </Beat>
      </Sequence>
    </AbsoluteFill>
  );
};

// ================= B · Viu como te prendeu? (15.35 – 19.0s) =================
export const SHooked: React.FC = () => {
  const S = 15.35;
  const { frame, at } = useScene(S);
  const rew = ip(frame, [0, at(16.0)], [1, 0], theme.ease.out);
  const bar = ip(frame, [at(16.86), at(18.0)], [0.15, 0.97], theme.ease.inOut);
  return (
    <AbsoluteFill>
      {/* rebobinando: capas passando de trás pra frente */}
      <AbsoluteFill style={{ opacity: rew, filter: `blur(${rew * 6}px)` }}>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} style={{ position: "absolute", top: 120 + row * 440, left: -((frame * (38 + row * 9)) % 1600) + (row % 2) * 200, display: "flex", gap: 30 }}>
            {[...IG.tiles, ...TT.tiles, ...IG.tiles].map((t, i) => (
              <TileArt key={i} r={t} src={i >= 5 && i < 8 ? TT.src : IG.src} width={300} z={1} style={{ borderRadius: 20 }} />
            ))}
          </div>
        ))}
        <AbsoluteFill style={{ background: "rgba(6,5,10,0.55)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <In delay={0} cfg="bouncy" scale={0.5} y={0}>
          <div style={{ display: "flex", gap: 6, opacity: 0.9 }}>
            <svg width="140" height="90" viewBox="0 0 28 18">
              <path d="M14 1 L2 9 L14 17 Z M27 1 L15 9 L27 17 Z" fill={C.text} />
            </svg>
          </div>
        </In>
        <Words text="Viu como te prendeu?" times={[at(15.44), at(15.74), at(15.9), at(16.04)]} hero={[3]} style={{ ...display(124), maxWidth: 940, lineHeight: 1 }} gap={28} />
      </div>
      {/* barra de progresso parada antes do final */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 1010 }}>
        <In delay={at(16.8)} y={30}>
          <div style={{ ...body(44, 700), color: C.textDim, textAlign: "center", marginBottom: 34 }}>Você queria saber o final.</div>
          <div style={{ position: "relative", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)" }}>
            <div style={{ width: `${bar * 100}%`, height: 14, borderRadius: 7, background: C.accent }} />
            <div style={{ position: "absolute", left: `calc(${bar * 100}% - 18px)`, top: -11, width: 36, height: 36, borderRadius: 18, background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,0.6)" }} />
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ================= C · Uma boa história (19.0 – 21.32s) =================
export const SGoodStory: React.FC = () => {
  const S = 19.0;
  const { frame, at } = useScene(S);
  const sweep = ip(frame, [at(20.44), at(21.0)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
      <Words text="É exatamente isso que" times={[at(19.04), at(19.18), at(19.7), at(20.14)]} style={{ ...display(64, 700), color: C.textDim }} gap={16} />
      <div style={{ position: "relative" }}>
        <Words text="uma boa história" times={[at(20.28), at(20.44), at(20.62)]} hero={[1, 2]} style={{ ...display(150), maxWidth: 960, lineHeight: 0.98 }} gap={34} />
        <div style={{ position: "absolute", left: "10%", right: "10%", bottom: -24, height: 12, borderRadius: 6, background: C.primary, transform: `scaleX(${sweep})`, transformOrigin: "0 50%", boxShadow: `0 0 30px ${C.glow}` }} />
      </div>
      <Words text="faz." times={[at(20.86)]} style={{ ...display(110) }} />
      <div style={{ position: "absolute", top: 1300 }}>
        <In delay={at(20.7)} cfg="bouncy" scale={0.4} y={0}>
          <div style={{ transform: `rotate(${Math.sin(frame / 6) * 8}deg)`, transformOrigin: "50% 0" }}>
            <Icon name="hook" size={150} color={C.primary} stroke={1.8} />
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ================= D · Feito com IA (21.32 – 28.0s) =================
const NoTile: React.FC<{ icon: React.ComponentProps<typeof Icon>["name"]; label: string; at: number; xAt: number }> = ({ icon, label, at, xAt }) => {
  const { frame, fps } = useScene(0);
  const x = spring({ frame: frame - xAt, fps, config: theme.spring.bouncy });
  return (
    <In delay={at} cfg="bouncy" y={60} scale={0.6}>
      <Glass style={{ width: 290, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, position: "relative", overflow: "hidden" }}>
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

export const SMadeWithAI: React.FC = () => {
  const S = 21.32;
  const { frame, fps, at } = useScene(S);
  const phase2 = at(25.8);
  const out1 = ip(frame, [phase2 - 4, phase2 + 6], [0, 1], theme.ease.in);
  const tiles = [...IG.tiles.map((t) => ({ t, s: IG.src })), ...TT.tiles.map((t) => ({ t, s: TT.src }))];
  const scan = ip(frame, [at(26.7), at(27.9)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <div style={{ opacity: 1 - out1, transform: `scale(${1 - out1 * 0.15})`, filter: out1 > 0 ? `blur(${out1 * 12}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 260 }}>
          <Words text="Esse vídeo não foi gravado." times={[at(21.54), at(21.72), at(22.08), at(22.46), at(22.7)]} hero={[3, 4]} heroColor={C.accent} style={{ ...display(92), maxWidth: 940 }} gap={22} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 26 }}>
          <NoTile icon="video" label="câmera" at={at(22.9)} xAt={at(23.2)} />
          <NoTile icon="users" label="ator" at={at(23.9)} xAt={at(24.24)} />
          <NoTile icon="spark" label="estúdio" at={at(24.86)} xAt={at(25.2)} />
        </div>
      </div>
      {frame > phase2 - 4 && (
        <>
          {/* mosaico das capas reais — tudo gerado com IA */}
          <div style={{ position: "absolute", left: 60, top: 520, width: 960, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {tiles.slice(0, 6).map((x, i) => {
              const p = spring({ frame: frame - phase2 - i * 3, fps, config: theme.spring.smooth });
              const lit = ip(scan * 7, [i * 0.9, i * 0.9 + 1], [0, 1]);
              return (
                <div key={i} style={{ opacity: Math.min(1, p), transform: `perspective(1200px) rotateY(${interpolate(p, [0, 1], [90, 0])}deg) translateY(${Math.sin((frame + i * 20) / 25) * 8}px)`, borderRadius: 20, overflow: "hidden", boxShadow: `0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 ${lit * 4}px ${C.primary}` }}>
                  <TileArt r={x.t} src={x.s} width={300} z={1.02} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Words text="Tudo criado com" times={[at(25.84), at(25.98), at(26.22)]} style={{ ...display(70, 700), color: C.textDim }} gap={18} />
            <In delay={at(26.8)} cfg="bouncy" scale={0.6} y={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, ...display(104), color: C.primary, textShadow: `0 0 60px ${C.glow}` }}>
                <Icon name="spark" size={92} color={C.primary} stroke={2.4} />
                inteligência artificial
              </div>
            </In>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ================= E · Prova (28.0 – 37.95s) =================
const BigStat: React.FC<{ at: number; value: string; label: string; outAt?: number; hero?: boolean }> = ({ at, value, label, outAt, hero = true }) => (
  <In delay={at} outAt={outAt} cfg="bouncy" y={50} scale={0.7}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "26px 50px", borderRadius: 36, background: "rgba(8,7,12,0.86)", border: `1.5px solid ${hero ? `rgba(${C.primaryRgb},0.6)` : C.stroke}`, boxShadow: hero ? `0 0 60px -10px ${C.glow}` : undefined }}>
      <div style={{ ...display(124), color: hero ? C.primary : C.text, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ ...body(36, 700), color: C.text }}>{label}</div>
    </div>
  </In>
);

export const SProof: React.FC = () => {
  const S = 28.0;
  const { frame, fps, at } = useScene(S);
  const P = { left: 290, top: 200, h: 1100 };
  const gI = phoneGeom(P.left, P.top, P.h);
  const igF = gI.center(IG.followers);
  const igC = { x: P.left + gI.w / 2, y: P.top + gI.h / 2 };
  const ttF = gI.center(TT.followers);
  const t264 = IG.tiles[0];
  const c264 = gI.center(t264);
  const sw1 = at(31.7);
  const sw2 = at(33.62);
  const igCam = [
    { f: 0, x: igC.x, y: igC.y + 200, z: 0.85 },
    { f: at(29.6), x: igC.x, y: igC.y, z: 0.95 },
    { f: at(30.3), x: igF.x - 40, y: igF.y + 200, z: 2.3 },
    { f: sw1, x: igF.x - 30, y: igF.y + 200, z: 2.4 },
  ];
  const ttCam = [
    { f: 0, x: ttF.x - 60, y: ttF.y + 260, z: 1.6 },
    { f: at(32.1) - sw1, x: ttF.x - 40, y: ttF.y + 220, z: 2.3 },
    { f: sw2 - sw1, x: ttF.x - 30, y: ttF.y + 220, z: 2.4 },
  ];
  const vCam = [
    { f: 0, x: igC.x, y: igC.y + 150, z: 1.0 },
    { f: at(34.6) - sw2, x: c264.x, y: c264.y - 120, z: 1.8 },
    { f: at(37.9) - sw2, x: c264.x, y: c264.y - 120, z: 2.0 },
  ];
  const countP = ip(frame, [at(35.3), at(36.3)], [0, 1], theme.ease.out);
  const v = Math.round(interpolate(countP, [0, 1], [0, 264]));
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      {/* Instagram — seguidores */}
      <Sequence durationInFrames={Math.round(sw1) + WHIP}>
        <Beat dur={Math.round(sw1)} noIn>
          <Camera keys={igCam}>
            <Phone src={IG.src} left={P.left} top={P.top + interpolate(enter, [0, 1], [700, 0])} screenH={P.h} rotY={interpolate(enter, [0, 1], [-25, -4])} rotX={interpolate(enter, [0, 1], [25, 2])}>
              <Spotlight r={IG.followers} amount={ip(frame, [at(30.2), at(30.6)], [0, 1])} pad={10} />
              <DrawRect {...IG.followers} delay={at(30.25)} r={16} stroke={7} />
            </Phone>
          </Camera>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
            <Pop at={at(28.3)}>
              <Chip>
                <Icon name="eye" size={40} color={C.text} /> capturas reais do perfil
              </Chip>
            </Pop>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center" }}>
            <BigStat at={at(30.45)} value="10,1 mil" label="seguidores no Instagram" />
          </div>
        </Beat>
      </Sequence>
      {/* TikTok — seguidores */}
      <Sequence from={Math.round(sw1)} durationInFrames={Math.round(sw2 - sw1) + WHIP}>
        <Beat dur={Math.round(sw2 - sw1)}>
          <Camera keys={ttCam}>
            <Phone src={TT.src} left={P.left} top={P.top} screenH={P.h} rotY={-4} rotX={2}>
              <Spotlight r={TT.followers} amount={1} pad={10} />
              <DrawRect {...TT.followers} delay={at(32.0) - sw1} r={16} stroke={7} />
            </Phone>
          </Camera>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center" }}>
            <BigStat at={at(32.3) - sw1} value="10,7 mil" label="seguidores no TikTok" />
          </div>
        </Beat>
      </Sequence>
      {/* um único vídeo — 264 mil */}
      <Sequence from={Math.round(sw2)} durationInFrames={Math.round(at(37.95) - sw2) + WHIP}>
        <Beat dur={Math.round(at(37.95) - sw2)} dir={-1}>
          <Camera keys={vCam}>
            <Phone src={IG.src} left={P.left} top={P.top} screenH={P.h} rotY={-4} rotX={2}>
              <Spotlight r={t264} amount={ip(frame - sw2, [at(34.4) - sw2, at(34.9) - sw2], [0, 1])} pad={4} />
              <DrawRect x={t264.x + 6} y={t264.y + 6} w={t264.w - 12} h={t264.h - 12} r={10} delay={at(34.5) - sw2} stroke={9} />
              <Tap x={t264.x + t264.w / 2} y={t264.y + t264.h / 2} at={at(34.44) - sw2} />
            </Phone>
          </Camera>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center" }}>
            <In delay={at(35.2) - sw2} cfg="bouncy" y={50} scale={0.7}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "26px 56px", borderRadius: 36, background: "rgba(8,7,12,0.86)", border: `1.5px solid rgba(${C.primaryRgb},0.6)`, boxShadow: `0 0 70px -10px ${C.glow}` }}>
                <div style={{ ...display(150), color: C.primary, fontVariantNumeric: "tabular-nums" }}>{v} mil</div>
                <div style={{ ...body(36, 700), color: C.text }}>visualizações em um único vídeo</div>
              </div>
            </In>
          </div>
        </Beat>
      </Sequence>
    </AbsoluteFill>
  );
};

// ================= F · O método (37.95 – 45.5s) =================
const Step: React.FC<{ n: number; title: string; at: number; active: boolean; art: React.ReactNode }> = ({ n, title, at, active, art }) => (
  <In delay={at} x={-80} y={0} cfg="snappy">
    <Glass active={active} style={{ width: 900, height: 196, padding: "0 34px 0 22px", display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: 150, height: 150, borderRadius: 24, overflow: "hidden", flexShrink: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>{art}</div>
      <div style={{ flex: 1 }}>
        <div style={{ ...body(26, 800), color: active ? C.primary : C.textMute, letterSpacing: "0.2em" }}>PASSO 0{n}</div>
        <div style={{ ...display(62), color: C.text, marginTop: 4 }}>{title}</div>
      </div>
      <Icon name={active ? "check" : "arrow"} size={50} color={active ? C.primary : C.textMute} stroke={3} />
    </Glass>
  </In>
);

export const SMethod: React.FC = () => {
  const S = 37.95;
  const { frame, at } = useScene(S);
  const phase2 = at(39.2);
  const strike = ip(frame, [at(38.58), at(38.95)], [0, 1]);
  const out1 = ip(frame, [phase2 - 6, phase2 + 4], [0, 1], theme.ease.in);
  const activeIdx = frame >= at(44.7) ? 3 : frame >= at(43.68) ? 2 : frame >= at(42.64) ? 1 : frame >= at(41.52) ? 0 : -1;
  const line = ip(frame, [at(41.5), at(45.3)], [0, 1], theme.ease.soft);
  return (
    <AbsoluteFill>
      {frame < phase2 + 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - out1, transform: `scale(${1 + out1 * 0.3})` }}>
          <Words text="E não foi" times={[at(38.08), at(38.16), at(38.38)]} style={{ ...display(90, 700), color: C.textDim }} gap={22} />
          <div style={{ position: "relative", marginTop: 10 }}>
            <Words text="sorte." times={[at(38.58)]} style={{ ...display(220) }} />
            <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 22, borderRadius: 11, background: C.accent, transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: "0 50%" }} />
          </div>
        </AbsoluteFill>
      )}
      {frame > phase2 - 2 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150 }}>
            <Words text="Existe um método" times={[at(39.26), at(39.54), at(39.68)]} hero={[2]} style={{ ...display(104) }} gap={26} />
            <div style={{ height: 14 }} />
            <Words text="por trás de cada episódio" times={[at(40.1), at(40.28), at(40.48), at(40.64), at(40.82)]} style={{ ...body(44, 600), color: C.textDim }} gap={12} />
          </div>
          <div style={{ position: "absolute", left: 89, top: 470, width: 6, height: 860 * line, borderRadius: 3, background: `linear-gradient(180deg, ${C.primary}, transparent)`, opacity: 0.5 }} />
          <div style={{ position: "absolute", left: 90, top: 440, display: "flex", flexDirection: "column", gap: 26 }}>
            <Step n={1} title="Criar o personagem" at={at(41.45)} active={activeIdx === 0} art={<TileArt r={IG.avatar} src={IG.src} width={150} z={1.15} />} />
            <Step n={2} title="Escrever a história" at={at(42.6)} active={activeIdx === 1} art={<TileArt r={{ x: 30, y: 548, w: 420, h: 420 }} src={IG.src} width={150} z={1} />} />
            <Step n={3} title="Gerar as cenas" at={at(43.62)} active={activeIdx === 2} art={<TileArt r={{ ...IG.tiles[2], h: IG.tiles[2].w }} src={IG.src} width={150} z={1.1} />} />
            <Step n={4} title="Montar o vídeo" at={at(44.65)} active={activeIdx === 3} art={<Icon name="video" size={80} color={C.text} stroke={1.8} />} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ================= G · Story System (45.5 – 47.85s) =================
export const SBrand: React.FC = () => {
  const S = 45.5;
  const { frame, at } = useScene(S);
  const hit = at(46.84);
  const rays = ip(frame, [hit, hit + 30], [0, 1], theme.ease.out);
  const flash = ip(frame, [hit - 2, hit + 1], [0, 1]) * (1 - ip(frame, [hit + 1, hit + 12], [0, 1]));
  const pre = ip(frame, [0, hit], [0, 1], theme.ease.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: rays }}>
        <div style={{ width: 2200, height: 2200, transform: `rotate(${frame * 0.4}deg) scale(${0.5 + rays * 0.5})`, background: `repeating-conic-gradient(from 0deg, rgba(${C.primaryRgb},0.13) 0deg 7deg, transparent 7deg 20deg)`, maskImage: "radial-gradient(circle, black 0%, transparent 55%)", WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 520 }}>
        <Words text="Esse método tem nome:" times={[at(45.58), at(45.72), at(46.14), at(46.32)]} style={{ ...display(68, 700), color: C.textDim, transform: `scale(${1 - pre * 0.06})` }} gap={18} />
      </div>
      <div style={{ position: "absolute", top: 720, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {frame >= hit - 1 && (
          <div style={{ transform: `scale(${1 + Math.sin((frame - hit) / 14) * 0.015})` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
              <LogoReveal hit={hit} />
            </div>
          </div>
        )}
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.4 }} />
    </AbsoluteFill>
  );
};

const LogoReveal: React.FC<{ hit: number }> = ({ hit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = spring({ frame: frame - hit, fps, config: theme.spring.bouncy });
  const w = spring({ frame: frame - hit - 6, fps, config: theme.spring.snappy });
  return (
    <>
      <div style={{ transform: `scale(${interpolate(m, [0, 1], [0.2, 1])}) rotate(${interpolate(m, [0, 1], [-35, 0])}deg)`, opacity: Math.min(1, m * 2) }}>
        <LogoMark size={300} glow={1} />
      </div>
      <div style={{ display: "flex", gap: 26, ...display(130), opacity: Math.min(1, w), transform: `translateY(${interpolate(w, [0, 1], [50, 0])}px)` }}>
        <span>Story</span>
        <span style={{ color: C.primary, textShadow: `0 0 50px ${C.glow}` }}>System</span>
      </div>
    </>
  );
};

// ================= H · Imagina aprender (47.85 – 51.05s) =================
export const SImagine: React.FC = () => {
  const S = 47.85;
  const { frame, at } = useScene(S);
  const all = [...IG.tiles.map((t) => ({ t, s: IG.src })), ...TT.tiles.map((t) => ({ t, s: TT.src }))];
  return (
    <AbsoluteFill>
      {/* carrossel diagonal infinito de capas */}
      <AbsoluteFill style={{ transform: "rotate(-12deg) scale(1.35)", opacity: 0.55 }}>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} style={{ position: "absolute", top: -60 + row * 420, left: (row % 2 ? -1 : 1) * ((frame * 6) % 330) - 400, display: "flex", gap: 24 }}>
            {[...all, ...all].map((x, i) => (
              <TileArt key={i} r={x.t} src={x.s} width={306} z={1} style={{ borderRadius: 20 }} />
            ))}
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(6,5,10,0.92) 25%, rgba(6,5,10,0.55) 75%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, paddingBottom: 260 }}>
        <Words text="Imagina aprender a criar" times={[at(48.2), at(48.6), at(48.88), at(49.02)]} style={{ ...display(76, 700), color: C.textDim, maxWidth: 900 }} gap={18} />
        <Words text="histórias que prendem" times={[at(49.16), at(49.62), at(49.76)]} hero={[2]} style={{ ...display(130), maxWidth: 960, lineHeight: 0.98 }} gap={30} />
        <Words text="as pessoas assim." times={[at(50.12), at(50.24), at(50.58)]} style={{ ...display(76, 700) }} gap={18} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================= I · CTA (51.05 – fim) =================
export const SCTA: React.FC = () => {
  const S = 51.05;
  const { frame, fps, at } = useScene(S);
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  const tapAt = at(52.44);
  const linkR = { x: 24, y: 684, w: 540, h: 58 }; // linha do link na bio (captura do Instagram)
  const hr = { x: 0, y: 330, w: 1080, h: 450 };
  const sc = 940 / hr.w;
  const press = spring({ frame: frame - tapAt, fps, config: theme.spring.snappy });
  const finger = ip(frame, [at(51.6), tapAt], [0, 1], theme.ease.inOut);
  const fadeOut = ip(frame, [at(55.0), at(55.38)], [0, 1]);
  return (
    <AbsoluteFill>
      {/* recorte do perfil com o link da bio */}
      <div style={{ position: "absolute", left: 70, top: 170, opacity: Math.min(1, enter), transform: `translateY(${interpolate(enter, [0, 1], [-80, 0])}px) perspective(1600px) rotateX(${interpolate(enter, [0, 1], [20, 0])}deg)` }}>
        <div style={{ position: "relative", borderRadius: 32, overflow: "hidden", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,255,255,0.1)" }}>
          <TileArt r={hr} src={IG.src} width={940} z={1} />
          <div style={{ position: "absolute", left: (linkR.x - hr.x) * sc, top: (linkR.y - hr.y) * sc, width: linkR.w * sc, height: linkR.h * sc }}>
            <DrawRect x={0} y={0} w={linkR.w * sc} h={linkR.h * sc} r={14} delay={at(51.5)} stroke={5} />
          </div>
          {/* ripple do toque */}
          <div style={{ position: "absolute", left: 260 * sc - 60, top: (linkR.y + 30 - hr.y) * sc - 60, width: 120, height: 120, borderRadius: 60, border: `5px solid ${C.text}`, opacity: frame > tapAt ? Math.max(0, 1 - (frame - tapAt) / 14) : 0, transform: `scale(${0.4 + Math.min(1, (frame - tapAt) / 14)})` }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: -76, display: "flex", justifyContent: "center" }}>
          <Pop at={at(51.3)}>
            <Chip>o link tá na minha bio</Chip>
          </Pop>
        </div>
        {/* dedo / cursor */}
        <div style={{ position: "absolute", left: interpolate(finger, [0, 1], [640, 230]), top: interpolate(finger, [0, 1], [700, (linkR.y + 20 - hr.y) * sc]), transform: `scale(${1 - Math.min(1, press) * 0.12 * (frame < tapAt + 8 ? 1 : 0)})`, opacity: ip(frame, [at(51.5), at(51.7)], [0, 1]) }}>
          <svg width="110" height="130" viewBox="0 0 22 26">
            <path d="M8 1.5a2 2 0 0 1 4 0V10l5.2.9a2.6 2.6 0 0 1 2.1 3l-1.2 6.6A4 4 0 0 1 14.2 24H9.6a4 4 0 0 1-3.3-1.8L1.6 15.3a1.8 1.8 0 0 1 2.6-2.4L8 15.6z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* marca + botão */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <In delay={at(52.4)} cfg="smooth" y={40}>
          <Logo height={96} glow={0.8} />
        </In>
        <In delay={at(52.7)} cfg="bouncy" y={40} scale={0.7}>
          <div style={{ position: "relative", transform: `scale(${1 + Math.sin(frame / 7) * 0.025})` }}>
            <div style={{ position: "absolute", inset: -8, borderRadius: 999, border: `3px solid ${C.primary}`, opacity: 1 - ((frame % 30) / 30), transform: `scale(${1 + (frame % 30) / 120})` }} />
            <div style={{ padding: "30px 54px", borderRadius: 999, background: `linear-gradient(180deg, #7FF6FA, ${C.primary})`, boxShadow: `0 20px 60px -10px ${C.glow}`, display: "flex", alignItems: "center", gap: 18, ...display(52), color: C.onPrimary, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
              Toque no link da bio
              <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `translateY(${-Math.abs(Math.sin(frame / 6)) * 8}px)` }}>
                <path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke={C.onPrimary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </In>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
