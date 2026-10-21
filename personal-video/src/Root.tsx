import React from "react";
import { Composition } from "remotion";
import { ChestReel } from "./ChestReel";
import { DURATION, FPS } from "./edit";

export const Root: React.FC = () => (
  <Composition
    id="ChestReel"
    component={ChestReel}
    durationInFrames={Math.round(DURATION * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
