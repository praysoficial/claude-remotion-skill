import React from "react";
import { Composition, Still } from "remotion";
import { Teste, TESTE_S } from "./episodios/Teste";
import "./dentro-da-farda/fontes";
import { FolhaPersonagens } from "./dentro-da-farda/personagens/FolhaPersonagens";
import { Ep01, EP01_FRAMES } from "./dentro-da-farda/ep01/Ep01";
import { CapaEp01 } from "./dentro-da-farda/ep01/Capa";

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
    <Composition id="DDF-Ep01" component={Ep01} durationInFrames={EP01_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{ comAudio: true }} />
    <Still id="DDF-Ep01-Capa" component={CapaEp01} width={1080} height={1920} />
    <Still id="DDF-Personagens" component={FolhaPersonagens} width={1080} height={1920} />
  </>
);
