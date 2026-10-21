import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { C } from "./theme";
import { edit, f } from "./edit";
import { Shot } from "./components/Shot";
import { Captions, Title } from "./components/Captions";

export const ChestReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.shade }}>
    {edit.shots.map((s, i) => (
      <Sequence key={`shot${i}`} from={f(s.at)} durationInFrames={Math.max(1, f(s.at + s.dur) - f(s.at))}>
        <Shot shot={s} />
      </Sequence>
    ))}

    <Title />
    <Captions />

    <Audio src={staticFile("music.wav")} volume={edit.vo.length ? 0.45 : 0.7} />
    {edit.vo.map((v) => (
      <Sequence key={`vo${v.id}`} from={f(v.at)} layout="none">
        <Audio src={staticFile(`vo/line_${v.id}.wav`)} />
      </Sequence>
    ))}
    {edit.sfx.map((s, i) => (
      <Sequence key={`sfx${i}`} from={f(s.at)} layout="none">
        <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
