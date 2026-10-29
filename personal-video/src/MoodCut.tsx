import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import moods from "./moods.json";
import { C, SAFE, SANS } from "./theme";
import { f, FPS, Shot as ShotT } from "./edit";
import { Shot } from "./components/Shot";

type MoodShot = {
  src: number;
  beats: number;
  speed?: number;
  zoom?: [number, number];
  fx?: ShotT["fx"];
  focus?: [number, number];
};
type Variant = {
  id: string;
  /** Source in public/ (default footage.mp4). */
  video?: string;
  /** CSS filter for the grade; "film" adds grain and a soft vignette. */
  grade?: string;
  film?: boolean;
  /** Small spaced-out label over the first shot. */
  label?: string;
  /** Original sound under the music (file in public/, volume). */
  ambience?: { file: string; vol: number };
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
      focus: s.focus,
      video: v.video,
      still: Boolean(v.video),
    };
    beat += s.beats;
    return shot;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.shade }}>
      <AbsoluteFill style={{ filter: v.grade ?? "contrast(1.08) saturate(0.82) brightness(0.96) sepia(0.08)" }}>
        {shots.map((s, i) => (
          <Sequence key={i} from={f(s.at)} durationInFrames={Math.max(1, f(s.at + s.dur) - f(s.at))}>
            <Shot shot={s} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {v.film ? <Film /> : null}
      {v.label ? <Label text={v.label} until={f(shots[0].dur)} /> : null}
      <AbsoluteFill style={{ backgroundColor: C.shade, opacity: dark }} />
      {v.ambience ? <Audio src={staticFile(v.ambience.file)} volume={v.ambience.vol} /> : null}

      <Audio src={staticFile(`music_${v.id}.wav`)} volume={0.8} />
      {v.sfx.map((s, i) => (
        <Sequence key={i} from={Math.round(s.beat * BEAT * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Fine animated grain and a soft vignette. */
const Film: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 60%, rgba(10,6,3,0.35) 100%)" }} />
      <Img
        src={staticFile(`grain/g${(frame % 8) + 1}.png`)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "overlay", opacity: 0.08 }}
      />
    </>
  );
};

const Label: React.FC<{ text: string; until: number }> = ({ text, until }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [6, 16, until - 8, until], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 30,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: "0.45em",
        color: "#F6F1EA",
        opacity: o,
        textShadow: "0 1px 6px rgba(0,0,0,0.45)",
      }}
    >
      {text}
    </div>
  );
};
