import { Audio } from "@remotion/media";
import { Fragment } from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { COLORS } from "../Capitaliano/brand";
import { EndCard, MythCard, TitleCard } from "./Cards";
import {
  FacesStrip,
  Header,
  Passport,
  QuestionBubble,
  TruthChip,
} from "./Overlays";
import { Track, Wipe, WIPE_HALF_SEC } from "./Track";
import type { Item, VoicesData } from "./types";
import { VoiceCaptions } from "./VoiceCaptions";

export type VoicesProps = {
  data: VoicesData;
  // Folder in public/ with the 1080×1920 interview proxies.
  mediaBase: string;
};

const BUBBLE_SEC = 2.8;

const KICKER: Record<VoicesData["format"], string> = {
  story: "история студента",
  question: "вопрос студентам",
  myths: "разбираем",
};

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

const changesScene = (prev: Item, item: Item) =>
  prev.kind !== "clip" || item.kind !== "clip" || prev.student !== item.student;

export const Voices: React.FC<VoicesProps> = ({ data, mediaBase }) => {
  const { fps } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const names = Object.fromEntries(
    Object.entries(data.students).map(([id, s]) => [id, s.name]),
  );
  const hidden = data.items
    .filter((it) => it.kind !== "clip" || it.passport)
    .map((it): [number, number] => [it.start, it.end]);
  const mythNumber = (index: number) =>
    data.items.slice(0, index + 1).filter((it) => it.kind === "myth").length;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <Track
        segments={data.segments}
        students={data.students}
        mediaBase={mediaBase}
      />

      {data.items.map((it, i) => {
        const len = Math.max(1, sec(it.end) - sec(it.start));
        if (it.kind === "clip") {
          const bubbleLen = it.bubbleLead
            ? sec(it.bubbleLead + 1.2)
            : Math.min(len, sec(BUBBLE_SEC));
          return (
            <Sequence
              key={i}
              from={sec(it.start)}
              durationInFrames={len}
              layout="none"
              name={`Item ${i + 1}`}
            >
              {data.format === "question" ? (
                <FacesStrip
                  order={data.order}
                  active={it.student}
                  names={names}
                />
              ) : null}
              {it.bubble ? (
                <Sequence durationInFrames={bubbleLen} layout="none">
                  <QuestionBubble text={it.bubble} />
                </Sequence>
              ) : null}
              {it.passport ? (
                <Passport student={data.students[it.student]} />
              ) : null}
              {it.truth ? <TruthChip text={it.truth} /> : null}
            </Sequence>
          );
        }
        return (
          <Sequence
            key={i}
            from={sec(it.start)}
            durationInFrames={len}
            layout="none"
            name={`Card ${i + 1}`}
          >
            {it.kind === "title" ? (
              <TitleCard text={it.text} kicker={KICKER[data.format]} />
            ) : it.kind === "myth" ? (
              <MythCard text={it.text} index={mythNumber(i)} />
            ) : (
              <EndCard text={it.text} />
            )}
          </Sequence>
        );
      })}

      <VoiceCaptions captions={data.captions} hidden={hidden} />
      {data.items.map((it, i) =>
        it.kind === "end" ? null : (
          <Sequence
            key={`header-${i}`}
            from={sec(it.start)}
            durationInFrames={Math.max(1, sec(it.end) - sec(it.start))}
            layout="none"
          >
            <Header fadeIn={i === 0} />
          </Sequence>
        ),
      )}

      {/* Wipes over every change of speaker or card */}
      {data.items.map((it, i) =>
        i > 0 && changesScene(data.items[i - 1], it) ? (
          <Sequence
            key={`wipe-${i}`}
            from={Math.max(0, sec(it.start - WIPE_HALF_SEC))}
            durationInFrames={sec(2 * WIPE_HALF_SEC)}
            layout="none"
          >
            <Wipe />
          </Sequence>
        ) : null,
      )}

      {/* Sound design */}
      {data.items.map((it, i) => (
        <Fragment key={`sfx-${i}`}>
          {i > 0 && changesScene(data.items[i - 1], it) ? (
            <Sfx
              at={it.start - WIPE_HALF_SEC}
              src="sfx/whoosh.wav"
              volume={0.35}
            />
          ) : null}
          {it.kind === "clip" && it.bubble ? (
            <Sfx at={it.start} src="sfx/switch.wav" volume={0.3} />
          ) : null}
          {it.kind === "clip" && it.passport ? (
            <Sfx at={it.start} src="sfx/page-turn.wav" volume={0.4} />
          ) : null}
          {it.kind === "clip" && it.truth ? (
            <Sfx at={it.start + 0.3} src="sfx/ding.wav" volume={0.2} />
          ) : null}
          {it.kind === "end" ? (
            <Sfx at={it.start + 0.6} src="sfx/ding.wav" volume={0.22} />
          ) : null}
        </Fragment>
      ))}
    </AbsoluteFill>
  );
};
