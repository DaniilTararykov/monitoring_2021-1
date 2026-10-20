import { Easing, interpolate } from "remotion";
import { FRAME } from "./brand";

// Scene layouts, all inside the Instagram Reels safe zone.
// split-a: video below, graphic in the upper slot, captions above the head.
// split-b: same frame, graphic and captions swap places.
// circle-top / circle-bottom: the speaker in an animated circle with an
//   audio aura; the graphic sits on the other side of the circle.
// full: the speaker full-screen, header over a top fade, graphic and
//   captions over a voice-reactive cloud at the bottom.
export type Layout =
  | "split-a"
  | "split-b"
  | "circle-top"
  | "circle-bottom"
  | "full";

export type Region = {
  top: number;
  height: number;
  left: number;
  right: number;
};

// Below y=1110 the Reels UI covers 193px on the right; keep lower content
// symmetric so it stays centered.
const WIDE = { left: 70, right: 55 };
const LOWER = { left: 193, right: 193 };

export const GRAPHIC_REGION: Record<Layout, Region & { compact: boolean }> = {
  "split-a": { top: 480, height: 290, ...WIDE, compact: false },
  "split-b": { top: 790, height: 160, ...WIDE, compact: true },
  "circle-bottom": { top: 370, height: 320, ...WIDE, compact: false },
  "circle-top": { top: 950, height: 155, ...WIDE, compact: true },
  full: { top: 1110, height: 180, ...LOWER, compact: true },
};

export const CAPTION_REGION: Record<Layout, Region & { fontSize: number }> = {
  "split-a": { top: 790, height: 160, ...WIDE, fontSize: 62 },
  "split-b": { top: 480, height: 290, ...WIDE, fontSize: 76 },
  "circle-bottom": { top: 1290, height: 200, ...LOWER, fontSize: 52 },
  "circle-top": { top: 1120, height: 370, ...LOWER, fontSize: 62 },
  full: { top: 1300, height: 190, ...LOWER, fontSize: 52 },
};

// Where the speaker's face sits in the source frame (1080×1920).
const FACE = { x: 540, y: 800 };

type Geometry = {
  // Video container in frame coordinates.
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  // Source video scale and where its face lands inside the container.
  scale: number;
  faceX: number;
  faceY: number;
  // How much each layout family is "on" (0..1) for fading decorations.
  split: number;
  circle: number;
  full: number;
};

const circle = (cy: number, r: number): Geometry => ({
  x: 540 - r,
  y: cy - r,
  w: 2 * r,
  h: 2 * r,
  radius: r,
  scale: 0.6,
  faceX: r,
  faceY: r,
  split: 0,
  circle: 1,
  full: 0,
});

const split: Geometry = {
  x: 0,
  y: FRAME.videoTop,
  w: FRAME.width,
  h: FRAME.height - FRAME.videoTop,
  radius: 0,
  scale: 1,
  faceX: 540,
  faceY: 540,
  split: 1,
  circle: 0,
  full: 0,
};

const GEOMETRY: Record<Layout, Geometry> = {
  "split-a": split,
  "split-b": split,
  "circle-top": circle(640, 240),
  "circle-bottom": circle(1000, 225),
  full: {
    x: 0,
    y: 0,
    w: FRAME.width,
    h: FRAME.height,
    radius: 0,
    scale: 1,
    faceX: FACE.x,
    faceY: FACE.y,
    split: 0,
    circle: 0,
    full: 1,
  },
};

export const TRANSITION_SEC = 0.6;

type Timed = { fromSec: number; durationSec: number; layout: Layout };

export const layoutAt = (beats: Timed[], timeSec: number): Layout => {
  let layout = beats[0]?.layout ?? "split-a";
  for (const b of beats) {
    if (b.fromSec > timeSec) {
      break;
    }
    layout = b.layout;
  }
  return layout;
};

// Geometry at a given time, morphing from the previous layout into the
// current one at the start of each beat.
export const sceneAt = (
  beats: Timed[],
  timeSec: number,
): Geometry & { faceSourceX: number; faceSourceY: number } => {
  let prev = GEOMETRY[beats[0]?.layout ?? "split-a"];
  let current = prev;
  let progress = 1;
  for (const b of beats) {
    if (b.fromSec > timeSec) {
      break;
    }
    prev = current;
    current = GEOMETRY[b.layout];
    progress = interpolate(
      timeSec,
      [b.fromSec, b.fromSec + TRANSITION_SEC],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      },
    );
  }
  const mix = (key: keyof Geometry) =>
    prev[key] + (current[key] - prev[key]) * progress;
  return {
    x: mix("x"),
    y: mix("y"),
    w: mix("w"),
    h: mix("h"),
    radius: mix("radius"),
    scale: mix("scale"),
    faceX: mix("faceX"),
    faceY: mix("faceY"),
    split: mix("split"),
    circle: mix("circle"),
    full: mix("full"),
    faceSourceX: FACE.x,
    faceSourceY: FACE.y,
  };
};
