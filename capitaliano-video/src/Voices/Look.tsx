import { Audio } from "@remotion/media";
import { Fragment } from "react";
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
import {
  COLORS,
  CURSIVE,
  INTER_TIGHT,
  TIGHT_TRACKING,
} from "../Capitaliano/brand";
import { EndCard, TitleCard } from "./Cards";
import { ChapterPage, SLIDE, Sfx } from "./Paper";
import { Track, Wipe, WIPE_HALF_SEC } from "./Track";
import type { Prop, VoicesData } from "./types";
import { VoiceCaptions } from "./VoiceCaptions";

// Two full-frame looks for a single student's review, to compare with the
// paper desk:
// - "punch": the series' captions, a quick camera punch-in on each cue word
//   and a keyword sticker that slams in above the speaker's head;
// - "editorial": one big word at a time mid-frame and a cream panel that
//   drops in from the top with the cue phrase.

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Seconds each cue keeps the frame punched in or its panel up.
const HOLD = 1.3;

const cueEnd = (props: Prop[], i: number) =>
  Math.min(props[i].at + HOLD, props[i].until, props[i + 1]?.at ?? Infinity);

const Punched: React.FC<{
  data: VoicesData;
  mediaBase: string;
  punch: boolean;
}> = ({ data, mediaBase, punch }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const props = data.props ?? [];
  const face = data.students[data.order[0]].face;
  let scale = 1;
  if (punch) {
    props.forEach((p, i) => {
      const end = cueEnd(props, i);
      const s = interpolate(
        t,
        [p.at - 0.02, p.at + 0.1, end, end + 0.25],
        [1, 1.14, 1.16, 1],
        { ...clamp, easing: ease },
      );
      scale = Math.max(scale, s);
    });
  }
  return (
    <AbsoluteFill
      style={{ scale, transformOrigin: `${face[0]}px ${face[1]}px` }}
    >
      <Track
        segments={data.segments}
        students={data.students}
        mediaBase={mediaBase}
      />
    </AbsoluteFill>
  );
};

// A keyword sticker slammed in above the head.
const Sticker: React.FC<{ prop: Prop; total: number }> = ({ prop, total }) => {
  const frame = useCurrentFrame();
  const stamp = prop.kind === "stamp";
  const out = interpolate(frame, [total - 5, total], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 470,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          padding: stamp ? "8px 34px" : "14px 34px 18px",
          borderRadius: stamp ? 18 : 26,
          border: stamp ? `8px solid ${COLORS.red}` : "none",
          backgroundColor: stamp ? "rgba(255, 252, 249, 0.92)" : COLORS.green,
          color: stamp ? COLORS.red : COLORS.white,
          fontFamily: INTER_TIGHT,
          letterSpacing: stamp ? "0.14em" : TIGHT_TRACKING,
          fontWeight: 800,
          fontSize: prop.label.length > 14 ? 64 : 92,
          textTransform: "uppercase",
          maxWidth: 900,
          textAlign: "center",
          boxShadow: "0 22px 50px rgba(0, 0, 0, 0.3)",
          rotate: `${stamp ? -8 : -3}deg`,
          scale:
            interpolate(frame, [0, 5], [stamp ? 2.2 : 0.4, 1], {
              ...clamp,
              easing: stamp
                ? Easing.bezier(0.5, 0, 0.75, 0)
                : Easing.bezier(0.34, 1.6, 0.64, 1),
            }) *
            (1 - out * 0.2),
        }}
      >
        {prop.label}
      </div>
    </div>
  );
};

// A cream panel that drops from the top with the cue phrase.
const Panel: React.FC<{ prop: Prop; total: number }> = ({ prop, total }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 7, total - 6, total], [-520, 0, 0, -520], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 640,
        translate: `0px ${y}px`,
        backgroundColor: COLORS.cream,
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 70,
        gap: 6,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <div
        style={{
          fontFamily: CURSIVE,
          fontWeight: 700,
          fontSize: 50,
          color: COLORS.red,
          rotate: "-3deg",
        }}
      >
        {kickerFor(prop)}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: prop.label.length > 14 ? 84 : 120,
          lineHeight: 1,
          color: COLORS.darkGreen,
          textAlign: "center",
          maxWidth: 940,
          textWrap: "balance",
        }}
      >
        {prop.label}
      </div>
    </div>
  );
};

const KICKERS: Record<string, string> = {
  stamp: "виза",
  map: "город",
  clock: "время",
  chip: "",
  ticket: "поступила",
  stars: "итог",
};
const kickerFor = (p: Prop) => KICKERS[p.kind] ?? "";

// One big word at a time, mid-frame.
const BigWords: React.FC<{ data: VoicesData; hidden: [number, number][] }> = ({
  data,
  hidden,
}) => {
  const { fps } = useVideoConfig();
  const cues = new Set((data.props ?? []).map((p) => Math.round(p.at * 1000)));
  return (
    <>
      {data.captions.map((c, i) => {
        const start = c.startMs / 1000;
        if (hidden.some(([a, b]) => start >= a && start < b)) {
          return null;
        }
        const next = data.captions[i + 1];
        const end = Math.min(
          next ? next.startMs / 1000 : c.endMs / 1000 + 0.3,
          c.endMs / 1000 + 0.35,
        );
        const from = Math.round(start * fps);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={Math.max(1, Math.round(end * fps) - from)}
            layout="none"
          >
            <BigWord text={c.text.trim()} cue={cues.has(c.startMs)} />
          </Sequence>
        );
      })}
    </>
  );
};

const BigWord: React.FC<{ text: string; cue: boolean }> = ({ text, cue }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 1300,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
        fontWeight: 800,
        fontSize: 112,
        color: cue ? COLORS.cream : COLORS.white,
        textShadow: "0 6px 28px rgba(0, 0, 0, 0.55)",
        scale: interpolate(frame, [0, 3], [0.9, 1], clamp),
      }}
    >
      {cue ? (
        <span
          style={{
            padding: "0 22px 6px",
            borderRadius: 24,
            backgroundColor: COLORS.green,
            textShadow: "none",
          }}
        >
          {text}
        </span>
      ) : (
        text
      )}
    </div>
  );
};

export const Look: React.FC<{ data: VoicesData; mediaBase: string }> = ({
  data,
  mediaBase,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const punch = data.format === "punch";
  const props = data.props ?? [];
  const cards = data.items.filter((it) => it.kind !== "clip");
  const hidden = cards.map((it): [number, number] => [it.start, it.end]);
  let chapter = 0;
  const musicVolume = (f: number) => {
    const t = f / fps;
    const speaking = data.items.some(
      (it) => it.kind === "clip" && t >= it.start + 0.2 && t < it.end - 0.3,
    );
    const fade = interpolate(
      f,
      [0, 15, durationInFrames - 30, durationInFrames],
      [0, 1, 1, 0],
      clamp,
    );
    return (speaking ? 0.08 : 0.22) * fade;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <Punched data={data} mediaBase={mediaBase} punch={punch} />

      {/* Top fade and logo */}
      <AbsoluteFill
        style={{
          height: 430,
          background:
            "linear-gradient(rgba(255, 252, 249, 0.92), rgba(255, 252, 249, 0))",
        }}
      />
      <Img
        src={staticFile("logo.png")}
        style={{
          position: "absolute",
          top: 262,
          left: "50%",
          height: 62,
          translate: "-50% 0px",
        }}
      />

      {props.map((p, i) => {
        const total = sec(cueEnd(props, i)) - sec(p.at);
        return (
          <Sequence
            key={`cue-${i}`}
            from={sec(p.at)}
            durationInFrames={Math.max(1, total)}
            layout="none"
          >
            {punch ? (
              <Sticker prop={p} total={total} />
            ) : (
              <Panel prop={p} total={total} />
            )}
          </Sequence>
        );
      })}

      {punch ? (
        <VoiceCaptions captions={data.captions} hidden={hidden} />
      ) : (
        <BigWords data={data} hidden={hidden} />
      )}

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
        return (
          <Sequence
            key={i}
            from={sec(it.start)}
            durationInFrames={Math.max(1, sec(it.end) - sec(it.start))}
            layout="none"
          >
            {it.kind === "title" ? (
              <TitleCard
                text={it.text}
                kicker={data.kicker ?? "отзыв студента"}
                marco={it.marco}
              />
            ) : (
              <EndCard text={it.text} marco={it.marco} />
            )}
          </Sequence>
        );
      })}

      {/* Laurel wipes out of the title and into the end card */}
      {cards
        .filter((it) => it.kind === "title" || it.kind === "end")
        .map((it, i) => (
          <Sequence
            key={`wipe-${i}`}
            from={Math.max(
              0,
              sec((it.kind === "title" ? it.end : it.start) - WIPE_HALF_SEC),
            )}
            durationInFrames={sec(2 * WIPE_HALF_SEC)}
            layout="none"
          >
            <Wipe />
          </Sequence>
        ))}

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
              src={punch ? "sfx/gx/whoosh-cine.wav" : "sfx/gx/paper-flip.wav"}
              volume={0.4}
            />
          )}
        </Fragment>
      ))}
      {cards.map((it, i) =>
        it.kind === "chapter" ? (
          <Sfx
            key={`ch-${i}`}
            at={it.start - SLIDE}
            src="sfx/gx/paper-riffle.wav"
            volume={0.5}
          />
        ) : (
          <Sfx
            key={`w-${i}`}
            at={(it.kind === "title" ? it.end : it.start) - WIPE_HALF_SEC}
            src="sfx/whoosh.wav"
            volume={0.35}
          />
        ),
      )}
    </AbsoluteFill>
  );
};
