import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SAFE, SANS } from "./theme";
import { f, FPS, Shot as ShotT } from "./edit";
import { Shot } from "./components/Shot";

const CREAM = "#FFF4E2";
const STAR = "#FFE27A";

type RevealShot = { src: number; beats: number; speed?: number; zoom?: [number, number]; rotate?: number };
export type RevealConfig = {
  id: string;
  bpm: number;
  stars?: boolean;
  hook: { beats: number; src: number; rotate?: number; inset: number; insetRotate?: number; lines: string[] };
  shots: RevealShot[];
  captions: { fromShot: number; toShot: number; text: string }[];
  sfx: { id: string; beat: number; vol: number }[];
};

/** Shot timeline in seconds; the hook occupies the first beats. */
const timeline = (cfg: RevealConfig): ShotT[] => {
  const beat = 60 / cfg.bpm;
  let at = cfg.hook.beats;
  return cfg.shots.map((s) => {
    const shot: ShotT = {
      at: at * beat,
      dur: s.beats * beat,
      src: s.src,
      speed: s.speed ?? 1,
      zoom: s.zoom ?? (cfg.stars ? [1.06, 1.0] : [1.0, 1.04]),
      fx: "cut",
      rotate: s.rotate,
      still: !cfg.stars,
    };
    at += s.beats;
    return shot;
  });
};

export const revealDuration = (cfg: RevealConfig) => {
  const t = timeline(cfg);
  return t[t.length - 1].at + t[t.length - 1].dur;
};

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

/** Opening "before" frame with a polaroid of the result and a big lowercase hook. */
const Hook: React.FC<{ cfg: RevealConfig }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  const beat = 60 / cfg.bpm;
  const h = cfg.hook;
  const inset = interpolate(frame, [0, 6], [0.7, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Shot
        shot={{ at: 0, dur: h.beats * beat, src: h.src, speed: 0.8, zoom: cfg.stars ? [1.04, 1.0] : [1.0, 1.03], fx: "cut", rotate: h.rotate, still: !cfg.stars }}
      />
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
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <Shot shot={{ at: 0, dur: h.beats * beat, src: h.inset, speed: 1, zoom: [1.0, 1.0], fx: "cut", rotate: h.insetRotate, still: true }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 820, textAlign: "center" }}>
        {h.lines.map((l, i) => {
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
      {cfg.stars ? (
        <>
          <Star x={190} y={800} size={70} delay={3} />
          <Star x={880} y={760} size={50} delay={5} />
          <Star x={140} y={1180} size={46} delay={7} />
          <Star x={900} y={1160} size={64} delay={4} />
          <Star x={520} y={1250} size={40} delay={8} />
          <Star x={430} y={300} size={44} delay={6} />
        </>
      ) : null}
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

/** Music-only before -> process -> after reveal, one shot per beat. */
export const Reveal: React.FC<{ cfg: RevealConfig }> = ({ cfg }) => {
  const beat = 60 / cfg.bpm;
  const shots = timeline(cfg);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={f(cfg.hook.beats * beat)}>
        <Hook cfg={cfg} />
      </Sequence>
      {shots.map((s, i) => (
        <Sequence key={i} from={f(s.at)} durationInFrames={Math.max(1, f(s.at + s.dur) - f(s.at))}>
          <Shot shot={s} />
        </Sequence>
      ))}
      {cfg.captions.map((c, i) => {
        const from = shots[c.fromShot].at;
        const to = shots[c.toShot].at + shots[c.toShot].dur;
        return (
          <Sequence key={`c${i}`} from={f(from)} durationInFrames={f(to) - f(from)} layout="none">
            <SmallCaption text={c.text} />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`music_${cfg.id}.wav`)} volume={0.85} />
      {cfg.sfx.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.round(s.beat * beat * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${s.id}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
