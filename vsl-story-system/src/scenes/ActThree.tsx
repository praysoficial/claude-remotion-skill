// Ato 3 — Caminho, objeção, honestidade e CTA.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { Camera, IG, Phone, phoneGeom, Spotlight, TT } from "../components/Device";
import { body, display, DrawRect, Eyebrow, Glass, Icon, In, ip, Logo, useScene, Words } from "../components/Motion";

const C = theme.colors;

// ---------------- S11 · Sozinho vs método (135.1 – 144.7s) ----------------
const SCRIBBLE =
  "M120 560 C 220 380, 300 720, 380 520 S 520 300, 470 600 S 640 760, 700 480 S 560 330, 820 420 S 900 700, 760 640 S 980 380, 1080 560 S 1180 760, 1130 470 S 1300 360, 1260 640";

export const S11Path: React.FC = () => {
  const S = 135.1;
  const { frame, at } = useScene(S);
  const draw = ip(frame, [at(135.6), at(139.9)], [0, 1], theme.ease.soft);
  const fade = ip(frame, [at(140.5), at(141.0)], [0, 1]);
  const clean = ip(frame, [at(141.6), at(144.1)], [0, 1], theme.ease.inOut);
  const nodes = [
    { t: "Estrutura", d: at(141.9) },
    { t: "Episódios", d: at(142.8) },
    { t: "Participação", d: at(143.5) },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120 }}>
        <Words
          text="Sozinho. Errando. Testando. Sem direção."
          times={[at(137.4), at(138.0), at(139.0), at(139.4), at(139.7)]}
          outAt={at(140.5)}
          style={{ ...display(76, 700), color: C.textDim }}
          gap={22}
        />
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0, opacity: 1 - fade }}>
        <path d={SCRIBBLE} transform="translate(260,0)" fill="none" stroke={C.textMute} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        {draw > 0 && draw < 1 && null}
      </svg>
      {frame > at(140.4) && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150 }}>
            <Words text="Ou um método organizado." times={[at(140.6), at(141.1), at(141.6), at(141.9)]} hero={[3]} style={{ ...display(96) }} gap={26} />
          </div>
          <div style={{ position: "absolute", left: 300, top: 560, width: 1320, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ width: `${clean * 100}%`, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.text}, ${C.primary})`, boxShadow: `0 0 24px ${C.glow}` }} />
          </div>
          {nodes.map((n, i) => {
            const x = 300 + (i * 1320) / 2;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: 563, transform: "translate(-50%,-50%)" }}>
                <In delay={n.d} cfg="bouncy" scale={0.4} y={0}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: i === 2 ? C.primary : C.text, boxShadow: i === 2 ? `0 0 40px ${C.glow}` : undefined, marginTop: 70 }} />
                    <div style={{ ...display(46, 700), color: C.text }}>{n.t}</div>
                    <div style={{ ...body(22, 700), color: C.textMute, letterSpacing: "0.2em" }}>0{i + 1}</div>
                  </div>
                </In>
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S12 · "Funciona pra quem está começando?" (144.7 – 158.9s) ----------------
export const S12Start: React.FC = () => {
  const S = 144.7;
  const { frame, fps, at } = useScene(S);
  const phaseB = at(149.2);
  const phaseC = at(153.85);
  const P = { left: 1130, top: 60, h: 960 };
  const g = phoneGeom(P.left, P.top, P.h);
  const bio = g.center(IG.bio);
  const posts = g.center(IG.posts);
  const enter = spring({ frame: frame - phaseB, fps, config: theme.spring.smooth });
  const cam = [
    { f: phaseB, x: 960, y: 540, z: 1 },
    { f: at(150.0), x: 960, y: 540, z: 1 },
    { f: at(150.9), x: bio.x - 230, y: bio.y + 40, z: 1.9 },
    { f: at(152.4), x: bio.x - 230, y: bio.y + 40, z: 1.9 },
    { f: at(153.1), x: posts.x - 330, y: posts.y + 60, z: 2.2 },
    { f: phaseC + 4, x: posts.x - 330, y: posts.y + 60, z: 2.2 },
    { f: phaseC + 24, x: 960, y: 540, z: 1 },
  ];
  const qMark = spring({ frame: frame - at(146.8), fps, config: theme.spring.slow });
  return (
    <AbsoluteFill>
      {frame < phaseB + 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", ...display(900), color: "rgba(255,255,255,0.035)", transform: `scale(${interpolate(qMark, [0, 1], [0.8, 1])}) rotate(${interpolate(qMark, [0, 1], [-10, 6])}deg)`, opacity: 1 - ip(frame, [phaseB - 10, phaseB], [0, 1]) }}>?</div>
          <In delay={at(145.0)} outAt={phaseB - 10} y={16}>
            <Eyebrow>E talvez você esteja pensando</Eyebrow>
          </In>
          <div style={{ height: 40 }} />
          <Words
            text="Funciona pra quem está começando?"
            times={[at(147.3), at(147.9), at(148.1), at(148.2), at(148.4)]}
            hero={[4]}
            outAt={phaseB - 10}
            style={{ ...display(104), maxWidth: 1500 }}
            gap={26}
          />
        </AbsoluteFill>
      )}
      {frame > phaseB - 2 && (
        <>
          <Camera keys={cam}>
            <Phone
              src={IG.src}
              left={P.left}
              top={P.top + interpolate(enter, [0, 1], [500, 0]) + ip(frame, [phaseC, phaseC + 24], [0, 1], theme.ease.inOut) * 40}
              screenH={P.h}
              rotY={interpolate(enter, [0, 1], [-30, -8])}
              rotX={interpolate(enter, [0, 1], [24, 3])}
              opacity={Math.min(1, enter * 1.4) * (1 - ip(frame, [phaseC + 4, phaseC + 20], [0, 1]))}
            >
              <Spotlight r={IG.bio} amount={ip(frame, [at(150.6), at(151.1)], [0, 1]) * (1 - ip(frame, [at(152.5), at(152.9)], [0, 1]))} />
              <DrawRect {...IG.bio} delay={at(150.8)} outAt={at(152.6)} r={18} stroke={7} />
              <Spotlight r={IG.posts} amount={ip(frame, [at(152.9), at(153.3)], [0, 1]) * (1 - ip(frame, [phaseC, phaseC + 10], [0, 1]))} />
              <DrawRect {...IG.posts} delay={at(153.0)} outAt={phaseC + 4} r={16} stroke={7} />
            </Phone>
          </Camera>
          {frame < phaseC + 12 && (
            <div style={{ position: "absolute", left: 140, top: 230, width: 780 }}>
              <In delay={at(149.3)} outAt={phaseC} y={16}>
                <div style={{ display: "flex" }}>
                  <Eyebrow color={C.textDim}>Desde o início</Eyebrow>
                </div>
              </In>
              <div style={{ height: 30 }} />
              <Words
                text="Pensado pra ensinar a estrutura."
                times={[at(150.2), at(150.7), at(151.6), at(152.0), at(152.1)]}
                hero={[4]}
                outAt={phaseC}
                style={{ ...display(84), justifyContent: "flex-start" }}
                gap={22}
              />
              <div style={{ height: 40 }} />
              <In delay={at(151.0)} outAt={at(152.6)} y={20}>
                <div style={{ ...body(30, 600), lineHeight: 1.4 }}>A premissa da história na bio:<br /><span style={{ color: C.text }}>“30 dias para salvar o salão da minha mãe.”</span></div>
              </In>
            </div>
          )}
          {frame < phaseC + 12 && (
            <div style={{ position: "absolute", left: 140, top: 560, width: 780 }}>
              <In delay={at(153.1)} outAt={phaseC} y={20}>
                <div style={{ ...body(30, 600), lineHeight: 1.4 }}>Um perfil com <span style={{ color: C.text }}>5 posts</span>, todos parte da mesma história.</div>
              </In>
            </div>
          )}
          {frame > phaseC && (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
              <In delay={phaseC + 4} y={16}>
                <Eyebrow>Você não precisa ter</Eyebrow>
              </In>
              {[
                { t: "milhares de seguidores", d: at(154.9) },
                { t: "experiência prévia", d: at(156.4) },
              ].map((it, i) => (
                <In key={i} delay={it.d} y={40} cfg="bouncy" scale={0.85}>
                  <Glass style={{ padding: "24px 40px", display: "flex", alignItems: "center", gap: 22, background: "rgba(9,8,13,0.85)" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `rgba(${C.accentRgb},0.15)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="x" size={34} color={C.accent} stroke={3} />
                    </div>
                    <span style={{ ...display(64, 700) }}>{it.t}</span>
                  </Glass>
                </In>
              ))}
            </AbsoluteFill>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S13 · Transparência (158.9 – 167.25s) ----------------
export const S13Honest: React.FC = () => {
  const S = 158.9;
  const { frame, at } = useScene(S);
  const lines = [
    { t: "Resultados dependem da sua aplicação.", d: at(159.6), icon: "check" as const },
    { t: "Não existe garantia de viralização.", d: at(162.0), icon: "check" as const },
  ];
  const path = ip(frame, [at(165.0), at(166.9)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150 }}>
        <In delay={at(159.0)} y={16}>
          <Eyebrow>Com transparência</Eyebrow>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {lines.map((l, i) => {
          const dimmed = ip(frame, [at(164.2), at(164.7)], [0, 1]);
          return (
            <In key={i} delay={l.d} y={30}>
              <div style={{ ...display(62, 700), color: C.text, opacity: 1 - dimmed * 0.55 }}>{l.t}</div>
            </In>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560 }}>
        <Words
          text="Mas você terá um caminho para aprender e praticar."
          times={[at(164.3), at(164.5), at(164.7), at(165.0), at(165.1), at(165.5), at(165.7), at(166.2), at(166.5)]}
          hero={[4]}
          style={{ ...display(70) }}
          gap={18}
        />
      </div>
      <div style={{ position: "absolute", left: 460, top: 720, width: 1000, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ width: `${path * 100}%`, height: 4, borderRadius: 2, background: C.text, opacity: 0.8 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- S14 · CTA (167.25 – 189.6s) ----------------
const CtaButton: React.FC<{ delay: number; pulseFrom: number }> = ({ delay, pulseFrom }) => {
  const { frame, fps } = useScene(0);
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const pulse = frame > pulseFrom ? 1 + Math.sin((frame - pulseFrom) / 9) * 0.025 : 1;
  const ring = ((frame - pulseFrom) % 45) / 45;
  const sweep = ((frame - delay) % 90) / 90;
  return (
    <div style={{ position: "relative", opacity: Math.min(1, p), transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1]) * pulse})` }}>
      {frame > pulseFrom && (
        <div style={{ position: "absolute", inset: -6, borderRadius: 999, border: `3px solid ${C.primary}`, opacity: (1 - ring) * 0.6, transform: `scale(${1 + ring * 0.18})` }} />
      )}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "30px 60px",
          borderRadius: 999,
          background: `linear-gradient(180deg, #7FF6FA, ${C.primary})`,
          boxShadow: `0 20px 60px -10px ${C.glow}, inset 0 2px 0 rgba(255,255,255,0.5)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          ...display(46),
          color: C.onPrimary,
          letterSpacing: "-0.02em",
        }}
      >
        Quero criar minhas histórias
        <Icon name="arrow" size={44} color={C.onPrimary} stroke={3} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: `${-20 + sweep * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-20deg)" }} />
      </div>
    </div>
  );
};

export const S14CTA: React.FC = () => {
  const S = 167.25;
  const { frame, fps, at } = useScene(S);
  const enter = spring({ frame, fps, config: theme.spring.slow });
  const hit = at(173.6);
  const spread = ip(frame, [hit - 6, hit + 20], [0, 1], theme.ease.inOut);
  const logoP = spring({ frame: frame - hit, fps, config: theme.spring.bouncy });
  const phaseFinal = at(180.0);
  const up = ip(frame, [phaseFinal, phaseFinal + 18], [0, 1], theme.ease.inOut);
  const endLock = at(186.3);
  const lock = ip(frame, [endLock, endLock + 20], [0, 1], theme.ease.inOut);
  const fadeOut = ip(frame, [at(188.9), at(189.55)], [0, 1]);
  const orbit = Math.sin(frame / 60) * 4;
  return (
    <AbsoluteFill>
      {/* os dois perfis — prova final */}
      <div style={{ opacity: 1 - ip(frame, [phaseFinal - 4, phaseFinal + 10], [0, 1]) }}>
        <Phone
          src={TT.src}
          left={interpolate(spread, [0, 1], [70, -330])}
          top={interpolate(enter, [0, 1], [700, 90]) + orbit}
          screenH={880}
          rotY={interpolate(spread, [0, 1], [22, 40])}
          rotX={4}
          rotZ={-3}
          dimScreen={spread * 0.6}
        />
        <Phone
          src={IG.src}
          left={interpolate(spread, [0, 1], [1424, 1830])}
          top={interpolate(enter, [0, 1], [760, 110]) - orbit}
          screenH={880}
          rotY={interpolate(spread, [0, 1], [-22, -40])}
          rotX={4}
          rotZ={3}
          dimScreen={spread * 0.6}
        />
      </div>
      {frame < hit + 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
          <In delay={at(167.4)} outAt={hit - 8} y={16}>
            <Eyebrow>Se você quer descobrir como construir</Eyebrow>
          </In>
          <Words
            text="um perfil que vai além de publicar vídeos."
            times={[at(170.2), at(170.3), at(170.7), at(170.9), at(171.0), at(171.4), at(172.2), at(172.8)]}
            hero={[4]}
            outAt={hit - 8}
            style={{ ...display(72), maxWidth: 760 }}
            gap={18}
          />
        </AbsoluteFill>
      )}
      {frame >= hit - 1 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            flexDirection: "column",
            paddingTop: interpolate(up, [0, 1], [250, 110]) + interpolate(lock, [0, 1], [0, 160]),
          }}
        >
          <In delay={hit} y={16} outAt={phaseFinal}>
            <Eyebrow color={C.textDim}>Essa é sua oportunidade</Eyebrow>
          </In>
          <div style={{ height: interpolate(up, [0, 1], [40, 0]) }} />
          <div style={{ opacity: Math.min(1, logoP * 1.5), transform: `scale(${interpolate(logoP, [0, 1], [0.6, 1]) * interpolate(up, [0, 1], [1, 0.62]) * interpolate(lock, [0, 1], [1, 1.35])})`, filter: `blur(${(1 - Math.min(1, logoP)) * 10}px)` }}>
            <Logo height={140} glow={0.8} reveal={hit} />
          </div>
          <div style={{ height: interpolate(up, [0, 1], [70, 20]) }} />
          {/* linhas finais */}
          {frame > phaseFinal - 2 && frame < endLock + 12 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: 1 - lock }}>
              <div style={{ position: "relative" }}>
                <Words text="Pare de apenas tentar chamar atenção." times={[at(180.1), at(180.3), at(180.4), at(180.8), at(181.2), at(181.7)]} style={{ ...display(54, 700), color: C.textDim }} gap={14} />
              </div>
              <Words
                text="Aprenda a criar histórias que fazem as pessoas quererem participar."
                times={[at(182.5), at(183.0), at(183.0), at(183.2), at(183.8), at(184.0), at(184.3), at(184.4), at(184.8), at(185.4)]}
                hero={[9]}
                style={{ ...display(78), maxWidth: 1500 }}
                gap={20}
              />
            </div>
          )}
        </AbsoluteFill>
      )}
      {/* botão */}
      {frame > at(174.8) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(up, [0, 1], [640, 790]) - interpolate(lock, [0, 1], [0, 150]), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <CtaButton delay={at(175.1)} pulseFrom={at(175.8)} />
          <In delay={at(176.5)} y={16} outAt={phaseFinal - 4}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, ...body(30, 600) }}>
              <span style={{ transform: `translateY(${Math.abs(Math.sin(frame / 8)) * 8}px)` }}>
                <Icon name="down" size={32} color={C.textDim} />
              </span>
              Clique no botão abaixo e conheça a mentoria
            </div>
          </In>
        </div>
      )}
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
