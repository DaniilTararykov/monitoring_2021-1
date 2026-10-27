import React from "react";
import { Composition } from "remotion";
import { ChestReel } from "./ChestReel";
import { DURATION, FPS } from "./edit";
import { MoodCut, moodDuration, variants } from "./MoodCut";
import { CuteReveal, cuteDuration } from "./CuteReveal";

export const Root: React.FC = () => (
  <>
    <Composition
      id="ChestReel"
      component={ChestReel}
      durationInFrames={Math.round(DURATION * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    {variants.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={MoodCut}
        defaultProps={{ id: v.id }}
        durationInFrames={Math.round(moodDuration(v) * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
    <Composition
      id="CuteReveal"
      component={CuteReveal}
      durationInFrames={Math.round(cuteDuration() * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
