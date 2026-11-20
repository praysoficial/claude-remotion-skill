// Ato 1 — Gancho, ciclo vicioso, dor, virada participativa e primeira prova social.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { Camera, Crop, IG, Phone, phoneGeom, Spotlight, Tap, TT } from "../components/Device";
import { body, display, DrawRect, Eyebrow, Glass, Icon, In, ip, useScene, Words } from "../components/Motion";

const C = theme.colors;

// ---------------- S1 · Gancho (0 – 9.0s) ----------------
export const S1Hook: React.FC = () => {
  const S = 0;
  const { frame, fps, at } = useScene(S);
  const P = { left: 1170, top: 72, h: 920 };
  const g = phoneGeom(P.left, P.top, P.h);
  const av = g.center(IG.avatar);
  const phoneC = { x: P.left + g.w / 2, y: P.top + g.h / 2 };
  const enter = spring({ frame, fps, config: theme.spring.slow });
  const cam = [
    { f: 0, x: 960, y: 560, z: 1 },
    { f: at(4.9), x: 960, y: 540, z: 1.04 },
    { f: at(5.9), x: av.x - 150, y: av.y + 40, z: 2.4 },
    { f: at(7.0), x: av.x - 150, y: av.y + 40, z: 2.5 },
    { f: at(8.0), x: phoneC.x - 420, y: phoneC.y, z: 1.15 },
  ];
  const textA = at(4.95);
  return (
    <AbsoluteFill>
      <Camera keys={cam}>
        <Phone
          src={IG.src}
          left={P.left}
          top={P.top + interpolate(enter, [0, 1], [520, 0])}
          screenH={P.h}
          rotY={interpolate(enter, [0, 1], [-35, -9]) + Math.sin(frame / 40) * 1.5}
          rotX={interpolate(enter, [0, 1], [30, 4])}
          opacity={Math.min(1, enter * 1.4)}
        >
          <Spotlight r={IG.avatar} amount={ip(frame, [at(5.4), at(6.0)], [0, 1]) * (1 - ip(frame, [at(7.6), at(8.2)], [0, 1]))} pad={30} />
          <DrawRect {...IG.avatar} x={IG.avatar.x - 18} y={IG.avatar.y - 18} w={IG.avatar.w + 36} h={IG.avatar.h + 36} r={120} delay={at(6.3)} outAt={at(7.7)} stroke={7} />
        </Phone>
      </Camera>

      {/* Texto em espaço de tela */}
      <div style={{ position: "absolute", left: 150, top: 250, width: 900 }}>
        <In delay={2} outAt={textA} y={20}>
          <Eyebrow color={C.primary}>Imagine</Eyebrow>
        </In>
        <div style={{ height: 34 }} />
        <Words
          text="Um perfil no Instagram que faz as pessoas"
          times={[at(0.9), at(1.4), at(1.8), at(1.9), at(2.2), at(2.6), at(2.7), at(2.9)]}
          outAt={textA}
          style={{ ...display(58, 700), color: C.textDim, justifyContent: "flex-start" }}
          gap={16}
        />
        <div style={{ height: 18 }} />
        <Words
          text="quererem voltar todos os dias."
          times={[at(3.2), at(3.5), at(3.9), at(4.4), at(4.8)]}
          hero={[1]}
          outAt={textA}
          style={{ ...display(104), justifyContent: "flex-start" }}
          gap={26}
        />
      </div>
      <div style={{ position: "absolute", left: 150, top: 330, width: 820 }}>
        <Words
          text="Sem mostrar o rosto."
          times={[at(5.0), at(5.9), at(6.2), at(6.4)]}
          hero={[3]}
          outAt={at(8.75)}
          style={{ ...display(116), justifyContent: "flex-start" }}
          gap={28}
        />
        <div style={{ height: 30 }} />
        <In delay={at(6.9)} outAt={at(8.75)} y={24}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Icon name="clock" size={46} color={C.textDim} />
            <div style={{ ...body(40, 600) }}>Sem passar horas criando conteúdo.</div>
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- S2 · O ciclo (9.0 – 21.0s) ----------------
const RingNode: React.FC<{ label: string; icon: React.ComponentProps<typeof Icon>["name"]; angle: number; delay: number; r: number; dim: number }> = ({
  label,
  icon,
  angle,
  delay,
  r,
  dim,
}) => {
  const rad = (angle * Math.PI) / 180;
  return (
    <div
      style={{
        position: "absolute",
        left: Math.cos(rad) * r,
        top: Math.sin(rad) * r,
        transform: "translate(-50%,-50%)",
      }}
    >
      <In delay={delay} cfg="bouncy" y={20} scale={0.6}>
        <Glass style={{ padding: "18px 26px", display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap", opacity: 1 - dim * 0.5 }}>
          <Icon name={icon} size={34} color={C.text} />
          <span style={{ ...body(30, 700), color: C.text }}>{label}</span>
        </Glass>
      </In>
    </div>
  );
};

export const S2Loop: React.FC = () => {
  const S = 9.0;
  const { frame, fps, at } = useScene(S);
  const R = 290;
  const breakP = ip(frame, [at(14.55), at(15.3)], [0, 1], theme.ease.inOut);
  const phase3 = at(17.6);
  const ringOut = ip(frame, [phase3, phase3 + 10], [1, 0], theme.ease.in);
  const speed = interpolate(frame, [at(12.6), at(14.0)], [1, 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.soft });
  const ang = (frame * 2.2 * speed) % 360;
  const dotRad = ((ang - 90) * Math.PI) / 180;
  const ringIn = spring({ frame: frame - 2, fps, config: theme.spring.smooth });
  const ringScale = interpolate(breakP, [0, 1], [1, 0.62]);
  const ringX = interpolate(breakP, [0, 1], [960, 470]);
  const day = frame < at(13.6) ? 1 : frame < at(13.95) ? 1 : 1; // o contador nunca avança: o ciclo recomeça
  const resetFlash = ip(frame, [at(13.4), at(13.6)], [0, 1]) * (1 - ip(frame, [at(13.7), at(14.2)], [0, 1]));
  const beam = ip(frame, [at(14.6), at(15.5)], [0, 1], theme.ease.out);
  // peças
  const piece = spring({ frame: frame - at(19.75), fps, config: theme.spring.bouncy });
  return (
    <AbsoluteFill>
      <div style={{ opacity: ringOut }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70 }}>
          <In delay={at(9.2)} outAt={at(14.5)} y={20}>
            <Eyebrow>O ciclo de quase todo mundo</Eyebrow>
          </In>
        </div>
        <div
          style={{
            position: "absolute",
            left: ringX,
            top: 520,
            transform: `scale(${ringScale * interpolate(ringIn, [0, 1], [0.8, 1])})`,
            opacity: Math.min(1, ringIn) * (1 - breakP * 0.55),
            filter: `saturate(${1 - breakP})`,
          }}
        >
          <svg width={R * 2 + 40} height={R * 2 + 40} style={{ position: "absolute", left: -R - 20, top: -R - 20, overflow: "visible" }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3} strokeDasharray="6 12" />
            <circle
              cx={R + 20}
              cy={R + 20}
              r={R}
              fill="none"
              stroke={C.accent}
              strokeWidth={4}
              strokeDasharray={`${2 * Math.PI * R * 0.18} ${2 * Math.PI * R}`}
              transform={`rotate(${ang - 90 - 64} ${R + 20} ${R + 20})`}
              strokeLinecap="round"
              opacity={0.85}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: Math.cos(dotRad) * R - 11,
              top: Math.sin(dotRad) * R - 11,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: C.accent,
              boxShadow: `0 0 30px ${C.accent}`,
            }}
          />
          <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
            <In delay={at(12.6)} cfg="bouncy" scale={0.5} y={0}>
              <div style={{ transform: `rotate(${-ang * 0.5}deg)`, display: "flex", justifyContent: "center" }}>
                <Icon name="loop" size={70} color={C.accent} stroke={2} />
              </div>
              <div style={{ ...display(60), marginTop: 10, transform: `scale(${1 + resetFlash * 0.15})` }}>DIA {day}</div>
              <div style={{ ...body(22, 600), color: C.textMute, letterSpacing: "0.2em" }}>DE NOVO</div>
            </In>
          </div>
          <RingNode label="Publicar vídeos" icon="video" angle={-90} delay={at(10.15)} r={R} dim={0} />
          <RingNode label="Torcer pra viralizar" icon="trend" angle={22} delay={at(11.3)} r={R} dim={0} />
          <RingNode label="Começar tudo de novo" icon="loop" angle={158} delay={at(12.85)} r={R} dim={0} />
        </div>

        {/* feixe dourado — "uma maneira diferente" */}
        <div
          style={{
            position: "absolute",
            left: 670,
            top: 519,
            height: 3,
            width: 260 * beam,
            background: `linear-gradient(90deg, transparent, ${C.primary})`,
            boxShadow: `0 0 20px ${C.primary}`,
            opacity: beam > 0 ? 1 : 0,
          }}
        />
        <div style={{ position: "absolute", left: 930, top: 360, width: 900 }}>
          <Words
            text="Existe uma maneira diferente"
            times={[at(14.6), at(14.9), at(15.1), at(15.4)]}
            hero={[3]}
            style={{ ...display(96), justifyContent: "flex-start" }}
            gap={24}
          />
          <div style={{ height: 22 }} />
          <Words
            text="de construir uma audiência."
            times={[at(15.9), at(16.2), at(16.6), at(16.8)]}
            style={{ ...display(56, 700), color: C.textDim, justifyContent: "flex-start" }}
            gap={14}
          />
        </div>
      </div>

      {/* "E talvez seja exatamente o que esteja faltando pra você." */}
      {frame > phase3 - 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 70 }}>
          <Words
            text="Talvez seja exatamente o que está faltando pra você."
            times={[at(17.8), at(18.1), at(18.4), at(19.1), at(19.5), at(19.5), at(19.8), at(20.2), at(20.4)]}
            hero={[6]}
            style={{ ...display(76), maxWidth: 1400 }}
            gap={20}
          />
          <div style={{ display: "flex", gap: 18 }}>
            {[0, 1, 2, 3].map((i) => {
              const isGold = i === 2;
              const p = isGold ? piece : spring({ frame: frame - phase3 - 4 - i * 4, fps, config: theme.spring.smooth });
              return (
                <div
                  key={i}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 26,
                    background: isGold ? C.primary : "rgba(255,255,255,0.07)",
                    border: isGold ? "none" : `1px solid ${C.stroke}`,
                    boxShadow: isGold ? `0 0 70px ${C.glow}` : undefined,
                    opacity: Math.min(1, p),
                    transform: `translateY(${interpolate(p, [0, 1], [isGold ? -260 : 30, 0])}px) rotate(${isGold ? interpolate(p, [0, 1], [-25, 0]) : 0}deg)`,
                    outline: isGold ? undefined : undefined,
                  }}
                />
              );
            })}
          </div>
          {/* contorno do encaixe vazio antes da peça cair */}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S3 · A dor (21.0 – 42.4s) ----------------
const Task: React.FC<{ icon: React.ComponentProps<typeof Icon>["name"]; label: string; delay: number; checkAt: number; resetAt: number; extra?: React.ReactNode }> = ({
  icon,
  label,
  delay,
  checkAt,
  resetAt,
}) => {
  const { frame, fps } = useScene(0);
  const chk = spring({ frame: frame - checkAt, fps, config: theme.spring.snappy }) * (1 - ip(frame, [resetAt, resetAt + 8], [0, 1]));
  return (
    <In delay={delay} x={-60} y={0} cfg="snappy">
      <Glass style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 28px", width: 620 }}>
        <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={34} color={C.text} />
        </div>
        <div style={{ ...body(34, 700), color: C.text, flex: 1 }}>{label}</div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: `2px solid ${chk > 0.5 ? C.textDim : C.stroke}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: `scale(${chk})` }}>
            <Icon name="check" size={30} color={C.textDim} stroke={3} />
          </div>
        </div>
      </Glass>
    </In>
  );
};

export const S3Pain: React.FC = () => {
  const S = 21.0;
  const { frame, fps, at } = useScene(S);
  const phaseB = at(24.3);
  const reset = at(40.5);
  const spinner = (frame * 9) % 360;
  // espectadores que passam e vão embora
  const viewers = Array.from({ length: 9 }).map((_, i) => {
    const s = at(32.0) + i * 9;
    const p = ip(frame, [s, s + 70], [0, 1], theme.ease.soft);
    return { i, p, y: 40 + ((i * 53) % 260) };
  });
  const cal = spring({ frame: frame - at(37.6), fps, config: theme.spring.smooth });
  const flip = ip(frame, [at(39.0), at(39.5)], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      {/* A — quantas vezes */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
        <Words
          text="Quantas vezes você já tentou crescer?"
          times={[at(21.6), at(21.9), at(22.3), at(22.6), at(22.8), at(23.1)]}
          hero={[5]}
          outAt={phaseB}
          style={{ ...display(92), maxWidth: 1300 }}
          gap={22}
        />
        <div style={{ position: "relative", display: "flex", gap: 22, opacity: 1 - ip(frame, [phaseB, phaseB + 10], [0, 1]) }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = ip(frame, [at(22.4) + i * 4, at(22.4) + i * 4 + 10], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 90 * p,
                  background: i === 4 ? C.accent : C.textMute,
                  borderRadius: 6,
                  ...(i === 4 ? { position: "absolute" as const, left: -20, top: 40, height: 10, width: 150 * p, transform: "rotate(-24deg)", transformOrigin: "0 50%" } : {}),
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {frame > phaseB - 2 && (
        <>
          <div style={{ position: "absolute", left: 160, top: 110, opacity: 1 - ip(frame, [at(37.3), at(37.6)], [0, 1]) * 0.75 }}>
            <In delay={phaseB} y={16}>
              <Eyebrow>A rotina de sempre</Eyebrow>
            </In>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
              <Task icon="search" label="Procurar tendências" delay={at(25.2)} checkAt={at(26.3)} resetAt={reset} />
              <Task icon="video" label="Criar vídeos" delay={at(26.45)} checkAt={at(27.3)} resetAt={reset} />
              <Task icon="scissors" label="Perder horas editando" delay={at(27.75)} checkAt={at(28.6)} resetAt={reset} />
              <Task icon="send" label="Publicar… e esperar" delay={at(28.9)} checkAt={at(29.5)} resetAt={reset} />
            </div>
          </div>

          {/* post genérico aguardando */}
          <div style={{ position: "absolute", left: 1040, top: 150, opacity: 1 - ip(frame, [at(37.3), at(37.7)], [0, 1]) }}>
            <In delay={at(29.6)} x={60} y={0}>
              <Glass style={{ width: 640, padding: 26 }}>
                <div style={{ height: 340, borderRadius: 18, background: "linear-gradient(135deg, #24212c, #15131a)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="video" size={90} color={C.textMute} stroke={1.6} />
                  </div>
                  {viewers.map((v) => (
                    <div
                      key={v.i}
                      style={{
                        position: "absolute",
                        top: v.y,
                        left: interpolate(v.p, [0, 1], [-80, 680]),
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4a4655, #2b2833)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        opacity: v.p > 0 && v.p < 1 ? interpolate(v.p, [0, 0.15, 0.45, 1], [0, 1, 1, 0]) : 0,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
                  <Icon name="eye" size={36} color={C.textDim} />
                  <svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: `rotate(${spinner}deg)` }}>
                    <circle cx="17" cy="17" r="13" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                    <path d="M17 4 a13 13 0 0 1 13 13" fill="none" stroke={C.textDim} strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <div style={{ ...body(28, 600) }}>esperando as visualizações…</div>
                </div>
              </Glass>
            </In>
            <div style={{ marginTop: 40, width: 640 }}>
              <Words
                text="Assistem… e vão embora."
                times={[at(35.7), at(36.4), at(36.7), at(36.8)]}
                hero={[]}
                style={{ ...display(68), color: C.text }}
                gap={18}
              />
            </div>
          </div>

          {/* D — no dia seguinte */}
          {frame > at(37.4) && (
            <div style={{ position: "absolute", left: 1120, top: 200 }}>
              <div style={{ opacity: Math.min(1, cal), transform: `translateY(${interpolate(cal, [0, 1], [60, 0])}px)` }}>
                <Glass style={{ width: 420, overflow: "hidden", padding: 0 }}>
                  <div style={{ height: 70, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", ...body(26, 800), color: "#fff", letterSpacing: "0.3em" }}>
                    DIA SEGUINTE
                  </div>
                  <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", perspective: 800 }}>
                    <div style={{ ...display(170), transform: `rotateX(${flip * 360}deg)` }}>{flip < 0.5 ? "1" : "1"}</div>
                  </div>
                </Glass>
              </div>
              <div style={{ marginTop: 44, width: 520 }}>
                <Words
                  text="Começar tudo novamente."
                  times={[at(40.5), at(40.9), at(41.5)]}
                  style={{ ...display(64), justifyContent: "flex-start" }}
                  gap={16}
                />
              </div>
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S4 · Participar (42.4 – 57.75s) ----------------
export const S4Participate: React.FC = () => {
  const S = 42.4;
  const { frame, fps, at } = useScene(S);
  const phaseB = at(48.9);
  const strike = ip(frame, [at(46.4), at(46.9)], [0, 1]);
  const P = { left: 250, top: 70, h: 920 };
  const g = phoneGeom(P.left, P.top, P.h);
  const bianca = TT.tiles[2];
  const bc = g.center(bianca);
  const gridC = g.center(TT.grid);
  const phoneC = { x: P.left + g.w / 2, y: P.top + g.h / 2 };
  const enter = spring({ frame: frame - phaseB, fps, config: theme.spring.slow });
  const cam = [
    { f: phaseB, x: phoneC.x + 380, y: phoneC.y, z: 1 },
    { f: at(50.4), x: phoneC.x + 380, y: phoneC.y, z: 1 },
    { f: at(51.4), x: bc.x + 260, y: bc.y, z: 1.6 },
    { f: at(54.9), x: bc.x + 260, y: bc.y, z: 1.6 },
    { f: at(55.8), x: gridC.x + 420, y: gridC.y - 60, z: 1.25 },
  ];
  const branch = ip(frame, [at(52.7), at(53.3)], [0, 1]);
  return (
    <AbsoluteFill>
      {/* A — assistir → participar */}
      {frame < phaseB + 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <In delay={at(42.7)} outAt={phaseB - 10} y={20}>
            <Eyebrow color={C.primary}>Agora, imagine</Eyebrow>
          </In>
          <div style={{ height: 50 }} />
          <In delay={at(44.6)} outAt={phaseB - 10} y={30}>
            <div style={{ position: "relative", ...display(150), color: interpolate(strike, [0, 1], [1, 0.35]) > 0.5 ? C.text : C.textMute }}>
              apenas assistir
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: "54%",
                  height: 10,
                  width: `${strike * 104}%`,
                  background: C.accent,
                  borderRadius: 6,
                }}
              />
            </div>
          </In>
          <div style={{ height: 10 }} />
          <In delay={at(47.5)} outAt={phaseB - 10} y={40} scale={0.8} cfg="bouncy">
            <div style={{ ...display(190), color: C.primary, textShadow: `0 0 80px ${C.glow}` }}>participar.</div>
          </In>
        </AbsoluteFill>
      )}

      {/* B — o público decide (prova: TikTok) */}
      {frame > phaseB - 2 && (
        <>
          <Camera keys={cam}>
            <Phone
              src={TT.src}
              left={P.left}
              top={P.top + interpolate(enter, [0, 1], [400, 0])}
              screenH={P.h}
              rotY={interpolate(enter, [0, 1], [30, 8]) + Math.sin(frame / 45) * 1.2}
              rotX={interpolate(enter, [0, 1], [20, 3])}
              opacity={Math.min(1, enter * 1.5)}
            >
              <Spotlight r={bianca} amount={ip(frame, [at(51.2), at(51.8)], [0, 1]) * (1 - ip(frame, [at(55.0), at(55.6)], [0, 1]))} pad={6} />
              <Tap x={bianca.x + bianca.w / 2} y={bianca.y + bianca.h / 2} at={at(51.2)} />
              <DrawRect x={bianca.x} y={bianca.y} w={bianca.w} h={bianca.h} r={10} delay={at(51.3)} outAt={at(55.0)} stroke={10} />
              {TT.tiles.map((t, i) => (
                <DrawRect key={i} x={t.x + 6} y={t.y + 6} w={t.w - 12} h={t.h - 12} r={10} delay={at(55.6) + i * 6} stroke={9} />
              ))}
            </Phone>
          </Camera>

          {/* painel direito em espaço de tela */}
          <div style={{ position: "absolute", left: 1010, top: 170, width: 820 }}>
            <In delay={at(49.1)} outAt={at(55.0)} y={16}>
              <Eyebrow color={C.textDim}>Uma história em que</Eyebrow>
            </In>
            <div style={{ height: 26 }} />
            <Words
              text="o público decide."
              times={[at(50.7), at(51.0), at(51.2)]}
              hero={[2]}
              outAt={at(55.0)}
              style={{ ...display(96), justifyContent: "flex-start" }}
              gap={24}
            />
            {/* bifurcação real do episódio: Bianca ou Seu Otávio? */}
            <div style={{ position: "relative", height: 300, marginTop: 30, opacity: 1 - ip(frame, [at(55.0), at(55.4)], [0, 1]) }}>
              <svg width="820" height="300" style={{ position: "absolute", left: 0, top: 0 }}>
                <path d="M10 150 C 160 150, 180 60, 330 60" stroke={C.textDim} strokeWidth="3" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - branch)} />
                <path d="M10 150 C 160 150, 180 240, 330 240" stroke={C.textDim} strokeWidth="3" fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - branch)} />
                <circle cx="10" cy="150" r={10 * branch} fill={C.text} />
              </svg>
              <div style={{ position: "absolute", left: 350, top: 28 }}>
                <In delay={at(53.0)} cfg="snappy" x={-30} y={0}>
                  <Glass style={{ padding: "14px 26px", ...body(32, 700), color: C.text }}>Bianca?</Glass>
                </In>
              </div>
              <div style={{ position: "absolute", left: 350, top: 208 }}>
                <In delay={at(53.2)} cfg="snappy" x={-30} y={0}>
                  <Glass style={{ padding: "14px 26px", ...body(32, 700), color: C.text }}>Seu Otávio?</Glass>
                </In>
              </div>
              {/* comentários (ícones) */}
              {[0, 1, 2, 3, 4].map((i) => {
                const d = at(53.8) + i * 4;
                const p = spring({ frame: frame - d, fps, config: theme.spring.bouncy });
                const fl = Math.sin((frame + i * 20) / 18) * 6;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 610 + (i % 2) * 90 + i * 12,
                      top: 20 + i * 52 + fl,
                      opacity: Math.min(1, p),
                      transform: `scale(${p})`,
                    }}
                  >
                    <div style={{ width: 66, height: 66, borderRadius: 20, background: "rgba(255,255,255,0.08)", border: `1px solid ${C.stroke}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="chat" size={34} color={C.text} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 330, width: 820 }}>
            <Words
              text="Cada episódio puxa o próximo."
              times={[at(55.6), at(56.0), at(56.2), at(56.7), at(56.9)]}
              hero={[1]}
              style={{ ...display(62), justifyContent: "flex-start" }}
              gap={22}
            />
            <div style={{ height: 30 }} />
            <In delay={at(56.4)} y={20}>
              <div style={{ ...body(30, 600), display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: C.text }} />
                Perfil real no TikTok · @ricardopelosalao
              </div>
            </In>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------- S5 · Prova Instagram (57.75 – 64.9s) ----------------
const Stat: React.FC<{ value: string; label: string; delay: number; outAt?: number; big?: boolean; hero?: boolean }> = ({ value, label, delay, outAt, big, hero }) => (
  <In delay={delay} outAt={outAt} x={50} y={0} cfg="snappy">
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ ...display(big ? 132 : 72), color: hero ? C.primary : C.text, textShadow: hero ? `0 0 60px ${C.glow}` : undefined, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ ...body(big ? 32 : 26, 600) }}>{label}</div>
    </div>
  </In>
);

export const S5ProofIG: React.FC = () => {
  const S = 57.75;
  const { frame, fps, at } = useScene(S);
  const P = { left: 230, top: 60, h: 960 };
  const g = phoneGeom(P.left, P.top, P.h);
  const t264 = IG.tiles[0];
  const c264 = g.center(t264);
  const gridC = g.center(IG.grid);
  const pain = g.center(IG.painel);
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  const cam = [
    { f: 0, x: gridC.x + 420, y: gridC.y - 60, z: 1.35 },
    { f: at(59.3), x: gridC.x + 420, y: gridC.y - 40, z: 1.4 },
    { f: at(60.1), x: c264.x + 330, y: c264.y - 40, z: 1.7 },
    { f: at(62.4), x: c264.x + 330, y: c264.y - 40, z: 1.7 },
    { f: at(63.1), x: pain.x + 300, y: pain.y + 120, z: 1.45 },
  ];
  return (
    <AbsoluteFill>
      <Camera keys={cam}>
        <Phone src={IG.src} left={P.left} top={P.top + interpolate(enter, [0, 1], [120, 0])} screenH={P.h} rotY={6 + Math.sin(frame / 50)} rotX={2}>
          <Spotlight r={t264} amount={ip(frame, [at(59.5), at(60.0)], [0, 1]) * (1 - ip(frame, [at(62.5), at(63.0)], [0, 1]))} pad={4} />
          <DrawRect x={t264.x + 6} y={t264.y + 6} w={t264.w - 12} h={t264.h - 12} r={10} delay={at(59.6)} outAt={at(62.6)} stroke={10} />
          <Spotlight r={IG.painel} amount={ip(frame, [at(62.9), at(63.4)], [0, 1])} pad={6} />
          <DrawRect {...IG.painel} delay={at(63.0)} r={22} stroke={9} />
        </Phone>
      </Camera>
      <div style={{ position: "absolute", left: 1080, top: 150, width: 760 }}>
        <In delay={at(57.9)} y={16}>
          <Eyebrow>Capturas reais · Instagram</Eyebrow>
        </In>
        <div style={{ height: 26 }} />
        <Words
          text="Não apenas publicando vídeos…"
          times={[at(58.4), at(59.1), at(59.5), at(60.2)]}
          outAt={at(60.9)}
          style={{ ...display(64, 700), color: C.textDim, justifyContent: "flex-start" }}
          gap={16}
        />
      </div>
      <div style={{ position: "absolute", left: 1080, top: 240, width: 760 }}>
        <Words
          text="construindo uma história."
          times={[at(61.3), at(61.9), at(62.1)]}
          hero={[2]}
          style={{ ...display(84), justifyContent: "flex-start" }}
          gap={20}
        />
      </div>
      <div style={{ position: "absolute", left: 1080, top: 430, width: 760, display: "flex", flexDirection: "column", gap: 28 }}>
        <Stat value="264 mil" label="visualizações em um único Reel" delay={at(59.8)} outAt={at(62.7)} big />
      </div>
      <div style={{ position: "absolute", left: 1080, top: 430, width: 760, display: "flex", flexDirection: "column", gap: 34 }}>
        <Stat value="337,0 mil" label="visualizações nos últimos 30 dias" delay={at(63.0)} big />
        <div style={{ display: "flex", gap: 60 }}>
          <Stat value="10,1 mil" label="seguidores" delay={at(63.4)} />
          <Stat value="5" label="posts" delay={at(63.6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { Crop };
