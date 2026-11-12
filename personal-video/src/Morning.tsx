import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import data from "./morning.json";
import { MONO, SAFE, SANS, SERIF } from "./theme";

const FPS = 30;
const BEAT = 60 / data.bpm;
type Step = { n: number; word: string; brand: string; name: string };
type Seg = { src: number; beats: number; speed?: number; cx: number; step?: string; tag?: string; note?: string };
const steps = data.steps as Record<string, Step>;
const STEP_COUNT = Object.keys(steps).length;

/** Segments with their frame ranges; cuts land on whole frames exactly like scripts/build_morning.py. */
const timeline = (() => {
  let t = 0;
  return (data.segments as Seg[]).map((s) => {
    const from = Math.round(t * FPS);
    t += s.beats * BEAT;
    return { ...s, from, to: Math.round(t * FPS) };
  });
})();
export const MORNING_FRAMES = timeline[timeline.length - 1].to;
const stepSegs = timeline.filter((s) => s.step);
const ready = timeline[timeline.length - 1];
const CREAM = "#F4EFE6";
const INK = "#16130F";
const ACCENT = "#FF5A36";
const VH = 1200; // video window height; the rest is a paper panel for type
const shadow = "0 2px 14px rgba(0,0,0,0.45)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Story-style progress: one bar per step, filling while that step is on. */
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: SAFE.top, left: SAFE.left, right: SAFE.right, display: "flex", gap: 10 }}>
      {stepSegs.map((s, i) => {
        const end = i + 1 < stepSegs.length ? stepSegs[i + 1].from : ready.from;
        const p = interpolate(frame, [s.from, end], [0, 1], clamp);
        return (
          <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: CREAM }} />
          </div>
        );
      })}
    </div>
  );
};

/** Clock running from 7:00 to 7:24 across the reel. */
const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const mins = Math.floor(interpolate(frame, [timeline[1].from, ready.from], [0, 24], clamp));
  return (
    <div style={{ position: "absolute", top: SAFE.top + 30, left: SAFE.left, fontFamily: MONO, fontSize: 34, color: CREAM, textShadow: shadow, letterSpacing: "0.04em" }}>
      7:{String(mins).padStart(2, "0")} AM
    </div>
  );
};

/** Lock-screen alarm banner over the first shot. */
const Alarm: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = timeline[0].to;
  const inP = spring({ frame: frame - 4, fps: FPS, config: { damping: 14, stiffness: 140 } });
  const out = interpolate(frame, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shake = Math.sin(frame * 1.9) * interpolate(frame, [8, 40], [5, 0], clamp);
  return (
    <div
      style={{
        position: "absolute", top: VH + 60, left: SAFE.left, right: SAFE.right,
        transform: `translateY(${(1 - inP) * 700 + out * 700}px) rotate(${shake * 0.25}deg)`,
        background: "#FFFFFF", borderRadius: 38, padding: "26px 32px", display: "flex", alignItems: "center", gap: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.14)",
      }}
    >
      <div style={{ width: 84, height: 84, borderRadius: 22, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${shake * 2}deg)` }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 9v4l2.5 2M5 4 2.5 6.5M19 4l2.5 2.5" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "#6B655C", letterSpacing: "0.08em" }}>ALARM · NOW</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: INK, lineHeight: 1.1 }}>7:00 — get up, gorgeous</div>
      </div>
    </div>
  );
};

/** Step title: number, big serif word, product pill. Held until the next step. */
const StepCard: React.FC<{ step: Step; dur: number }> = ({ step, dur }) => {
  const frame = useCurrentFrame();
  const hold = Math.min(dur, Math.round(3.6 * FPS));
  const o = interpolate(frame, [hold - 8, hold], [1, 0], clamp);
  const wordP = spring({ frame, fps: FPS, config: { damping: 16, stiffness: 160 } });
  const pillP = spring({ frame: frame - 6, fps: FPS, config: { damping: 18, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: VH + 22, opacity: o }}>
      <div style={{ fontFamily: MONO, fontSize: 30, color: "#8A8378", opacity: wordP, letterSpacing: "0.06em" }}>
        {String(step.n).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
      </div>
      <div style={{ overflow: "hidden", paddingBottom: 18, marginTop: -6 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 150, lineHeight: 1, color: INK, transform: `translateY(${(1 - wordP) * 110}%)` }}>
          {step.word}
        </div>
      </div>
      <div
        style={{
          display: "inline-flex", alignItems: "baseline", gap: 14, background: INK, color: CREAM, borderRadius: 999, padding: "14px 28px",
          transform: `scale(${0.7 + 0.3 * pillP})`, transformOrigin: "left center", opacity: pillP,
        }}
      >
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30 }}>{step.brand}</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: "#C9C2B6" }}>{step.name}</span>
      </div>
    </div>
  );
};

const Tag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame, fps: FPS, config: { damping: 15, stiffness: 170 } });
  const o = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: VH - 110, opacity: o, transform: `rotate(-3deg) scale(${0.8 + 0.2 * p})`, transformOrigin: "left bottom" }}>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, background: ACCENT, color: CREAM, padding: "12px 24px", borderRadius: 14 }}>{text}</span>
    </div>
  );
};

const Speed: React.FC<{ x: number }> = ({ x }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: SAFE.top + 30, right: SAFE.right, fontFamily: MONO, fontSize: 34, color: CREAM, textShadow: shadow, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ opacity: frame % 10 < 6 ? 1 : 0.35 }}>▶▶</span>×{x}
    </div>
  );
};

const Ready: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - 6, fps: FPS, config: { damping: 13, stiffness: 120 } });
  const tick = spring({ frame: frame - 22, fps: FPS, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: VH + 30 }}>
      <div style={{ overflow: "hidden", paddingBottom: 24 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 170, lineHeight: 1, color: INK, transform: `translateY(${(1 - p) * 110}%)` }}>ready.</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: ACCENT, color: CREAM, borderRadius: 999, padding: "14px 28px", opacity: tick, transform: `scale(${0.7 + 0.3 * tick})`, transformOrigin: "left center" }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30 }}>5 / 5 done</span>
        <span style={{ fontFamily: MONO, fontSize: 28 }}>24 min</span>
      </div>
    </div>
  );
};

export const Morning: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = timeline.find((s) => frame >= s.from && frame < s.to) ?? ready;
  const local = frame - seg.from;
  // small punch-in on every cut, harder on step shots
  const punch = interpolate(local, [0, 7], [seg.step ? 1.09 : 1.045, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = seg.step || seg.note === "ready" ? interpolate(local, [0, 6], [0.55, 0], clamp) : 0;
  const fadeOut = interpolate(frame, [MORNING_FRAMES - 10, MORNING_FRAMES], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: VH, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("morning_cut.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${punch})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 34%)" }} />
        <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      </div>
      <Progress />
      <Clock />
      <Sequence durationInFrames={timeline[0].to}><Alarm /></Sequence>
      {stepSegs.map((s, i) => {
        const end = i + 1 < stepSegs.length ? stepSegs[i + 1].from : ready.from;
        return (
          <Sequence key={s.from} from={s.from} durationInFrames={end - s.from}>
            <StepCard step={steps[s.step as string]} dur={end - s.from} />
          </Sequence>
        );
      })}
      {timeline.map((s) => {
        const next = timeline.find((n) => n.from === s.to);
        const dur = s.tag && next && !next.step ? next.to - s.from : s.to - s.from;
        return s.tag ? <Sequence key={`t${s.from}`} from={s.from} durationInFrames={dur}><Tag text={s.tag} dur={dur} /></Sequence> : null;
      })}
      {timeline.map((s) => ((s.speed ?? 1) >= 2 ? <Sequence key={`s${s.from}`} from={s.from} durationInFrames={s.to - s.from}><Speed x={s.speed as number} /></Sequence> : null))}
      <Sequence from={ready.from} durationInFrames={ready.to - ready.from}><Ready dur={ready.to - ready.from} /></Sequence>
      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: fadeOut }} />

      <Audio src={staticFile("music_morning.wav")} volume={0.85} />
      <Audio src={staticFile("sfx/rec_beep.wav")} volume={0.5} />
      {stepSegs.map((s) => (
        <Sequence key={`a${s.from}`} from={s.from} layout="none"><Audio src={staticFile("sfx/pop.wav")} volume={0.6} /></Sequence>
      ))}
      {timeline.filter((s) => (s.speed ?? 1) >= 2).map((s) => (
        <Sequence key={`w${s.from}`} from={s.from} layout="none"><Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} /></Sequence>
      ))}
      <Sequence from={ready.from} layout="none"><Audio src={staticFile("sfx/shimmer.wav")} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
