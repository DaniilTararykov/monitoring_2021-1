import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import cute from "./cute.json";
import { SAFE, SANS } from "./theme";
import { f, FPS, Shot as ShotT } from "./edit";
import { Shot } from "./components/Shot";

const BEAT = 60 / cute.bpm;
const CREAM = "#FFF4E2";
const STAR = "#FFE27A";

type CuteShot = { src: number; beats: number; speed?: number; zoom?: [number, number] };

/** Shot timeline in seconds; the hook occupies the first beats. */
const timeline = (() => {
  let beat = cute.hook.beats;
  return (cute.shots as CuteShot[]).map((s) => {
    const shot: ShotT = {
      at: beat * BEAT,
      dur: s.beats * BEAT,
      src: s.src,
      speed: s.speed ?? 1,
      zoom: s.zoom ?? [1.06, 1.0],
      fx: "cut",
    };
    beat += s.beats;
    return shot;
  });
})();

export const cuteDuration = () => timeline[timeline.length - 1].at + timeline[timeline.length - 1].dur;

const Star: React.FC<{ x: number; y: number; size: number; delay: number }> = ({ x, y, size, delay }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame - delay, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) });
  const twinkle = 0.85 + 0.15 * Math.sin((frame + delay * 3) / 3);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 -10 20 20"
      style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${s * twinkle}) rotate(${frame * 2}deg)` }}
    >
      <path d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z" fill={STAR} />
    </svg>
  );
};

/** Opening "before" frame with a polaroid of the result, big lowercase text and sparkles. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const inset = interpolate(frame, [0, 6], [0.7, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Shot shot={{ at: 0, dur: cute.hook.beats * BEAT, src: cute.hook.src, speed: 0.8, zoom: [1.04, 1.0], fx: "cut" }} />
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 10,
          left: SAFE.left + 10,
          width: 330,
          height: 440,
          background: "#fff",
          padding: 12,
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          transform: `rotate(-4deg) scale(${inset})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("footage.mp4")}
          trimBefore={Math.round(cute.hook.inset * FPS)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 820, textAlign: "center" }}>
        {cute.hook.lines.map((l, i) => {
          const p = interpolate(frame, [i * 2, i * 2 + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 104,
                letterSpacing: "-0.06em",
                lineHeight: 0.98,
                color: CREAM,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
                textShadow: "0 3px 10px rgba(0,0,0,0.35)",
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
      <Star x={190} y={800} size={70} delay={3} />
      <Star x={880} y={760} size={50} delay={5} />
      <Star x={140} y={1180} size={46} delay={7} />
      <Star x={900} y={1160} size={64} delay={4} />
      <Star x={520} y={1250} size={40} delay={8} />
      <Star x={430} y={300} size={44} delay={6} />
    </AbsoluteFill>
  );
};

/** Small, light lowercase caption in the middle of the frame. */
const SmallCaption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        top: 880,
        textAlign: "center",
        whiteSpace: "pre-line",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 40,
        lineHeight: 1.2,
        color: "#FFF6F8",
        opacity: o,
        textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.3)",
      }}
    >
      {text}
    </div>
  );
};

export const CuteReveal: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence durationInFrames={f(cute.hook.beats * BEAT)}>
      <Hook />
    </Sequence>
    {timeline.map((s, i) => (
      <Sequence key={i} from={f(s.at)} durationInFrames={Math.max(1, f(s.at + s.dur) - f(s.at))}>
        <Shot shot={s} />
      </Sequence>
    ))}
    {cute.captions.map((c, i) => {
      const from = timeline[c.fromShot].at;
      const to = timeline[c.toShot].at + timeline[c.toShot].dur;
      return (
        <Sequence key={`c${i}`} from={f(from)} durationInFrames={f(to) - f(from)} layout="none">
          <SmallCaption text={c.text} />
        </Sequence>
      );
    })}
    <Audio src={staticFile(`music_${cute.id}.wav`)} volume={0.85} />
    {cute.sfx.map((s, i) => (
      <Sequence key={`s${i}`} from={Math.round(s.beat * BEAT * FPS)} layout="none">
        <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
