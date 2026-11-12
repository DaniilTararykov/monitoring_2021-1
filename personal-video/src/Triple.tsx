import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import data from "./triple.json";
import { MONO, SAFE, SERIF } from "./theme";

/**
 * "Triple screen": three stacked landscape strips. Every beat one strip (top, middle,
 * bottom, top, ...) cuts to the next moment of the morning, so the routine plays in
 * three windows at once. The title words sit in the strips until footage cuts over them.
 */
const FPS = 30;
const BEAT = 60 / data.bpm;
const GAP = 8;
const ROW_H = (1920 - 2 * GAP) / 3;
const CREAM = "#F4EFE6";
const INK = "#16130F";
type Clip = { src: number; speed?: number; label?: string };
const clips = data.clips as Clip[];
const fb = (b: number) => Math.round(b * BEAT * FPS);
const FINAL_FROM = fb(data.final.atBeat);
export const TRIPLE_FRAMES = fb(data.final.atBeat + data.final.beats);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Strip: React.FC<{ src: number; speed?: number; label?: string; row: number }> = ({ src, speed = 1, label, row }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 6], [1.07, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lo = interpolate(frame, [3, 9], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("morning_strip.mp4")}
        trimBefore={Math.round(src * FPS)}
        playbackRate={speed}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${punch})` }}
      />
      {label ? (
        <div
          style={{
            position: "absolute", left: SAFE.left, ...(row === 2 ? { top: 22 } : { bottom: 22 }),
            fontFamily: MONO, fontSize: 26, color: INK, background: CREAM, padding: "8px 16px", borderRadius: 8, opacity: lo,
            transform: `translateX(${(1 - lo) * -16}px)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Row: React.FC<{ row: number }> = ({ row }) => {
  const mine = clips.map((c, i) => ({ ...c, beat: i })).filter((c) => c.beat % 3 === row);
  return (
    <div style={{ position: "absolute", left: 0, top: row * (ROW_H + GAP), width: 1080, height: ROW_H, overflow: "hidden", backgroundColor: CREAM }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 230, color: INK, lineHeight: 1 }}>{data.title[row]}</div>
      </AbsoluteFill>
      {mine.map((c, k) => {
        const from = fb(c.beat);
        const to = k + 1 < mine.length ? fb(mine[k + 1].beat) : FINAL_FROM;
        return (
          <Sequence key={c.beat} from={from} durationInFrames={to - from}>
            <Strip src={c.src} speed={c.speed} label={c.label} row={row} />
          </Sequence>
        );
      })}
      {/* finale: the same last look in all three, each strip a few frames behind the one above */}
      <Sequence from={FINAL_FROM + row * 4} durationInFrames={TRIPLE_FRAMES - FINAL_FROM - row * 4}>
        <Strip src={data.final.src} row={row} />
      </Sequence>
    </div>
  );
};

export const Triple: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [TRIPLE_FRAMES - 8, TRIPLE_FRAMES], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      {[0, 1, 2].map((r) => <Row key={r} row={r} />)}
      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: out }} />
      <Audio src={staticFile("music_triple.wav")} volume={0.85} />
      {clips.map((c, i) => (c.label ? <Sequence key={i} from={fb(i)} layout="none"><Audio src={staticFile("sfx/pop.wav")} volume={0.5} /></Sequence> : null))}
      <Sequence from={FINAL_FROM} layout="none"><Audio src={staticFile("sfx/shimmer.wav")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
