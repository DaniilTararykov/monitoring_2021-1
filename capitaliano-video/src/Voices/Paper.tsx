import { Audio } from "@remotion/media";
import { Fragment } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  CURSIVE,
  INTER_TIGHT,
  TIGHT_TRACKING,
} from "../Capitaliano/brand";
import { EndCard, TitleCard } from "./Cards";
import { PaperProp } from "./PaperProps";
import { Track } from "./Track";
import type { Item, StudentInfo, VoicesData } from "./types";

// "Paper desk" edit of a student review: the student plays in a taped photo
// card on the brand's dotted cream, paper cut-outs land around the card on
// the words they illustrate, chapter pages slide over between parts, and
// big 1-3 word captions sit on the desk under the card.

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Photo card geometry: a 4:5 window onto the 1080×1920 footage.
const CARD = { left: 150, top: 340, pad: 20, strip: 100 };
const VIDEO_W = 740;
const VIDEO_H = 925;
const SCALE = VIDEO_W / 1080;
// How long cards overlap the footage while they slide in or out.
const SLIDE = 0.27;

const Sfx: React.FC<{ at: number; src: string; volume: number }> = ({
  at,
  src,
  volume,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      from={Math.max(0, Math.round(at * fps))}
      durationInFrames={2 * fps}
      layout="none"
    >
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};

const Desk: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.cream,
      backgroundImage: `radial-gradient(${COLORS.dot} 2.5px, transparent 2.5px)`,
      backgroundSize: "36px 36px",
      backgroundPosition: "18px 18px",
    }}
  >
    {/* A green cutting mat under the photo card */}
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 290,
        width: 900,
        height: 1190,
        rotate: "2.5deg",
        borderRadius: 28,
        backgroundColor: "rgba(47, 141, 79, 0.13)",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(255, 255, 255, 0.55) 2px, transparent 2px)",
        backgroundSize: "60px 60px",
        backgroundPosition: "-1px -1px",
      }}
    />
  </AbsoluteFill>
);

const PhotoCard: React.FC<{
  data: VoicesData;
  student: StudentInfo;
  mediaBase: string;
}> = ({ data, student, mediaBase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Stop-motion sway in 8 fps steps.
  const step = Math.floor(frame / (fps / 8));
  const rotate = -1.6 + (random(`card-${step}`) - 0.5) * 0.35;
  const cropTop = Math.min(570, Math.max(0, student.face[1] - 560));
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.left,
        top: CARD.top,
        padding: CARD.pad,
        paddingBottom: 0,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        rotate: `${rotate}deg`,
        boxShadow:
          "0 3px 4px rgba(0, 0, 0, 0.12), 0 30px 60px rgba(27, 94, 52, 0.25)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: VIDEO_W,
          height: VIDEO_H,
          overflow: "hidden",
          backgroundColor: COLORS.cream,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -cropTop * SCALE,
            width: 1080,
            height: 1920,
            transformOrigin: "0 0",
            scale: SCALE,
          }}
        >
          <Track
            segments={data.segments}
            students={data.students}
            mediaBase={mediaBase}
          />
        </div>
      </div>
      <div
        style={{
          height: CARD.strip,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6px",
        }}
      >
        <div
          style={{
            fontFamily: CURSIVE,
            fontWeight: 700,
            fontSize: 50,
            color: COLORS.red,
            rotate: "-1deg",
          }}
        >
          {student.name} · {student.uni}
        </div>
        <div
          style={{
            padding: "6px 18px",
            borderRadius: 999,
            backgroundColor: COLORS.green,
            color: COLORS.white,
            fontFamily: INTER_TIGHT,
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          {student.level}
        </div>
      </div>
      {/* Tape on the top corners */}
      {[
        { left: -40, rotate: -38 },
        { right: -40, rotate: 38 },
      ].map(({ rotate: r, ...side }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 6,
            width: 150,
            height: 44,
            rotate: `${r}deg`,
            backgroundColor: "rgba(47, 141, 79, 0.3)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
            ...side,
          }}
        />
      ))}
    </div>
  );
};

type Chunk = {
  words: { text: string; start: number; end: number; cue: boolean }[];
  start: number;
  end: number;
};

// Captions in 1-3 word chunks, broken at punctuation and pauses.
const chunkCaptions = (data: VoicesData): Chunk[] => {
  const cues = new Set((data.props ?? []).map((p) => Math.round(p.at * 1000)));
  const chunks: Chunk[] = [];
  let cur: Chunk | null = null;
  for (const c of data.captions) {
    const word = {
      text: c.text.trim(),
      start: c.startMs / 1000,
      end: c.endMs / 1000,
      cue: cues.has(c.startMs),
    };
    const gap = cur ? word.start - cur.end : 0;
    if (!cur || cur.words.length >= 3 || gap > 0.35) {
      cur = { words: [], start: word.start, end: word.end };
      chunks.push(cur);
    }
    cur.words.push(word);
    cur.end = word.end;
    if (/[.,!?:;—»]$/.test(word.text) || c.pageBreakAfter) {
      cur = null;
    }
  }
  return chunks;
};

const ChunkView: React.FC<{ chunk: Chunk }> = ({ chunk }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = chunk.start + frame / fps;
  return (
    <div
      style={{
        position: "absolute",
        top: 1405,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 14,
        rowGap: 4,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.12,
        translate: `0px ${interpolate(frame, [0, 4], [18, 0], { ...clamp, easing: ease })}px`,
        opacity: interpolate(frame, [0, 3], [0, 1], clamp),
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              padding: "0 12px",
              borderRadius: 16,
              color: active
                ? COLORS.white
                : w.cue
                  ? COLORS.red
                  : COLORS.darkGreen,
              backgroundColor: active ? COLORS.green : "transparent",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const PaperCaptions: React.FC<{ data: VoicesData }> = ({ data }) => {
  const { fps } = useVideoConfig();
  const chunks = chunkCaptions(data);
  const clips = data.items.filter((it) => it.kind === "clip");
  return (
    <>
      {chunks.map((ch, i) => {
        const owner = clips.find(
          (it) => ch.start >= it.start - 0.01 && ch.start < it.end,
        );
        const next = chunks[i + 1];
        const end = Math.min(
          next ? next.start : ch.end + 0.4,
          ch.end + 0.6,
          owner ? owner.end - 0.15 : ch.end,
        );
        const from = Math.round(ch.start * fps);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={Math.max(1, Math.round(end * fps) - from)}
            layout="none"
          >
            <ChunkView chunk={ch} />
          </Sequence>
        );
      })}
    </>
  );
};

// A sheet of paper that slides up over the desk for a chapter.
const ChapterPage: React.FC<{ text: string; index: number; total: number }> = ({
  text,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = Math.round(SLIDE * fps);
  const y = interpolate(
    frame,
    [0, slide, total - slide, total],
    [1920, 0, 0, -1920],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  return (
    <AbsoluteFill
      style={{
        translate: `0px ${y}px`,
        rotate: `${interpolate(frame, [0, slide], [4, 0], clamp)}deg`,
        backgroundColor: COLORS.cream,
        backgroundImage: `radial-gradient(${COLORS.dot} 2.5px, transparent 2.5px)`,
        backgroundSize: "36px 36px",
        backgroundPosition: "18px 18px",
        boxShadow: "0 -30px 60px rgba(27, 94, 52, 0.18)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 18,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <div
        style={{
          fontSize: 230,
          fontWeight: 800,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `5px ${COLORS.green}`,
        }}
      >
        {String(index).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.05,
          color: COLORS.darkGreen,
          textAlign: "center",
          maxWidth: 900,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
      <svg width={420} height={40} viewBox="0 0 420 40">
        <path
          d="M8 26c60-14 130-18 200-12s140 10 204-6"
          fill="none"
          stroke={COLORS.red}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={interpolate(
            frame,
            [slide, slide + 0.4 * fps],
            [1, 0],
            clamp,
          )}
        />
      </svg>
    </AbsoluteFill>
  );
};

// Title and end cards from the series, sliding like paper on the way out
// (title) or in (end card), over the footage's padded edges.
const Slider: React.FC<{
  children: React.ReactNode;
  total: number;
  enter: boolean;
}> = ({ children, total, enter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = Math.round(SLIDE * fps);
  const y = enter
    ? interpolate(frame, [0, slide], [1920, 0], {
        ...clamp,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      })
    : interpolate(frame, [total - slide, total], [0, -1920], {
        ...clamp,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      });
  return (
    <AbsoluteFill style={{ translate: `0px ${y}px` }}>{children}</AbsoluteFill>
  );
};

const isClip = (it: Item) => it.kind === "clip";

export const Paper: React.FC<{ data: VoicesData; mediaBase: string }> = ({
  data,
  mediaBase,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const student = data.students[data.order[0]];
  const props = data.props ?? [];
  let chapter = 0;
  const musicVolume = (f: number) => {
    const t = f / fps;
    const speaking = data.items.some(
      (it) => isClip(it) && t >= it.start + 0.2 && t < it.end - 0.3,
    );
    const fade = interpolate(
      f,
      [0, 15, durationInFrames - 30, durationInFrames],
      [0, 1, 1, 0],
      clamp,
    );
    return (speaking ? 0.07 : 0.2) * fade;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <Desk />
      <PhotoCard data={data} student={student} mediaBase={mediaBase} />

      {props.map((p, i) => {
        const next = props.slice(i + 1).find((q) => q.slot === p.slot);
        const until = Math.min(
          Math.max(p.until, p.at + 1.8),
          next ? next.at : Infinity,
        );
        return (
          <Sequence
            key={`prop-${i}`}
            from={sec(p.at)}
            durationInFrames={Math.max(1, sec(until) - sec(p.at))}
            layout="none"
          >
            <PaperProp prop={p} durationInFrames={sec(until) - sec(p.at)} />
          </Sequence>
        );
      })}

      <PaperCaptions data={data} />
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          top: 262,
          left: "50%",
          height: 52,
          translate: "-50% 0px",
        }}
      />

      {data.items.map((it, i) => {
        if (it.kind === "clip") {
          return null;
        }
        if (it.kind === "chapter") {
          chapter += 1;
          const from = sec(it.start - SLIDE);
          const total = sec(it.end + SLIDE) - from;
          return (
            <Sequence
              key={i}
              from={from}
              durationInFrames={total}
              layout="none"
            >
              <ChapterPage text={it.text} index={chapter} total={total} />
            </Sequence>
          );
        }
        if (it.kind === "title") {
          const total = sec(it.end + SLIDE);
          return (
            <Sequence key={i} durationInFrames={total} layout="none">
              <Slider total={total} enter={false}>
                <TitleCard
                  text={it.text}
                  kicker={data.kicker ?? "отзыв студента"}
                  marco={it.marco}
                />
              </Slider>
            </Sequence>
          );
        }
        const from = sec(it.start - SLIDE);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={durationInFrames - from}
            layout="none"
          >
            <Slider total={durationInFrames - from} enter>
              <EndCard text={it.text} marco={it.marco} />
            </Slider>
          </Sequence>
        );
      })}

      {/* Sound: a music bed ducked under speech, paper and pops on cues */}
      {data.music ? (
        <Audio
          src={staticFile(`music/${data.music}.mp3`)}
          volume={musicVolume}
        />
      ) : null}
      {props.map((p, i) => (
        <Fragment key={`sfx-${i}`}>
          {p.kind === "stamp" ? (
            <Sfx at={p.at} src="sfx/gx/impact-1.wav" volume={0.35} />
          ) : (
            <Sfx
              at={p.at}
              src={i % 2 ? "sfx/gx/pop-3.wav" : "sfx/gx/pop-1.wav"}
              volume={0.45}
            />
          )}
          {p.kind === "clock" ? (
            <Sfx at={p.at + 0.1} src="sfx/gx/tick-1.wav" volume={0.4} />
          ) : null}
        </Fragment>
      ))}
      {data.items.map((it, i) =>
        it.kind === "chapter" ? (
          <Sfx
            key={`ch-${i}`}
            at={it.start - SLIDE}
            src="sfx/gx/paper-riffle.wav"
            volume={0.5}
          />
        ) : it.kind === "title" ? (
          <Sfx
            key={`ti-${i}`}
            at={it.end - 0.1}
            src="sfx/gx/paper-flip.wav"
            volume={0.5}
          />
        ) : it.kind === "end" ? (
          <Fragment key={`end-${i}`}>
            <Sfx
              at={it.start - SLIDE}
              src="sfx/gx/paper-flip.wav"
              volume={0.5}
            />
            <Sfx at={it.start + 0.6} src="sfx/gx/ding-1.wav" volume={0.25} />
          </Fragment>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
