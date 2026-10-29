import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { f, FPS, Shot as ShotT } from "../edit";

const FOOTAGE = staticFile("footage.mp4");

/** One source segment at a constant playback rate. */
const Clip: React.FC<{ srcFrame: number; rate: number; video?: string }> = ({ srcFrame, rate, video }) => (
  <OffthreadVideo
    src={video ? staticFile(video) : FOOTAGE}
    trimBefore={srcFrame}
    playbackRate={rate}
    muted
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
);

/** Speed ramps are approximated with short constant-rate steps. */
const RAMP_STEPS = 6;

export const Shot: React.FC<{ shot: ShotT }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const len = f(shot.dur);
  const p = frame / Math.max(1, len - 1);

  const ease = Easing.inOut(Easing.cubic);
  const rot = shot.rotate ?? 0;
  // Smallest zoom that keeps a rotated 9:16 frame free of empty corners.
  const rad = (Math.abs(rot) * Math.PI) / 180;
  const cover = Math.cos(rad) + (1920 / 1080) * Math.sin(rad);
  let scale = interpolate(ease(Math.min(1, p)), [0, 1], shot.zoom) * cover;
  let ty = 0;
  let blur = 0;
  let opacity = 1;

  if (shot.fx === "punch") {
    scale *= interpolate(frame, [0, 5], [1.12, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  }
  if (shot.fx === "whip") {
    ty = interpolate(frame, [0, 6], [-22, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    blur = interpolate(frame, [0, 6], [28, 0], { extrapolateRight: "clamp" });
  }
  if (shot.fx === "fade") {
    opacity = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  }
  // Gentle drift so locked-off shots still breathe.
  const drift = shot.still ? 0 : Math.sin((frame + shot.src * 10) / 45) * 6;
  // Crop: shift so the focus point sits in the centre, without exposing the frame edge.
  let fx = 0;
  let fy = 0;
  if (shot.focus) {
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    fx = clamp(-scale * (shot.focus[0] - 540), 540 * (scale - 1));
    fy = clamp(-scale * (shot.focus[1] - 960), 960 * (scale - 1));
  }

  const segments: React.ReactNode[] = [];
  const start = Math.round(shot.src * FPS);
  if (Array.isArray(shot.speed)) {
    const [a, b] = shot.speed;
    const step = Math.ceil(len / RAMP_STEPS);
    let src = start;
    for (let i = 0; i < RAMP_STEPS; i++) {
      const from = i * step;
      const dur = Math.min(step, len - from);
      if (dur <= 0) break;
      const rate = a + ((b - a) * (i + 0.5)) / RAMP_STEPS;
      segments.push(
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Clip srcFrame={Math.round(src)} rate={rate} video={shot.video} />
        </Sequence>,
      );
      src += dur * rate;
    }
  } else {
    segments.push(<Clip key="0" srcFrame={start} rate={shot.speed} video={shot.video} />);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.shade }}>
      <AbsoluteFill
        style={{
          opacity,
          transform: `translate(${fx}px, ${fy}px) translateY(${ty}%) translateX(${drift}px) rotate(${rot}deg) scale(${scale})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        {segments}
      </AbsoluteFill>
      {shot.fx === "flash" ? <Flash /> : null}
    </AbsoluteFill>
  );
};

export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 7], [0.95, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return <AbsoluteFill style={{ backgroundColor: C.white, opacity: o, mixBlendMode: "screen" }} />;
};
