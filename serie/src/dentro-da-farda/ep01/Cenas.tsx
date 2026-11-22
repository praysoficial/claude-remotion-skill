// Cenas.tsx — cenas 3 a 7 do episódio 1 (falas 08–27).
// Todos os tempos vêm de timeline.json (FALA, M, palavra): mudou o áudio, a cena acompanha.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { POSES, Pose, mixPose, somaPose } from "../../personagem/pose";
import { Arthur, Diego, Helena, Mendes, Seguranca } from "../personagens/Elenco";
import { Corredor, MesaInterrogatorio, MesaMendes, RuaNoite, SalaInterrogatorio, SalaMendes } from "../cenarios/Delegacia";
import { tema } from "../tema";
import { CENA, Camera, FALA, M, PERFIL, andar, cintila, gestoDeFala, palavra, passo, prog, respira, tremor } from "./base";

const C = tema.cor;
const fria = (forca = 0.7) => ({ lado: 1 as const, cor: C.luzFria, forca });

// pose de frente, sentado atrás da mesa (as pernas ficam escondidas)
const SENTADO_FRENTE: Pose = {
  ...POSES.neutro,
  bracoEsq: { ombro: 20, cotovelo: 60 },
  bracoDir: { ombro: 20, cotovelo: 60 },
  pernaEsq: { quadril: 10, joelho: 0 },
  pernaDir: { quadril: 10, joelho: 0 },
};
const SENTADO_PERFIL: Pose = {
  tronco: 4, cabeca: 6,
  bracoEsq: { ombro: 50, cotovelo: 50 }, bracoDir: { ombro: 40, cotovelo: 60 },
  pernaEsq: { quadril: 88, joelho: 88 }, pernaDir: { quadril: 84, joelho: 90 },
};

// ── CENA 3 · Sala do Mendes (falas 08–13) ─────────────────────────────────────
export const CenaSala: React.FC<{ t: number }> = ({ t }) => {
  const c = CENA.sala;
  // MENDES: autoridade parada; inclina no prazo, estende a mão, fecha a mão com o celular
  const inclina = prog(t, M.contador - 0.3, M.contador + 0.3) * (1 - prog(t, FALA["09"].ini, FALA["09"].ini + 0.6));
  const mao = prog(t, M.mao_estendida - 0.35, M.mao_estendida + 0.15) * (1 - prog(t, M.entrega_celular + 0.4, M.entrega_celular + 1.2));
  const agora = prog(t, FALA["12"].ini - 0.1, FALA["12"].ini + 0.25) * (1 - prog(t, M.entrega_celular, M.entrega_celular + 0.6));
  const guarda = prog(t, M.entrega_celular + 1.2, M.entrega_celular + 2.0);
  let poseM: Pose = somaPose(SENTADO_FRENTE, {
    bracoDir: { ombro: mao * 58 - guarda * 10, cotovelo: -mao * 40 + guarda * 30 },
    bracoEsq: { ombro: inclina * 10, cotovelo: inclina * 30 },
    cabeca: agora * 8 - inclina * 3,
  });
  poseM = somaPose(poseM, gestoDeFala("MENDES", t, 0.6));
  poseM = somaPose(poseM, respira(t, 2.2));
  const escM = 1.32 + inclina * 0.04 + agora * 0.05;
  const temCelular = t >= M.entrega_celular + 0.15 && guarda < 0.9;

  // ARTHUR: em pé à esquerda, de perfil; "E depois?" dá meio passo; mão no bolso e trava; entrega
  const depois = prog(t, FALA["09"].ini - 0.1, FALA["09"].ini + 0.25) * (1 - prog(t, FALA["10"].ini + 0.5, FALA["10"].ini + 1.2));
  const bolso = prog(t, FALA["11"].ini, FALA["11"].ini + 0.4) * (1 - prog(t, M.entrega_celular - 0.6, M.entrega_celular - 0.2));
  const vaiEntregar = andar(t, M.entrega_celular - 0.7, M.entrega_celular - 0.05, 150, 215, 90);
  const estende = prog(t, M.entrega_celular - 0.4, M.entrega_celular) * (1 - prog(t, M.entrega_celular + 0.25, M.entrega_celular + 0.7));
  const sai = andar(t, palavra("13", "celular") - 0.2, c.fim, 215, -80, 100);
  const virou = t >= palavra("13", "celular") - 0.25;
  const tocaBolso = prog(t, M.toca_bolso - 0.3, M.toca_bolso + 0.1) * (1 - prog(t, M.toca_bolso + 0.9, M.toca_bolso + 1.3));
  let poseA: Pose = somaPose(PERFIL.parado, {
    tronco: depois * 6,
    bracoEsq: { ombro: depois * 30 + estende * 75 - bolso * 25, cotovelo: depois * 40 + bolso * 70 - estende * 30 },
    bracoDir: { ombro: depois * 20, cotovelo: depois * 30 },
  });
  poseA = somaPose(poseA, passo(vaiEntregar.fase, vaiEntregar.andando));
  poseA = somaPose(poseA, passo(sai.fase, sai.andando));
  if (virou) poseA = somaPose(poseA, { bracoDir: { ombro: -tocaBolso * 35, cotovelo: tocaBolso * 30 }, cabeca: tocaBolso * -6 });
  poseA = somaPose(poseA, gestoDeFala("ARTHUR", t));
  poseA = somaPose(poseA, respira(t, 0.4));
  const xA = virou ? sai.x : t >= M.entrega_celular - 0.7 ? vaiEntregar.x : 150;
  const arthurComCelular = t < M.entrega_celular + 0.15 && t >= M.entrega_celular - 0.6;

  // pasta deslizando pela mesa
  const pasta = prog(t, M.pasta_empurrada, M.pasta_empurrada + 0.6, tema.ease.out);

  // câmera
  const tr = tremor(t, "sala", 0.4);
  const pushPrazo = prog(t, M.contador - 0.6, M.contador + 0.4) * (1 - prog(t, FALA["09"].ini - 0.05, FALA["09"].ini + 0.05));
  const pushAgora = prog(t, FALA["12"].ini - 0.05, FALA["12"].ini + 0.4) * (1 - prog(t, M.entrega_celular - 0.2, M.entrega_celular + 0.3));
  const segue = prog(t, palavra("13", "celular"), c.fim);
  const zoom = 1.0 + pushPrazo * 0.32 + pushAgora * 0.42 + segue * 0.12 + prog(t, c.ini, c.ini + 4) * 0.04;
  const fx = 540 + pushPrazo * 120 + pushAgora * 110 - segue * 260;
  const fy = 1010 - pushPrazo * 90 - pushAgora * 110;

  return (
    <Camera x={fx + tr.x} y={fy + tr.y} zoom={zoom}>
      <SalaMendes luzRua={cintila(t, "rua")} />
      <Mendes pose={poseM} x={660} chao={1420} escala={escM} luz={{ lado: -1, cor: C.luzQuente, forca: 0.85 }} objetoDir={temCelular ? "celular" : null} />
      <MesaMendes />
      {/* pasta do caso sobre a mesa */}
      <div style={{ position: "absolute", left: 600 - pasta * 260, top: 1150, width: 150, height: 34, background: "#6B5A3E", transform: "skewX(-30deg)", boxShadow: "0 6px 10px #000" }} />
      <Arthur
        pose={poseA}
        x={xA}
        chao={1440}
        escala={1.3}
        vista="perfil"
        espelhar={virou}
        objeto={arthurComCelular ? "celular" : null}
        luz={{ lado: 1, cor: C.luzQuente, forca: 0.85 }}
      />
      {/* brilho do próprio celular no bolso de trás (a cópia do áudio) */}
      {virou && tocaBolso > 0 && (
        <div style={{ position: "absolute", left: xA + 10, top: 1180, width: 60, height: 60, borderRadius: 30, background: C.ciano, opacity: 0.35 * tocaBolso, filter: "blur(10px)" }} />
      )}
    </Camera>
  );
};

// ── CENA 4 · Corredor com a Helena (falas 14–18) ─────────────────────────────
export const CenaCorredor: React.FC<{ t: number }> = ({ t }) => {
  const c = CENA.corredor;
  // ARTHUR entra pela direita e trava no meio do passo quando ela fala
  const ent = andar(t, c.ini - 0.4, FALA["14"].ini + 0.05, 1180, 700, 110);
  const avanca = andar(t, FALA["17"].ini - 0.1, FALA["17"].fim, 700, 600, 100);
  const susto = prog(t, FALA["15"].ini - 0.1, FALA["15"].ini + 0.3) * (1 - prog(t, FALA["16"].fim, FALA["16"].fim + 0.6));
  const estende = prog(t, FALA["17"].ini, FALA["17"].ini + 0.5) * (1 - prog(t, FALA["18"].ini, FALA["18"].ini + 1.0));
  const murcha = prog(t, FALA["18"].ini + 0.2, FALA["18"].fim);
  let poseA: Pose = somaPose(PERFIL.parado, passo(ent.fase, ent.andando));
  poseA = somaPose(poseA, passo(avanca.fase, avanca.andando * 0.7));
  poseA = somaPose(poseA, {
    tronco: -susto * 6 + murcha * 6,
    cabeca: -susto * 6 + murcha * 12,
    bracoEsq: { ombro: estende * 55, cotovelo: estende * 10 },
  });
  poseA = somaPose(poseA, gestoDeFala("ARTHUR", t));
  poseA = somaPose(poseA, respira(t, 0.4));
  const xA = t < FALA["17"].ini - 0.1 ? ent.x : avanca.x;

  // HELENA encostada na parede, braços cruzados; aponta o bolso; vira e sai
  const virou = t >= M.helena_vira;
  const aponta = prog(t, palavra("16", "apaga") - 0.25, palavra("16", "apaga") + 0.1) * (1 - prog(t, M.helena_vira - 0.3, M.helena_vira));
  const anda1 = andar(t, M.helena_vira, M.helena_para, 260, 190, 90);
  const anda2 = andar(t, M.helena_sai, c.fim - 0.2, 190, -260, 110);
  let poseH: Pose;
  let xH = 260;
  if (!virou) {
    poseH = somaPose(mixPose(POSES.bracosCruzados, POSES.neutro, aponta * 0.6), {
      tronco: -5,
      bracoEsq: { ombro: aponta * 70, cotovelo: -aponta * 10 },
    });
    poseH = somaPose(poseH, gestoDeFala("HELENA", t, 0.7));
  } else {
    const parou = t >= M.helena_para && t < M.helena_sai;
    poseH = somaPose(PERFIL.parado, passo(t < M.helena_sai ? anda1.fase : anda2.fase, t < M.helena_sai ? anda1.andando : anda2.andando));
    poseH = somaPose(poseH, { cabeca: parou ? 6 : 0, tronco: parou ? 2 : 0 });
    xH = t < M.helena_sai ? anda1.x : anda2.x;
  }
  poseH = somaPose(poseH, respira(t, 1.1));
  const balanco = virou ? (t < M.helena_sai ? anda1.fase : anda2.fase) : 0;

  // a lâmpada falha no silêncio depois da pergunta
  const falha: [number, number][] = [[M.helena_para + 0.2, M.helena_para + 0.75]];
  const lamp: [number, number, number] = [cintila(t, "c1"), cintila(t, "c2", falha), cintila(t, "c3")];

  const pushFim = prog(t, FALA["18"].ini - 0.2, c.fim);
  const zoom = 1.04 + prog(t, c.ini, FALA["17"].fim) * 0.08 + pushFim * 0.22;
  const fx = 540 - prog(t, c.ini, FALA["14"].fim) * 60 + pushFim * 90;
  const fy = 1060 - pushFim * 60;
  const tr = tremor(t, "cor", 0.4);

  return (
    <Camera x={fx + tr.x} y={fy + tr.y} zoom={zoom}>
      <Corredor lampadas={lamp} luzInterrogatorio={0.6} luzSaida={0.6} />
      <Helena pose={poseH} x={xH} chao={1430} escala={1.25} vista={virou ? "perfil" : "frente"} espelhar={virou} balanco={balanco} luz={fria(0.75)} />
      <Arthur pose={poseA} x={xA} chao={1440} escala={1.3} vista="perfil" espelhar luz={fria(0.75)} />
    </Camera>
  );
};

// ── CENA 5 · A testemunha (falas 19–24) ──────────────────────────────────────
export const CenaTestemunha: React.FC<{ t: number }> = ({ t }) => {
  const c = CENA.testemunha;
  const closeJanela = 1 - prog(t, palavra("19", "diego") - 0.6, palavra("19", "diego") + 0.3);
  const closeRelogio = t >= M.tic_relogio - 0.05 && t < FALA["23"].ini - 0.2;
  const virouFrente = t >= FALA["23"].ini - 0.2;

  // DIEGO entra gesticulando
  const entD = andar(t, palavra("19", "diego") - 0.3, FALA["20"].ini - 0.05, -220, 250, 110);
  const fala20 = prog(t, FALA["20"].ini, FALA["20"].ini + 0.3) * (1 - prog(t, FALA["20"].fim, FALA["20"].fim + 0.5));
  const abana = Math.sin(t * 7) * fala20;
  let poseD: Pose = somaPose(PERFIL.parado, passo(entD.fase, entD.andando));
  poseD = somaPose(poseD, {
    bracoEsq: { ombro: 60 * fala20 + abana * 25, cotovelo: 60 * fala20 },
    bracoDir: { ombro: 40 * fala20 - abana * 20, cotovelo: 80 * fala20 },
    tronco: fala20 * 5,
  });
  poseD = somaPose(poseD, gestoDeFala("DIEGO", t, 1.4));
  poseD = somaPose(poseD, respira(t, 1.7));
  // depois do relógio: Diego de frente, aponta a sala de interrogatório (esquerda)
  const aponta = prog(t, FALA["23"].ini, FALA["23"].ini + 0.35);
  let poseD2: Pose = somaPose(POSES.neutro, { bracoDir: { ombro: aponta * 85, cotovelo: -aponta * 5 }, cabeca: -aponta * 8, tronco: -aponta * 3 });
  poseD2 = somaPose(poseD2, gestoDeFala("DIEGO", t, 1.2));
  poseD2 = somaPose(poseD2, respira(t, 1.7));

  // ARTHUR: olha a janela; depois, de frente, dividido entre os dois
  let poseA: Pose = somaPose(PERFIL.parado, respira(t, 0.4));
  const praDiego = prog(t, FALA["23"].ini, FALA["23"].ini + 0.4) * (1 - prog(t, FALA["24"].ini - 0.1, FALA["24"].ini + 0.3));
  const praHelena = prog(t, FALA["24"].ini, FALA["24"].ini + 0.4) * (1 - prog(t, FALA["24"].fim + 0.1, FALA["24"].fim + 0.5));
  let poseA2: Pose = somaPose(POSES.neutro, { cabeca: -praDiego * 10 + praHelena * 10, tronco: -praDiego * 2 + praHelena * 2 });
  poseA2 = somaPose(poseA2, respira(t, 0.4));

  // HELENA entra pela direita e põe a mão no ombro dele
  const entH = andar(t, FALA["24"].ini - 0.9, FALA["24"].ini + 0.1, 1260, 760, 110);
  const maoOmbro = prog(t, FALA["24"].ini, FALA["24"].ini + 0.4);
  const inclinaSaida = prog(t, palavra("24", "quem") - 0.2, palavra("24", "quem") + 0.3);
  let poseH: Pose = somaPose(PERFIL.parado, passo(entH.fase, entH.andando));
  poseH = somaPose(poseH, { bracoEsq: { ombro: maoOmbro * 82, cotovelo: maoOmbro * 18 }, cabeca: -inclinaSaida * 12 });
  poseH = somaPose(poseH, gestoDeFala("HELENA", t, 0.6));

  // MENDES na porta do fundo
  const porta = prog(t, M.porta_mendes_abre, M.porta_mendes_abre + 0.4) * (1 - prog(t, M.porta_mendes_fecha - 0.4, M.porta_mendes_fecha));
  let poseM: Pose = somaPose(POSES.neutro, { bracoDir: { ombro: 8, cotovelo: 10 } });
  poseM = somaPose(poseM, gestoDeFala("MENDES", t, 0.6));

  const lamp: [number, number, number] = [cintila(t, "c1"), cintila(t, "c2"), cintila(t, "c3")];
  // o segurança dentro da janela (parado, como esteve por três horas)
  const janela = (
    <Seguranca pose={somaPose(SENTADO_FRENTE, { cabeca: 3 })} x={108} chao={1260} escala={0.5} luz={fria(0.4)} />
  );

  // câmera
  const tr = tremor(t, "tes", 0.4);
  let zoom = 1.0 + closeJanela * 1.4;
  let fx = 540 - closeJanela * 430;
  let fy = 1060 - closeJanela * 140;
  if (closeRelogio) {
    zoom = 4.2 + prog(t, M.tic_relogio, FALA["23"].ini) * 0.4;
    fx = 540; fy = 814;
  } else if (virouFrente) {
    zoom = 1.08 + prog(t, FALA["23"].ini, FALA["24"].fim) * 0.06;
    fx = 540; fy = 1080;
  }
  const relogio = "21:47";

  return (
    <Camera x={fx + tr.x * (closeRelogio ? 0.2 : 1)} y={fy + tr.y * (closeRelogio ? 0.2 : 1)} zoom={zoom}>
      <Corredor lampadas={lamp} portaMendes={porta} relogio={relogio} janela={janela} luzInterrogatorio={1} luzSaida={1} />
      {!closeRelogio && porta > 0.3 && <Mendes pose={poseM} x={540} chao={1180} escala={0.5} luz={{ lado: -1, cor: C.luzQuente, forca: 0.9 }} style={{ opacity: Math.min(1, (porta - 0.3) / 0.4) }} />}
      {closeRelogio ? null : !virouFrente ? (
        <>
          <Diego pose={poseD} x={entD.x} chao={1440} escala={1.3} vista="perfil" luz={fria(0.75)} />
          <Arthur pose={poseA} x={600} chao={1440} escala={1.3} vista="perfil" espelhar luz={fria(0.75)} />
        </>
      ) : (
        <>
          <Diego pose={poseD2} x={270} chao={1450} escala={1.3} luz={{ lado: -1, cor: "#FFD3D7", forca: 0.75 }} />
          <Arthur pose={poseA2} x={540} chao={1440} escala={1.32} luz={fria(0.7)} />
          {t >= FALA["24"].ini - 0.9 && (
            <Helena pose={poseH} x={entH.x} chao={1450} escala={1.25} vista="perfil" espelhar balanco={entH.fase} luz={{ lado: 1, cor: C.luzCiano, forca: 0.75 }} />
          )}
        </>
      )}
    </Camera>
  );
};

// ── CENA 6 · As duas jogadas, tela dividida (falas 25–26) ────────────────────
const Rotulo: React.FC<{ texto: string; cor: string; ativo: number }> = ({ texto, cor, ativo }) => (
  <div style={{ position: "absolute", left: 50, top: 200, opacity: 0.35 + ativo * 0.65 }}>
    <div style={{ fontFamily: tema.fonte.titulo, fontSize: 92, color: C.texto, textShadow: `0 0 30px ${cor}`, letterSpacing: 2 }}>{texto}</div>
    <div style={{ height: 8, width: 120 + ativo * 160, background: cor, borderRadius: 4, boxShadow: `0 0 20px ${cor}` }} />
  </div>
);

export const CenaJogadas: React.FC<{ t: number }> = ({ t }) => {
  const a0 = M.split_a, b0 = M.split_b;
  const ativoA = prog(t, a0, a0 + 0.3) * (1 - prog(t, b0 - 0.15, b0 + 0.15));
  const ativoB = prog(t, b0 - 0.15, b0 + 0.15);
  const apagado = (x: number) => ({ filter: `brightness(${0.25 + x * 0.75}) saturate(${0.35 + x * 0.65})` });

  // INTERROGAR: Arthur abre a porta e encara o segurança; a persiana se mexe
  const porta = prog(t, a0 + 0.1, a0 + 0.6);
  const entra = andar(t, a0 + 0.4, a0 + 1.7, 1060, 790, 100);
  const apoia = prog(t, a0 + 1.8, a0 + 2.3);
  const persiana = prog(t, palavra("25", "por") - 0.5, palavra("25", "por") + 0.1);
  let poseAi: Pose = somaPose(PERFIL.parado, passo(entra.fase, entra.andando));
  poseAi = somaPose(poseAi, { tronco: apoia * 22, bracoEsq: { ombro: apoia * 55, cotovelo: apoia * 5 }, bracoDir: { ombro: apoia * 45, cotovelo: apoia * 10 } });
  const levantaCabeca = prog(t, a0 + 0.5, a0 + 1.0);
  const poseSi: Pose = somaPose(SENTADO_PERFIL, { cabeca: 10 - levantaCabeca * 16 });

  // SEGUIR: segurança na calçada acende um cigarro; Arthur atrás do poste
  const isq = b0 + 0.6;
  const brasa = t >= isq + 0.15 ? 0.8 + 0.2 * Math.sin(t * 5) : 0;
  const fuma = prog(t, isq - 0.4, isq) * (1 - prog(t, isq + 1.2, isq + 1.6));
  const farol = interpolate(t, [b0 + 1.6, b0 + 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visto = prog(t, palavra("26", "visto") - 0.3, palavra("26", "visto") + 0.1);
  const poseSs: Pose = somaPose(PERFIL.parado, { bracoEsq: { ombro: fuma * 35, cotovelo: fuma * 120 }, cabeca: 2 });
  const espia = Math.sin(t * 1.3) * 3;
  const poseAs: Pose = somaPose(PERFIL.parado, { tronco: 14 + espia, cabeca: 6, bracoEsq: { ombro: 40, cotovelo: 60 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* metade de cima: INTERROGAR */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 958, overflow: "hidden", ...apagado(ativoA) }}>
        <SalaInterrogatorio porta={porta} persiana={persiana} />
        <Seguranca pose={poseSi} x={330} chao={880} escala={1.0} vista="perfil" luz={fria(0.6)} />
        <MesaInterrogatorio />
        <Arthur pose={poseAi} x={entra.x} chao={880} escala={1.05} vista="perfil" espelhar luz={{ lado: 1, cor: "#FFD0D4", forca: 0.8 }} />
        <Rotulo texto="INTERROGAR" cor={C.vermelho} ativo={ativoA} />
      </div>
      {/* metade de baixo: SEGUIR */}
      <div style={{ position: "absolute", left: 0, top: 962, width: 1080, height: 958, overflow: "hidden", ...apagado(ativoB) }}>
        <RuaNoite farol={farol} brasa={brasa} />
        <Seguranca pose={poseSs} x={430} chao={760} escala={0.95} vista="perfil" espelhar={visto < 0.5} luz={fria(0.5)} />
        <Arthur pose={poseAs} x={915} chao={760} escala={0.95} vista="perfil" espelhar luz={{ lado: -1, cor: C.luzCiano, forca: 0.8 }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 958 }}>
          <Rotulo texto="SEGUIR" cor={C.ciano} ativo={ativoB} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 958, width: 1080, height: 4, background: "#2A303A" }} />
    </AbsoluteFill>
  );
};

// ── CENA 7 · O voto (fala 27) ────────────────────────────────────────────────
export const CenaVoto: React.FC<{ t: number }> = ({ t }) => {
  const c = CENA.voto;
  const ladoA = prog(t, palavra("27", "decide") - 0.2, palavra("27", "decide") + 0.2) * (1 - prog(t, palavra("27", "minutos") - 0.2, palavra("27", "minutos") + 0.2));
  const ladoB = prog(t, palavra("27", "minutos") - 0.2, palavra("27", "minutos") + 0.2) * (1 - prog(t, palavra("27", "vocês") - 0.2, palavra("27", "vocês") + 0.2));
  const ergue = prog(t, c.ini + 0.2, c.ini + 0.8);
  let pose: Pose = somaPose(POSES.neutro, {
    bracoDir: { ombro: 30 * ergue + ladoA * 25, cotovelo: 55 * ergue },
    bracoEsq: { ombro: 30 * ergue + ladoB * 25, cotovelo: 55 * ergue },
    cabeca: -ladoA * 9 + ladoB * 9,
  });
  pose = somaPose(pose, respira(t, 0.4));
  const zoom = interpolate(t, [c.ini, M.cartela_voto, c.fim], [1.0, 1.04, 1.05], { easing: tema.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lamp: [number, number, number] = [cintila(t, "c1"), cintila(t, "c2"), cintila(t, "c3")];
  return (
    <Camera x={540} y={1000} zoom={zoom}>
      <Corredor lampadas={lamp} relogio="21:47" luzInterrogatorio={1} luzSaida={1} />
      <Arthur pose={pose} x={540} chao={1450} escala={1.22} objetoDir="pasta" objeto="chave" luz={fria(0.75)} />
    </Camera>
  );
};
