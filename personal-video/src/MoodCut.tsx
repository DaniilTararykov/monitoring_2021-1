import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import moods from "./moods.json";
import { C } from "./theme";
import { f, FPS, Shot as ShotT } from "./edit";
import { Shot } from "./components/Shot";

type MoodShot = { src: number; beats: number; speed?: number; zoom?: [number, number]; fx?: ShotT["fx"] };
type Variant = {
  id: string;
  drumsFromBeat: number;
  fadeOutBeats: number;
  shots: MoodShot[];
  sfx: { id: string; beat: number; vol: number }[];
};

const BEAT = 60 / moods.bpm;
export const variants = moods.variants as unknown as Variant[];

export const moodDuration = (v: Variant) => v.shots.reduce((n, s) => n + s.beats, 0) * BEAT;

/** Music-only moody cut: every shot lands on the beat. */
export const MoodCut: React.FC<{ id: string }> = ({ id }) => {
  const v = variants.find((x) => x.id === id)!;
  const frame = useCurrentFrame();
  const total = f(moodDuration(v));
  const fadeFrames = f(v.fadeOutBeats * BEAT * 0.6);
  const dark = interpolate(frame, [total - fadeFrames, total], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let beat = 0;
  const shots = v.shots.map((s) => {
    const shot: ShotT = {
      at: beat * BEAT,
      dur: s.beats * BEAT,
      src: s.src,
      speed: s.speed ?? 1,
      zoom: s.zoom ?? [1.06, 1.0],
      fx: s.fx ?? "cut",
    };
    beat += s.beats;
    return shot;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.shade }}>
      <AbsoluteFill style={{ filter: "contrast(1.08) saturate(0.82) brightness(0.96) sepia(0.08)" }}>
        {shots.map((s, i) => (
          <Sequence key={i} from={f(s.at)} durationInFrames={Math.max(1, f(s.at + s.dur) - f(s.at))}>
            <Shot shot={s} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.shade, opacity: dark }} />

      <Audio src={staticFile(`music_${v.id}.wav`)} volume={0.8} />
      {v.sfx.map((s, i) => (
        <Sequence key={i} from={Math.round(s.beat * BEAT * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
