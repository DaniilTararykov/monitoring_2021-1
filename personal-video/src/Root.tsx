import React from "react";
import { Composition, Still } from "remotion";
import { ChestReel } from "./ChestReel";
import { DURATION, FPS } from "./edit";
import { MoodCut, moodDuration, variants } from "./MoodCut";
import { Reveal, RevealConfig, revealDuration } from "./CuteReveal";
import cute from "./cute.json";
import { H as CH, slides, W as CW } from "./Carousel";
import { DOODLE_FRAMES, doodles } from "./Doodles";
import { GRWMCards, GRWMMac, GRWMScan, GRWMSplit, GRWM_FRAMES } from "./GRWM";
import clean from "./clean.json";

const reveals = [cute, clean] as unknown as RevealConfig[];

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
    {reveals.map((cfg) => (
      <Composition
        key={cfg.id}
        id={cfg.id}
        component={Reveal}
        defaultProps={{ cfg }}
        durationInFrames={Math.round(revealDuration(cfg) * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
    {([
      ["GRWMMac", GRWMMac],
      ["GRWMCards", GRWMCards],
      ["GRWMSplit", GRWMSplit],
      ["GRWMScan", GRWMScan],
    ] as const).map(([id, C]) => (
      <Composition key={id} id={id} component={C} durationInFrames={GRWM_FRAMES} fps={30} width={1080} height={1920} />
    ))}
    {doodles.map((d) => (
      <Composition key={d.id} id={d.id} component={d.component} durationInFrames={DOODLE_FRAMES} fps={30} width={1080} height={1350} />
    ))}
    {slides.map((sl) => (
      <Still key={sl.id} id={sl.id} component={sl.el} width={sl.w ?? CW} height={CH} />
    ))}
  </>
);
