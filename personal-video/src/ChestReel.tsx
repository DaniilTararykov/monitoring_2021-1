import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { C } from "./theme";
import { edit, f, shots, wordTime, words } from "./edit";
import { Shot } from "./components/Shot";
import { BeforeAfter, FilmLook, Rewind } from "./components/Specials";
import { Chapter, Counter, Tag, Title } from "./components/Graphics";
import { Subtitles } from "./components/Subtitles";

/** "СЛОЙ N" tags pinned to the spoken words of the colour line. */
const layerTags = edit.layers
  .map((l, i, all) => {
    const at = wordTime(`07_color:${l.word}`);
    const nextAt = all[i + 1] ? wordTime(`07_color:${all[i + 1].word}`) : null;
    return at === null ? null : { at, dur: Math.max(0.6, (nextAt ?? at + 1.0) - at), text: l.label };
  })
  .filter((x): x is { at: number; dur: number; text: string } => x !== null);

export const ChestReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.walnut }}>
    {shots.map((s, i) => (
      <Sequence key={`shot${i}`} from={f(s.at)} durationInFrames={f(s.dur)}>
        <Shot shot={s} />
      </Sequence>
    ))}
    <Sequence from={f(edit.rewind.at)} durationInFrames={f(edit.rewind.dur)}>
      <Rewind {...edit.rewind} />
    </Sequence>
    <Sequence from={f(edit.beforeAfter.at)} durationInFrames={f(edit.beforeAfter.dur)}>
      <BeforeAfter {...edit.beforeAfter} />
    </Sequence>

    <FilmLook />

    {edit.chapters.map((c, i) => (
      <Sequence key={`ch${i}`} from={f(c.at)} durationInFrames={f(c.dur)} layout="none">
        <Chapter {...c} />
      </Sequence>
    ))}
    {[...edit.tags, ...layerTags].map((t, i) => (
      <Sequence key={`tag${i}`} from={f(t.at)} durationInFrames={f(t.dur)} layout="none">
        <Tag {...t} offset={edit.chapters.some((c) => t.at >= c.at && t.at < c.at + c.dur) ? 90 : 0} />
      </Sequence>
    ))}
    {edit.titles.map((t, i) => (
      <Sequence key={`ti${i}`} from={f(t.at)} durationInFrames={f(t.dur)} layout="none">
        <Title {...t} />
      </Sequence>
    ))}
    {edit.counters.map((c, i) => (
      <Sequence key={`co${i}`} from={f(c.at)} durationInFrames={f(c.dur)} layout="none">
        <Counter {...c} />
      </Sequence>
    ))}
    <Subtitles />

    <Audio src={staticFile("music.wav")} volume={0.5} />
    {edit.vo
      .filter((v) => words[v.id])
      .map((v) => (
        <Sequence key={v.id} from={f(v.at)} layout="none">
          <Audio src={staticFile(`vo/${v.id}.wav`)} volume={1} />
        </Sequence>
      ))}
    {edit.sfx.map((s, i) => (
      <Sequence key={`sfx${i}`} from={f(s.at)} layout="none">
        <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
