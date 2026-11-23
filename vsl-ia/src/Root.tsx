import React from "react";
import { Composition } from "remotion";
import { VSL } from "./VSL";
import { DURATION_S, FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <Composition id="VSL" component={VSL} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={WIDTH} height={HEIGHT} />
);
