// FolhaPersonagens.tsx — referência visual do elenco: cada um de frente e de perfil.
import React from "react";
import { AbsoluteFill } from "remotion";
import { POSES, Pose } from "../../personagem/pose";
import { tema } from "../tema";
import { Arthur, Diego, Helena, Mendes, Seguranca, Victor } from "./Elenco";

const perfilParado: Pose = {
  tronco: 2, cabeca: 0,
  bracoEsq: { ombro: 8, cotovelo: 12 }, bracoDir: { ombro: -6, cotovelo: 10 },
  pernaEsq: { quadril: 6, joelho: 3 }, pernaDir: { quadril: -5, joelho: 2 },
};

const FICHAS = [
  { nome: "ARTHUR", info: "24 · topete", C: Arthur },
  { nome: "HELENA", info: "31 · rabo de cavalo", C: Helena },
  { nome: "MENDES", info: "52 · gravata, o maior", C: Mendes },
  { nome: "DIEGO", info: "26 · boné virado", C: Diego },
  { nome: "VICTOR", info: "45 · gola alta", C: Victor },
  { nome: "SEGURANÇA", info: "capuz", C: Seguranca },
];

export const FolhaPersonagens: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${tema.cor.parede}, ${tema.cor.noite})` }}>
    {FICHAS.map((f, i) => {
      const col = i % 2, lin = Math.floor(i / 2);
      const x0 = 60 + col * 520, chao = 520 + lin * 600;
      const luz = { lado: 1 as const, cor: "#9FDDF0", forca: 0.6 };
      return (
        <React.Fragment key={f.nome}>
          <f.C pose={POSES.neutro} x={x0 + 130} chao={chao} escala={0.9} luz={luz} />
          <f.C pose={perfilParado} x={x0 + 340} chao={chao} escala={0.9} vista="perfil" luz={luz} balanco={0.2} />
          <div style={{ position: "absolute", left: x0 + 20, top: chao + 24, color: tema.cor.texto, fontFamily: tema.fonte.titulo, fontSize: 46, letterSpacing: 1 }}>{f.nome}</div>
          <div style={{ position: "absolute", left: x0 + 22, top: chao + 84, color: tema.cor.textoFraco, fontFamily: tema.fonte.texto, fontSize: 26 }}>{f.info}</div>
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);
