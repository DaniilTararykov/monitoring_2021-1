import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Segment, StudentInfo } from "./types";

const FADE_FRAMES = 3;
export const WIPE_HALF_SEC = 0.28;

// One cut of source footage, with a slow camera move. Jump cuts inside one
// answer alternate between a wide and a tighter frame so the cut reads as a
// camera change instead of a skip.
const SegmentView: React.FC<{
  seg: Segment;
  index: number;
  face: number[];
  mediaBase: string;
  durationInFrames: number;
}> = ({ seg, index, face, mediaBase, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tight = seg.cut === "jump" && index % 2 === 1;
  const base = tight ? 1.12 : 1.02;
  const muteFrames = seg.muteUntil
    ? Math.round((seg.muteUntil - seg.from) * fps)
    : 0;

  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${face[0]}px ${face[1]}px`,
        scale: interpolate(frame, [0, durationInFrames], [base, base + 0.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Video
        src={staticFile(`${mediaBase}/${seg.src}`)}
        trimBefore={Math.round(seg.from * fps)}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
        volume={(f) =>
          f < muteFrames
            ? 0
            : interpolate(
                f,
                [
                  muteFrames,
                  muteFrames + FADE_FRAMES,
                  durationInFrames - FADE_FRAMES,
                  durationInFrames,
                ],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
        }
      />
    </AbsoluteFill>
  );
};

export const Track: React.FC<{
  segments: Segment[];
  students: Record<string, StudentInfo>;
  mediaBase: string;
}> = ({ segments, students, mediaBase }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {segments.map((seg, i) => {
        const from = Math.round(seg.at * fps);
        const next = segments[i + 1];
        const end = next
          ? Math.round(next.at * fps)
          : Math.round((seg.at + seg.to - seg.from) * fps);
        return (
          <Sequence
            key={i}
            name={`${students[seg.student].name} ${seg.from.toFixed(1)}s`}
            from={from}
            durationInFrames={Math.max(1, end - from)}
            layout="none"
          >
            <SegmentView
              seg={seg}
              index={i}
              face={students[seg.student].face}
              mediaBase={mediaBase}
              durationInFrames={Math.max(1, end - from)}
            />
          </Sequence>
        );
      })}
    </>
  );
};

// Cream wipe with the laurel that covers a change of speaker or a card.
export const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const half = Math.round(WIPE_HALF_SEC * fps);
  const x = interpolate(frame, [0, half, 2 * half], [-1, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  return (
    <AbsoluteFill
      style={{
        translate: `${x * 115}% 0px`,
        background:
          "linear-gradient(90deg, rgba(255, 252, 249, 0) 0%, rgb(255, 252, 249) 12%, rgb(255, 252, 249) 88%, rgba(255, 252, 249, 0) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("laurel.png")}
        style={{ width: 260, opacity: 0.9 }}
      />
    </AbsoluteFill>
  );
};
