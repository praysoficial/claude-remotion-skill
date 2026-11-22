import React from "react";
import { Composition } from "remotion";
import { Teste, TESTE_S } from "./episodios/Teste";

const FPS = 30;

export const Root: React.FC = () => (
  <Composition
    id="Teste"
    component={Teste}
    durationInFrames={Math.round(TESTE_S * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
