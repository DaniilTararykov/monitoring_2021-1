import { Audio } from "@remotion/media";
import {
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FRAME, SAFE, SLOTS } from "./brand";
import { Graphic, GraphicView } from "./Graphics";

export type Beat = {
  fromSec: number;
  durationSec: number;
  // "a" = upper slot (captions go to slot B), "b" = lower slot (captions go up).
  slot: "a" | "b";
  graphic: Graphic;
  // Replace the entrance sound with an accent "ding".
  accent?: boolean;
};

// Entrance effects rotate so the same one never plays twice in a row.
const ENTRANCES = ["rise", "pop", "slide"] as const;
type Entrance = (typeof ENTRANCES)[number];

const ENTRANCE_SFX: Record<Entrance, string> = {
  rise: "sfx/whoosh.wav",
  pop: "sfx/switch.wav",
  slide: "sfx/page-turn.wav",
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const BeatView: React.FC<{
  beat: Beat;
  entrance: Entrance;
  durationInFrames: number;
}> = ({ beat, entrance, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.55 * fps], [0, 1], {
    ...clamp,
    easing:
      entrance === "pop"
        ? Easing.spring({ damping: 13 })
        : Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 0.25 * fps, durationInFrames],
    [1, 0],
    clamp,
  );

  return (
    <div
      style={{
        opacity: Math.min(interpolate(frame, [0, 6], [0, 1], clamp), exit),
        translate:
          entrance === "rise"
            ? `0px ${(1 - enter) * 140}px`
            : entrance === "slide"
              ? `${(1 - enter) * -160}px 0px`
              : "0px 0px",
        scale: entrance === "pop" ? 0.6 + 0.4 * enter : 1,
        filter: entrance === "slide" ? `blur(${(1 - enter) * 14}px)` : "none",
      }}
    >
      <GraphicView graphic={beat.graphic} compact={beat.slot === "b"} />
    </div>
  );
};

export const Beats: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {beats.map((beat, i) => {
        const entrance = ENTRANCES[i % ENTRANCES.length];
        const slot = SLOTS[beat.slot];
        const durationInFrames = Math.max(
          1,
          Math.round(beat.durationSec * fps),
        );
        return (
          <Sequence
            key={i}
            name={`Beat ${i + 1}: ${beat.graphic.kind}`}
            from={Math.round(beat.fromSec * fps)}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <div
              style={{
                position: "absolute",
                top: slot.top,
                height: slot.height,
                left: SAFE.left,
                right: SAFE.right,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BeatView
                beat={beat}
                entrance={entrance}
                durationInFrames={durationInFrames}
              />
            </div>
            <Audio
              src={staticFile(
                beat.accent ? "sfx/ding.wav" : ENTRANCE_SFX[entrance],
              )}
              volume={beat.accent ? 0.25 : 0.4}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const beatAt = (beats: Beat[], timeSec: number): Beat | null =>
  beats.find(
    (b) => timeSec >= b.fromSec && timeSec < b.fromSec + b.durationSec,
  ) ?? null;

// Slow camera moves on the speaker video, one per beat, cycling
// push-in → drift → pull-out so consecutive moves differ and stay continuous.
const ZOOM = 1.08;
const DRIFT_PX = 28;

export const cameraAt = (
  beats: Beat[],
  timeSec: number,
): { scale: number; x: number } => {
  let state = { scale: 1, x: 0 };
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (timeSec < b.fromSec) {
      break;
    }
    const mode = i % 3;
    const target =
      mode === 0
        ? { scale: ZOOM, x: 0 }
        : mode === 1
          ? { scale: ZOOM, x: -DRIFT_PX }
          : { scale: 1, x: 0 };
    const p = interpolate(
      timeSec,
      [b.fromSec, b.fromSec + b.durationSec],
      [0, 1],
      { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) },
    );
    state = {
      scale: state.scale + (target.scale - state.scale) * p,
      x: state.x + (target.x - state.x) * p,
    };
  }
  return state;
};

export const VIDEO_BOX_HEIGHT = FRAME.height - FRAME.videoTop;
