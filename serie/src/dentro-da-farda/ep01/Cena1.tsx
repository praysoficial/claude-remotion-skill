// Cena1.tsx — gancho no estacionamento (falas 01–06), o celular, a lembrança do
// Victor e a apresentação do Arthur (fala 07).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { POSES, Pose, mixPose, somaPose } from "../../personagem/pose";
import { Arthur, Diego, Victor, juntaNaTela } from "../personagens/Elenco";
import { Estacionamento, FeixeLanterna } from "../cenarios/Estacionamento";
import { tema } from "../tema";
import { CENA, Camera, FALA, M, PERFIL, TL, andar, cintila, gestoDeFala, palavra, passo, prog, respira, tremor, voz } from "./base";

const C = tema.cor;
const CHAO = 1430;
const ESC = 1.3;

// ── fundo com goteira e pisca-alerta sincronizados ao som ────────────────────
const Fundo: React.FC<{ t: number }> = ({ t }) => {
  const rele = (TL as { rele_periodo?: number }).rele_periodo ?? 0.55;
  const k = Math.floor((t - 0.2) / rele);
  const alerta = t >= 0.2 && k % 2 === 0 ? 1 : 0;
  const gotas = (TL as { gotas?: number[] }).gotas ?? [];
  // a gota leva 0.45 s para cair; o som toca quando ela toca a poça
  let gota = -1, respingo = 0;
  for (const g of gotas) {
    if (t >= g - 0.45 && t < g) gota = (t - (g - 0.45)) / 0.45;
    if (t >= g && t < g + 0.5) respingo = (t - g) / 0.5;
  }
  return (
    <Estacionamento
      t={t}
      alerta={alerta}
      lampadas={[cintila(t, "l1"), cintila(t, "l2", [[2.6, 3.1], [17.5, 18.0]])]}
      gota={gota}
      respingo={respingo}
    />
  );
};

// ── celular em close: áudio não enviado do Victor ───────────────────────────
const TelaCelular: React.FC<{ t: number }> = ({ t }) => {
  const f = FALA["04"];
  const tocando = t >= f.ini;
  const progresso = Math.min(1, Math.max(0, (t - f.ini) / f.dur));
  const N = 34;
  const barras = Array.from({ length: N }).map((_, i) => {
    const j = Math.floor((i / N) * f.env.length);
    return 0.15 + 0.85 * (f.env[j] ?? 0);
  });
  const seg = Math.floor(Math.max(0, t - f.ini));
  const toque = interpolate(t, [M.play - 0.15, M.play, M.play + 0.25], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tr = tremor(t, "cel", 0.6);
  const cortou = t >= M.audio_corta - 0.05;
  return (
    <AbsoluteFill style={{ background: "#020305" }}>
      <div style={{ position: "absolute", left: 540 - 330 + tr.x, top: 330 + tr.y, width: 660, height: 1260, borderRadius: 70, background: "#0A0C11", boxShadow: `0 0 120px ${C.ciano}33` }}>
        <div style={{ position: "absolute", inset: 22, borderRadius: 52, background: "linear-gradient(180deg,#0E1622,#060A10)", overflow: "hidden" }}>
          <div style={{ padding: "70px 46px 0", color: C.texto, fontFamily: tema.fonte.texto }}>
            <div style={{ fontWeight: 800, fontSize: 46 }}>Victor S.</div>
            <div style={{ fontWeight: 600, fontSize: 26, color: C.textoFraco, marginTop: 6 }}>visto por último há 3 dias</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 520, height: 170, borderRadius: 30, background: "#13202C", border: `2px solid ${C.ciano}55`, display: "flex", alignItems: "center", padding: "0 26px", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: C.ciano, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {tocando && !cortou ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 10, height: 34, background: "#061018" }} />
                  <div style={{ width: 10, height: 34, background: "#061018" }} />
                </div>
              ) : (
                <div style={{ width: 0, height: 0, borderLeft: "30px solid #061018", borderTop: "19px solid transparent", borderBottom: "19px solid transparent", marginLeft: 8 }} />
              )}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, height: 100 }}>
              {barras.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 4, background: i / N <= progresso ? C.ciano : "#3C5566" }} />
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 46, top: 712, fontFamily: tema.fonte.mono, fontWeight: 500, fontSize: 28, color: C.textoFraco }}>
            0:0{Math.min(6, seg)} · áudio não enviado
          </div>
          {cortou && (
            <div style={{ position: "absolute", left: 46, top: 770, fontFamily: tema.fonte.mono, fontWeight: 700, fontSize: 28, color: C.vermelho }}>
              gravação interrompida
            </div>
          )}
        </div>
      </div>
      {/* polegar do Arthur no play */}
      <div style={{ position: "absolute", left: 210 + tr.x, top: 940 + tr.y + (1 - toque) * 60, width: 150, height: 200, borderRadius: 75, background: C.boneco, opacity: t < M.play + 0.9 ? 1 : 0, boxShadow: "0 20px 40px #000" }} />
    </AbsoluteFill>
  );
};

// ── lembrança: Victor no carro, gravando o áudio ─────────────────────────────
const Lembranca: React.FC<{ t: number }> = ({ t }) => {
  const f = FALA["04"];
  const v = voz("VICTOR", t);
  const olha = prog(t, palavra("04", "tem") - 0.2, palavra("04", "tem") + 0.6); // vira a cabeça pra trás
  const farol = interpolate(t, [palavra("04", "dentro") - 0.1, palavra("04", "dentro") + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pose: Pose = somaPose(
    {
      tronco: 6, cabeca: -4,
      bracoEsq: { ombro: 40, cotovelo: 118 }, bracoDir: { ombro: 30, cotovelo: 60 },
      pernaEsq: { quadril: 85, joelho: 85 }, pernaDir: { quadril: 80, joelho: 88 },
    },
    { cabeca: v * 4 - olha * 22, tronco: -olha * 6 },
  );
  const luzes = (t - f.ini) * 900;
  return (
    <AbsoluteFill style={{ background: "#03060A" }}>
      {/* rua passando pela janela */}
      <div style={{ position: "absolute", left: 70, top: 360, width: 940, height: 620, borderRadius: 40, overflow: "hidden", background: "linear-gradient(180deg,#0A1824,#05090E)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", top: 120 + (i % 3) * 90, left: ((i * 380 - luzes) % 1500) + 900, width: 220, height: 10, borderRadius: 5, background: C.ciano, opacity: 0.35 }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: farol * (1 - farol) * 2.4 }} />
      </div>
      <Victor pose={pose} x={600} chao={1760} escala={2.15} vista="perfil" espelhar objeto="celularAceso" luz={{ lado: 1, cor: C.luzCiano, forca: 0.95 }} />
      {/* porta e painel do carro cobrindo as pernas */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, bottom: 0, background: "linear-gradient(180deg,#0C1118,#04060A)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, height: 10, background: "#1E2633" }} />
      {/* tom de lembrança: ciano frio e linhas de varredura */}
      <AbsoluteFill style={{ background: C.ciano, mixBlendMode: "color", opacity: 0.35 }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 6px)" }} />
    </AbsoluteFill>
  );
};

// ── estacionamento: Arthur e Diego ────────────────────────────────────────────
const Garagem: React.FC<{ t: number }> = ({ t }) => {
  // ARTHUR — agachado varrendo a lanterna; acha o celular; levanta e vira pro Diego
  const achou = M.celular_achado;
  const levanta = prog(t, achou + 0.35, achou + 0.95);
  const alcanca = interpolate(t, [achou - 0.6, achou - 0.1, achou + 0.35], [0, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: tema.ease.inOut });
  const viraPraDiego = t >= FALA["02"].ini - 0.05;
  const toque = interpolate(t, [M.play - 0.2, M.play, M.play + 0.2], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const encolhe = prog(t, FALA["06"].ini, FALA["06"].ini + 0.5); // "É." — ombros caem
  let poseA: Pose = mixPose(PERFIL.agachado, PERFIL.parado, levanta);
  poseA = somaPose(poseA, {
    bracoEsq: { ombro: alcanca * 50, cotovelo: -alcanca * 25 },
    bracoDir: { ombro: (1 - levanta) * Math.sin(t * 1.6) * 12 },
  });
  if (viraPraDiego) {
    // segura o celular aceso entre os dois
    const mostra = prog(t, FALA["02"].ini, FALA["02"].ini + 0.5) * (1 - prog(t, FALA["06"].ini - 0.3, FALA["06"].ini + 0.4) * 0.6);
    poseA = somaPose(poseA, {
      bracoEsq: { ombro: 55 * mostra + toque * 6, cotovelo: 45 * mostra },
      bracoDir: { ombro: -6 },
      cabeca: 10 * mostra + encolhe * 14,
      tronco: encolhe * 4,
    });
  }
  poseA = somaPose(poseA, gestoDeFala("ARTHUR", t));
  poseA = somaPose(poseA, respira(t, 0.4));
  const lanternaLigada = t < achou + 0.9;
  const optA = { x: 400, chao: CHAO, escala: ESC, vista: "perfil" as const, espelhar: viraPraDiego };
  const mao = juntaNaTela("arthur", poseA, optA, (e) => e.bracoDir[2]);
  const alvoX = 700 + Math.sin(t * 1.2) * 70 + (t > achou - 0.8 ? 30 : 0);

  // DIEGO — entra pela esquerda, debruça no ombro do Arthur, depois se endireita
  const ent = andar(t, FALA["02"].ini + 0.6, FALA["03"].ini - 0.15, -200, 40, 110);
  const debruca = prog(t, FALA["03"].ini - 0.2, FALA["03"].ini + 0.4) * (1 - prog(t, FALA["05"].ini - 0.1, FALA["05"].ini + 1.2));
  let poseD: Pose = somaPose(PERFIL.parado, passo(ent.fase, ent.andando));
  poseD = mixPose(poseD, PERFIL.inclinado, debruca);
  const brinca = prog(t, palavra("03", "deve") - 0.2, palavra("03", "deve") + 0.3) * (1 - prog(t, FALA["03"].fim, FALA["03"].fim + 0.5));
  poseD = somaPose(poseD, { bracoEsq: { ombro: brinca * 45, cotovelo: brinca * 50 }, cabeca: brinca * -6 });
  const endireita = prog(t, FALA["05"].ini - 0.1, FALA["05"].ini + 1.2);
  poseD = somaPose(poseD, { cabeca: endireita * -8, bracoDir: { ombro: endireita * 30, cotovelo: endireita * 110 } }); // mão na nuca
  poseD = somaPose(poseD, gestoDeFala("DIEGO", t, 1.3));
  poseD = somaPose(poseD, respira(t, 1.7));

  // câmera: abre fechada na porta (gancho) e vai abrindo
  const tr = tremor(t, "c1", 0.8);
  const zoom = interpolate(t, [0, 4.4, 8, 17.4, 21.5], [1.55, 1.3, 1.15, 1.12, 1.2], { easing: tema.ease.inOut, extrapolateRight: "clamp" });
  const fx = interpolate(t, [0, 4.4, 8, 21.5], [560, 480, 420, 380], { easing: tema.ease.inOut, extrapolateRight: "clamp" });
  const fy = interpolate(t, [0, 4.4, 8, 21.5], [1140, 1080, 1050, 1000], { easing: tema.ease.inOut, extrapolateRight: "clamp" });

  return (
    <Camera x={fx + tr.x} y={fy + tr.y} zoom={zoom}>
      <Fundo t={t} />
      {lanternaLigada && <FeixeLanterna x0={mao.x} y0={mao.y} x1={alvoX} y1={1110} forca={1 - prog(t, achou + 0.4, achou + 0.9)} />}
      <Diego pose={poseD} x={ent.x} chao={CHAO} escala={ESC} vista="perfil" luz={{ lado: 1, cor: C.luzFria, forca: 0.75 }} />
      <Arthur
        pose={poseA}
        {...optA}
        objeto={t >= achou ? "celularAceso" : null}
        objetoDir={lanternaLigada ? "lanterna" : null}
        luz={{ lado: viraPraDiego ? -1 : 1, cor: t >= achou ? C.luzCiano : C.luzQuente, forca: 0.8 }}
      />
    </Camera>
  );
};

// ── apresentação: Arthur de frente, iluminado de baixo pelo celular ──────────
const Apresentacao: React.FC<{ t: number }> = ({ t }) => {
  const c = CENA.arthur;
  const olhaCelular = prog(t, palavra("07", "polícia") - 0.3, palavra("07", "polícia") + 0.3);
  const guarda = prog(t, c.fim - 0.55, c.fim - 0.1);
  let pose: Pose = somaPose(POSES.neutro, {
    bracoEsq: { ombro: 22 - guarda * 14, cotovelo: 112 - guarda * 70 },
    bracoDir: { ombro: 10 },
    cabeca: -olhaCelular * 8,
    tronco: olhaCelular * -2,
  });
  pose = somaPose(pose, respira(t, 0.4));
  // Diego, ao fundo, levanta as mãos: "não vi nada"
  const maos = prog(t, palavra("07", "polícia") + 0.1, palavra("07", "polícia") + 0.6);
  const poseD = somaPose(POSES.neutro, {
    bracoEsq: { ombro: maos * 140, cotovelo: -maos * 55 },
    bracoDir: { ombro: maos * 140, cotovelo: -maos * 55 },
    cabeca: maos * 6,
  });
  const zoom = interpolate(t, [c.ini, c.fim], [1.0, 1.14], { easing: tema.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera x={560} y={860} zoom={zoom}>
      <AbsoluteFill style={{ filter: "blur(6px) brightness(0.55)", transform: "scale(1.15)" }}>
        <Fundo t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(2px) brightness(0.6)" }}>
        <Diego pose={poseD} x={250} chao={1300} escala={1.1} luz={{ lado: 1, cor: C.luzFria, forca: 0.7 }} />
      </AbsoluteFill>
      <Arthur
        pose={pose}
        x={600}
        chao={1370}
        escala={1.45}
        objeto={guarda < 0.95 ? "celularAceso" : null}
        luz={{ lado: 1, cor: C.luzCiano, forca: 0.9 * (1 - guarda * 0.5), deBaixo: true }}
      />
    </Camera>
  );
};

export const Cena1: React.FC<{ t: number }> = ({ t }) => {
  // montagem: garagem → close do celular → lembrança → celular → corte seco → garagem
  const fb0 = palavra("04", "não") - 0.15; // entra a lembrança
  const fb1 = palavra("04", "que") - 0.35; // volta pro celular
  if (t >= CENA.arthur.ini) return <Apresentacao t={t} />;
  if (t >= M.play + 0.3 && t < M.audio_corta) {
    if (t >= fb0 && t < fb1) return <Lembranca t={t} />;
    return <TelaCelular t={t} />;
  }
  // 3 frames de preto no corte do áudio: o silêncio pesa
  if (t >= M.audio_corta && t < M.audio_corta + 0.1) return <AbsoluteFill style={{ background: "#000" }} />;
  return <Garagem t={t} />;
};
