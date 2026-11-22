// Capa.tsx — capa do episódio 1 (1080×1920). Título e personagem ficam dentro do
// recorte 4:5 central (y 285–1635), que é o que aparece na grade do perfil.
import React from "react";
import { AbsoluteFill } from "remotion";
import { POSES, somaPose } from "../../personagem/pose";
import { Arthur } from "../personagens/Elenco";
import { Estacionamento } from "../cenarios/Estacionamento";
import { Acabamento } from "../ui/Interface";
import { tema } from "../tema";

const C = tema.cor;

export const CapaEp01: React.FC = () => {
  const pose = somaPose(POSES.neutro, { bracoEsq: { ombro: 22, cotovelo: 112 }, bracoDir: { ombro: 10 }, cabeca: -6 });
  return (
    <AbsoluteFill style={{ background: C.noite }}>
      <AbsoluteFill style={{ filter: "blur(5px) brightness(0.5)", transform: "scale(1.2) translateY(60px)" }}>
        <Estacionamento t={0} alerta={1} lampadas={[0.9, 0.35]} gota={-1} respingo={0} />
      </AbsoluteFill>
      <Arthur pose={pose} x={560} chao={1720} escala={1.5} objeto="celularAceso" luz={{ lado: 1, cor: C.luzCiano, forca: 0.95, deBaixo: true }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,7,0.9) 0%, rgba(3,4,7,0.55) 30%, transparent 46%, transparent 80%, rgba(3,4,7,0.85) 100%)" }} />
      <Acabamento grao={0.07} />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: tema.fonte.mono, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: C.textoFraco }}>
          <span style={{ color: C.vermelho }}>●</span> DIA 1/31
        </div>
        <div style={{ fontFamily: tema.fonte.titulo, fontSize: 170, lineHeight: 0.95, color: C.texto, marginTop: 18, letterSpacing: 2, textShadow: "0 8px 40px #000" }}>
          DENTRO
          <br />
          DA FARDA
        </div>
        <div style={{ margin: "26px auto 0", width: 220, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${C.vermelho}, ${C.ciano})` }} />
        <div style={{ fontFamily: tema.fonte.texto, fontWeight: 800, fontSize: 46, color: C.texto, marginTop: 30, textShadow: "0 3px 0 #000" }}>
          Episódio 1 · Você decide
        </div>
      </div>
    </AbsoluteFill>
  );
};
