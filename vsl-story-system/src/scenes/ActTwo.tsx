// Ato 2 — Conceito, o detalhe (pilares), revelação do Story System, o que se aprende, a diferença.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { Crop, IG, TT } from "../components/Device";
import { body, display, Eyebrow, Glass, Icon, In, ip, Logo, useScene, Words } from "../components/Motion";

const C = theme.colors;
type IconName = React.ComponentProps<typeof Icon>["name"];

// ---------------- S6 · Conteúdo narrativo participativo (64.9 – 76.75s) ----------------
export const S6Concept: React.FC = () => {
  const S = 64.9;
  const { frame, fps, at } = useScene(S);
  const lift = ip(frame, [at(69.3), at(70.1)], [0, 1], theme.ease.inOut);
  const pulse = ip(frame, [at(73.5), at(76.1)], [0, 1], theme.ease.soft);
  const TW = 236;
  const GAP = 74;
  const total = 5 * TW + 4 * GAP;
  const x0 = (1920 - total) / 2;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(lift, [0, 1], [250, 70]),
          transform: `scale(${interpolate(lift, [0, 1], [1, 0.52])})`,
          transformOrigin: "50% 0",
        }}
      >
        <Words
          text="É justamente essa a lógica dos"
          times={[at(65.1), at(65.2), at(65.7), at(66.4), at(66.6), at(67.0)]}
          style={{ ...body(40, 600), color: C.textDim }}
          gap={12}
        />
        <div style={{ height: 30 }} />
        <Words
          text="Conteúdo narrativo participativo."
          times={[at(67.1), at(67.7), at(68.2)]}
          hero={[2]}
          style={{ ...display(140) }}
          gap={34}
        />
      </div>

      {/* corrente de episódios reais (Instagram) */}
      {frame > at(70.0) && (
        <div style={{ position: "absolute", left: x0, top: 360, width: total, height: 420 }}>
          <svg width={total} height={420} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {[0, 1, 2, 3].map((i) => {
              const x1 = i * (TW + GAP) + TW + 8;
              const x2 = x1 + GAP - 16;
              const seg = ip(pulse * 5, [i + 0.4, i + 1], [0, 1], theme.ease.out);
              return (
                <g key={i}>
                  <line x1={x1} y1={158} x2={x2} y2={158} stroke="rgba(255,255,255,0.15)" strokeWidth={4} strokeLinecap="round" />
                  <line x1={x1} y1={158} x2={x1 + (x2 - x1) * seg} y2={158} stroke={C.primary} strokeWidth={4} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          {IG.tiles.map((t, i) => {
            const d = at(70.5) + i * 5;
            const p = spring({ frame: frame - d, fps, config: theme.spring.smooth });
            const lit = ip(pulse * 5, [i, i + 0.4], [0, 1]);
            const q = spring({ frame: frame - (at(73.5) + ((at(76.1) - at(73.5)) / 5) * i), fps, config: theme.spring.bouncy });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * (TW + GAP),
                  top: 0,
                  opacity: Math.min(1, p),
                  transform: `translateY(${interpolate(p, [0, 1], [60, 0]) + Math.sin((frame + i * 15) / 30) * 4}px) scale(${interpolate(p, [0, 1], [0.9, 1]) * (1 + lit * 0.04)})`,
                }}
              >
                <Crop src={IG.src} r={t} width={TW} radius={18} kb={ip(frame, [d, d + 240], [0, 1], theme.ease.soft)} style={{ filter: `saturate(${0.55 + lit * 0.45}) brightness(${0.75 + lit * 0.25})` }} />
                <div
                  style={{
                    position: "absolute",
                    right: -16,
                    top: -16,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    background: i === 4 ? C.primary : C.text,
                    color: C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...display(32),
                    lineHeight: 1,
                    transform: `scale(${q})`,
                    boxShadow: i === 4 ? `0 0 40px ${C.glow}` : undefined,
                  }}
                >
                  <span style={{ color: C.bg }}>?</span>
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 360 }}>
            <Words
              text="Cada publicação desperta curiosidade pela próxima."
              times={[at(73.7), at(74.1), at(74.7), at(75.3), at(75.9), at(76.1)]}
              style={{ ...body(38, 600), color: C.text }}
              gap={12}
            />
          </div>
        </div>
      )}
      {frame > at(70.0) && frame < at(73.3) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 290 }}>
          <Words
            text="história → experiência interativa"
            times={[at(71.2), at(71.8), at(72.0), at(72.5)]}
            outAt={at(73.0)}
            style={{ ...body(32, 700), color: C.textDim, letterSpacing: "0.02em" }}
            gap={14}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S7 · O detalhe + pilares (76.75 – 91.1s) ----------------
const Pillar: React.FC<{ n: string; icon: IconName; title: string; desc: string; delay: number; active: boolean }> = ({ n, icon, title, desc, delay, active }) => (
  <In delay={delay} y={70} cfg="smooth">
    <Glass active={active} style={{ width: 380, height: 400, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: active ? C.primary : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={44} color={active ? C.bg : C.text} />
        </div>
        <div style={{ ...body(26, 700), color: C.textMute }}>{n}</div>
      </div>
      <div>
        <div style={{ ...display(54), color: C.text }}>{title}</div>
        <div style={{ ...body(26, 500), marginTop: 12, lineHeight: 1.3 }}>{desc}</div>
      </div>
    </Glass>
  </In>
);

export const S7Detail: React.FC = () => {
  const S = 76.75;
  const { frame, at } = useScene(S);
  const phaseB = at(78.25);
  const phaseC = at(82.3);
  const s1 = ip(frame, [at(79.6), at(80.0)], [0, 1]);
  const s2 = ip(frame, [at(81.4), at(81.9)], [0, 1]);
  const link = ip(frame, [at(89.2), at(90.4)], [0, 1], theme.ease.inOut);
  const activeIdx = frame >= at(87.8) ? 3 : frame >= at(86.3) ? 2 : frame >= at(85.1) ? 1 : frame >= at(83.9) ? 0 : -1;
  return (
    <AbsoluteFill>
      {frame < phaseB + 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Words text="Mas existe um detalhe." times={[at(76.9), at(77.2), at(77.5), at(77.6)]} hero={[3]} outAt={phaseB - 6} style={{ ...display(110) }} gap={28} />
        </AbsoluteFill>
      )}
      {frame > phaseB - 2 && frame < phaseC + 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 50 }}>
          <In delay={phaseB} outAt={phaseC - 8} y={16}>
            <Eyebrow>Não basta</Eyebrow>
          </In>
          {[
            { t: "contar qualquer história", d: at(78.8), s: s1 },
            { t: "colocar uma pergunta no final", d: at(80.3), s: s2 },
          ].map((it, i) => (
            <In key={i} delay={it.d} outAt={phaseC - 8} y={30}>
              <div style={{ position: "relative", ...display(84, 700), color: interpolate(it.s, [0, 1], [1, 0]) > 0.5 ? C.text : C.textMute }}>
                {it.t}
                <div style={{ position: "absolute", left: -12, top: "55%", height: 8, borderRadius: 4, width: `${it.s * 104}%`, background: C.accent }} />
              </div>
            </In>
          ))}
        </AbsoluteFill>
      )}
      {frame > phaseC - 2 && (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110 }}>
            <Words text="É preciso saber construir:" times={[at(82.4), at(82.5), at(82.8), at(83.2)]} style={{ ...display(68, 700), color: C.textDim }} gap={18} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 36 }}>
            <Pillar n="01" icon="book" title="Narrativas" desc="Personagens e uma premissa que prendem." delay={at(83.8)} active={activeIdx === 0} />
            <Pillar n="02" icon="bolt" title="Conflitos" desc="Tensão que pede uma resolução." delay={at(85.0)} active={activeIdx === 1} />
            <Pillar n="03" icon="hook" title="Ganchos" desc="Motivos para voltar no próximo episódio." delay={at(86.2)} active={activeIdx === 2} />
            <Pillar n="04" icon="users" title="Participação" desc="O público influencia a história." delay={at(87.7)} active={activeIdx === 3} />
          </div>
          {/* conexão — "importância dentro da história" */}
          <div style={{ position: "absolute", left: 336, top: 740, width: 1248, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <div style={{ width: `${link * 100}%`, height: 4, background: C.text, borderRadius: 2, opacity: 0.85 }} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: "absolute", left: 336 + i * 416 - 9, top: 733, width: 18, height: 18, borderRadius: 9, background: C.text, transform: `scale(${ip(link * 4, [i, i + 0.5], [0, 1])})` }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 790 }}>
            <Words text="tudo conectado dentro da história" times={[at(89.4), at(89.7), at(90.0), at(90.3), at(90.5)]} style={{ ...body(34, 600) }} gap={12} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S8 · Revelação (91.1 – 101.75s) ----------------
export const S8Reveal: React.FC = () => {
  const S = 91.1;
  const { frame, fps, at } = useScene(S);
  const hit = at(94.0);
  const conv = ip(frame, [at(91.3), at(93.9)], [0, 1], theme.ease.inOut);
  const logoP = spring({ frame: frame - hit, fps, config: theme.spring.bouncy });
  const rays = ip(frame, [hit, hit + 40], [0, 1], theme.ease.out);
  const breathe = 1 + Math.sin((frame - hit) / 24) * 0.012;
  const flash = ip(frame, [hit - 2, hit + 2], [0, 1]) * (1 - ip(frame, [hit + 2, hit + 16], [0, 1]));
  return (
    <AbsoluteFill>
      {/* quatro pilares convergindo */}
      {frame < hit + 6 &&
        [0, 1, 2, 3].map((i) => {
          const sx = 480 + i * 320;
          const x = interpolate(conv, [0, 1], [sx, 960]);
          const y = interpolate(conv, [0, 1], [540, 500]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 14,
                top: y - 14,
                width: 28,
                height: 28,
                borderRadius: 14,
                background: C.text,
                boxShadow: `0 0 ${20 + conv * 40}px rgba(255,255,255,0.6)`,
                opacity: 1 - ip(frame, [hit - 4, hit + 2], [0, 1]),
              }}
            />
          );
        })}
      {frame < hit && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640 }}>
          <Words text="E foi pra ensinar exatamente isso que surgiu…" times={[at(91.3), at(91.4), at(91.5), at(91.6), at(92.0), at(92.7), at(93.2), at(93.4)]} outAt={hit - 6} style={{ ...body(40, 600), color: C.textDim }} gap={12} />
        </div>
      )}
      {/* raios de luz */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: rays * 0.9 }}>
        <div
          style={{
            width: 1600,
            height: 1600,
            transform: `translateY(-60px) rotate(${(frame - hit) * 0.15}deg) scale(${0.6 + rays * 0.4})`,
            background: `repeating-conic-gradient(from 0deg, rgba(255,194,26,0.10) 0deg 6deg, transparent 6deg 18deg)`,
            maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: flash * 0.35 }} />
      {frame >= hit - 1 && (
        <AbsoluteFill style={{ alignItems: "center", flexDirection: "column", paddingTop: 300 }}>
          <div style={{ opacity: Math.min(1, logoP * 1.5), transform: `scale(${interpolate(logoP, [0, 1], [0.6, 1]) * breathe})`, filter: `blur(${(1 - Math.min(1, logoP)) * 10}px)` }}>
            <Logo height={150} glow={1} />
          </div>
          <div style={{ height: 50 }} />
          <In delay={at(95.0)} y={20} cfg="snappy">
            <div style={{ padding: "12px 30px", borderRadius: 999, border: `1.5px solid ${C.stroke}`, background: C.surface, ...body(26, 700), color: C.text, letterSpacing: "0.3em" }}>MENTORIA</div>
          </In>
          <div style={{ height: 40 }} />
          <Words
            text="Como construir seu próprio perfil de conteúdo narrativo participativo"
            times={[at(96.1), at(96.5), at(97.0), at(97.2), at(97.6), at(98.0), at(98.2), at(98.5), at(99.1)]}
            style={{ ...body(40, 600), color: C.textDim, maxWidth: 1300 }}
            gap={12}
          />
          <div style={{ height: 36 }} />
          <In delay={at(100.4)} y={20} cfg="bouncy" scale={0.8}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, ...display(52, 700), color: C.text }}>
              <Icon name="flag" size={44} color={C.text} />
              mesmo começando do zero.
            </div>
          </In>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S9 · O que você aprende (101.75 – 115.9s) ----------------
const Module: React.FC<{ n: string; icon: IconName; title: React.ReactNode; delay: number; active: boolean; dim: number }> = ({ n, icon, title, delay, active, dim }) => (
  <In delay={delay} y={60} cfg="smooth">
    <Glass active={active} style={{ width: 380, height: 300, padding: 34, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: 1 - dim * 0.55 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Icon name={icon} size={50} color={active ? C.primary : C.text} />
        <div style={{ ...display(46), color: active ? C.primary : C.textMute }}>{n}</div>
      </div>
      <div style={{ ...display(46, 700), color: C.text, lineHeight: 1.08 }}>{title}</div>
    </Glass>
  </In>
);

export const S9Learn: React.FC = () => {
  const S = 101.75;
  const { frame, at } = useScene(S);
  const shift = ip(frame, [at(109.6), at(110.4)], [0, 1], theme.ease.inOut);
  const active = frame >= at(109.6) ? -1 : frame >= at(106.7) ? 3 : frame >= at(105.2) ? 2 : frame >= at(103.8) ? 1 : frame >= at(102.6) ? 0 : -1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(shift, [0, 1], [130, 80]) }}>
        <In delay={at(101.9)} y={16}>
          <Eyebrow color={C.textDim}>O que você aprende</Eyebrow>
        </In>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(shift, [0, 1], [300, 170]),
          display: "flex",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${interpolate(shift, [0, 1], [1, 0.82])})`,
        }}
      >
        <Module n="01" icon="book" title="Desenvolver histórias" delay={at(102.6)} active={active === 0} dim={shift} />
        <Module n="02" icon="layers" title="Estruturar episódios" delay={at(103.8)} active={active === 1} dim={shift} />
        <Module n="03" icon="spark" title="Despertar curiosidade" delay={at(105.2)} active={active === 2} dim={shift} />
        <Module
          n="04"
          icon="users"
          title={
            <>
              Seguidores <span style={{ color: C.textDim }}>→</span> participantes
            </>
          }
          delay={at(106.7)}
          active={active === 3}
          dim={shift}
        />
      </div>
      {frame > at(109.6) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <In delay={at(109.8)} y={16}>
            <Eyebrow color={C.textDim}>Tudo isso</Eyebrow>
          </In>
          <div style={{ display: "flex", gap: 30 }}>
            {[
              { i: "camoff" as IconName, t: "Sem mostrar o rosto", d: at(111.6), hero: true },
              { i: "trend" as IconName, t: "Sem depender só de tendências", d: at(113.6), hero: false },
            ].map((b, k) => (
              <In key={k} delay={b.d} y={40} cfg="bouncy" scale={0.85}>
                <Glass active={frame >= b.d && (k === 0 ? frame < at(113.6) : true)} style={{ padding: "26px 36px", display: "flex", alignItems: "center", gap: 20 }}>
                  <Icon name={b.i} size={50} color={C.text} />
                  <span style={{ ...display(46, 700), color: C.text }}>{b.t}</span>
                </Glass>
              </In>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S10 · A diferença (115.9 – 135.1s) ----------------
export const S10Difference: React.FC = () => {
  const S = 115.9;
  const { frame, fps, at } = useScene(S);
  const top = ip(frame, [at(117.4), at(118.0)], [0, 1], theme.ease.inOut);
  const divider = ip(frame, [at(117.9), at(118.6)], [0, 1], theme.ease.out);
  const leftDim = ip(frame, [at(125.6), at(126.2)], [0, 1]);
  const scattered = Array.from({ length: 7 }).map((_, i) => {
    const d = at(119.0) + i * 7;
    const p = spring({ frame: frame - d, fps, config: theme.spring.smooth });
    const bx = [90, 330, 560, 180, 470, 700, 260][i];
    const by = [430, 380, 450, 640, 600, 560, 790][i];
    const rot = [-8, 6, -4, 10, -12, 5, -6][i];
    return { i, p, x: bx + Math.sin((frame + i * 40) / 40) * 10, y: by + Math.cos((frame + i * 30) / 35) * 10, rot };
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(top, [0, 1], [440, 70]), transform: `scale(${interpolate(top, [0, 1], [1, 0.6])})`, transformOrigin: "50% 0" }}>
        <Words text="Pense na diferença." times={[at(116.6), at(116.8), at(117.0)]} hero={[2]} style={{ ...display(110) }} gap={28} />
      </div>
      <div style={{ position: "absolute", left: 959, top: 200, width: 2, height: 700 * divider, background: `linear-gradient(180deg, ${C.stroke}, transparent)` }} />

      {/* Lado A — sem estrutura */}
      {frame > at(117.9) && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, opacity: 1 - leftDim * 0.6, filter: `saturate(${1 - leftDim})` }}>
          <div style={{ position: "absolute", left: 90, top: 190 }}>
            <In delay={at(118.0)} y={16}>
              <div style={{ ...body(24, 800), color: C.textMute, letterSpacing: "0.3em" }}>DE UM LADO</div>
            </In>
          </div>
          {scattered.map((s) => (
            <div
              key={s.i}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y - 40,
                width: 150,
                height: 190,
                borderRadius: 16,
                background: "linear-gradient(160deg, #26232e, #17151c)",
                border: `1px solid ${C.stroke}`,
                opacity: Math.min(1, s.p) * 0.7,
                transform: `rotate(${s.rot}deg) scale(${interpolate(s.p, [0, 1], [0.7, 1])})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="video" size={44} color={C.textMute} stroke={1.6} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 90, top: 250, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { t: "Procurar ideias todos os dias", d: at(118.9) },
              { t: "Conteúdos isolados", d: at(121.5) },
              { t: "Esperar que algum dê certo", d: at(123.0) },
            ].map((l, i) => (
              <In key={i} delay={l.d} x={-40} y={0}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderRadius: 14, background: "rgba(9,8,13,0.8)", ...body(36, 700), color: C.textDim }}>
                  <Icon name="x" size={30} color={C.accent} stroke={3} /> {l.t}
                </div>
              </In>
            ))}
          </div>
        </div>
      )}

      {/* Lado B — com estrutura (identidade real dos perfis) */}
      {frame > at(125.6) && (
        <div style={{ position: "absolute", left: 1010, top: 0, width: 860, height: 1080 }}>
          <div style={{ position: "absolute", left: 0, top: 190 }}>
            <In delay={at(125.8)} y={16}>
              <div style={{ ...body(24, 800), color: C.primary, letterSpacing: "0.3em" }}>DO OUTRO</div>
            </In>
          </div>
          <div style={{ position: "absolute", left: 0, top: 245, width: 860 }}>
            <Words text="Uma estrutura para histórias" times={[at(127.0), at(127.2), at(128.0), at(128.6)]} hero={[1]} style={{ ...display(60), justifyContent: "flex-start" }} gap={16} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 360, display: "flex", gap: 24, alignItems: "flex-start" }}>
            <In delay={at(129.6)} y={50} cfg="smooth">
              <div style={{ ...body(20, 700), color: C.textMute, letterSpacing: "0.25em", marginBottom: 12 }}>TIKTOK</div>
              <Crop src={TT.src} r={{ x: 0, y: 270, w: 1080, h: 420 }} width={410} radius={18} kb={ip(frame, [at(129.6), at(135)], [0, 1], theme.ease.soft)} />
            </In>
            <In delay={at(130.1)} y={50} cfg="smooth">
              <div style={{ ...body(20, 700), color: C.textMute, letterSpacing: "0.25em", marginBottom: 12 }}>INSTAGRAM</div>
              <Crop src={IG.src} r={{ x: 0, y: 330, w: 1080, h: 420 }} width={410} radius={18} kb={ip(frame, [at(130.1), at(135)], [0, 1], theme.ease.soft)} />
            </In>
          </div>
          <div style={{ position: "absolute", left: 0, top: 590 }}>
            <In delay={at(130.4)} y={20}>
              <div style={{ ...body(30, 600), color: C.text }}>Uma identidade clara para o perfil</div>
            </In>
          </div>
          <div style={{ position: "absolute", left: 0, top: 670 }}>
            <In delay={at(133.0)} y={30} cfg="bouncy" scale={0.85}>
              <Glass active style={{ padding: "20px 30px", display: "flex", alignItems: "center", gap: 18 }}>
                <Icon name="users" size={44} color={C.primary} />
                <span style={{ ...display(42, 700), color: C.text }}>Conteúdos que convidam a participar</span>
              </Glass>
            </In>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
