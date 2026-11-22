// Ep01.tsx — DENTRO DA FARDA, episódio 1. Uma timeline única (timeline.json):
// a mesma fonte de tempos alimenta imagem, legendas e a faixa de áudio mixada.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { tema } from "../tema";
import { Acabamento, CartelaVoto, Contador, Legendas } from "../ui/Interface";
import { CENA, M, TL, useT } from "./base";
import { Cena1 } from "./Cena1";
import { CenaCorredor, CenaJogadas, CenaSala, CenaTestemunha, CenaVoto } from "./Cenas";

export const EP01_FRAMES = TL.frames;

const Cenas: React.FC<{ t: number }> = ({ t }) => {
  if (t < CENA.sala.ini) return <Cena1 t={t} />;
  if (t < CENA.corredor.ini) return <CenaSala t={t} />;
  if (t < CENA.testemunha.ini) return <CenaCorredor t={t} />;
  if (t < CENA.jogadas.ini) return <CenaTestemunha t={t} />;
  if (t < CENA.voto.ini) return t < M.split_a ? <CenaTestemunha t={t} /> : <CenaJogadas t={t} />;
  return <CenaVoto t={t} />;
};

export const Ep01: React.FC<{ comAudio?: boolean }> = ({ comAudio = true }) => {
  const t = useT();
  const emSplit = t >= M.split_a && t < M.split_fim;
  return (
    <AbsoluteFill style={{ background: tema.cor.noite }}>
      <Cenas t={t} />
      <Acabamento />
      <Legendas blocos={TL.legendas} t={t} y={emSplit ? 905 : 1470} ocultarDesde={M.cartela_voto} />
      <CartelaVoto desde={M.cartela_voto} t={t} />
      <Contador dia={1} total={31} desde={M.contador} t={t} />
      {comAudio && <Html5Audio src={staticFile("dentro-da-farda/ep01/ep01_mix.wav")} />}
    </AbsoluteFill>
  );
};
