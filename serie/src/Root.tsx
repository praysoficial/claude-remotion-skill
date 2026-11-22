import React from "react";
import { Composition, Still } from "remotion";
import { Teste, TESTE_S } from "./episodios/Teste";
import "./dentro-da-farda/fontes";
import { FolhaPersonagens } from "./dentro-da-farda/personagens/FolhaPersonagens";

const FPS = 30;

export const Root: React.FC = () => (
  <>
    <Composition
      id="Teste"
      component={Teste}
      durationInFrames={Math.round(TESTE_S * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Still id="DDF-Personagens" component={FolhaPersonagens} width={1080} height={1920} />
  </>
);
