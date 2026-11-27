import { Audio } from "@remotion/media";
import { Fragment } from "react";
import {
  AbsoluteFill,
  Easing,
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
import { Header } from "./Overlays";
import { CITY_POINTS, ITALY_PATH, ITALY_VIEWBOX } from "./italy";
import { ChapterPage, SLIDE, Sfx } from "./Paper";
import { Track, Wipe, WIPE_HALF_SEC } from "./Track";
import type { Prop, VoicesData } from "./types";
import { VoiceCaptions } from "./VoiceCaptions";

// A student review told as a story (problem, path, result) in the series'
// full-frame look: the student on camera with the series captions, and the
// key point of each line as a brand print card above the head.
// A print's label is "kicker|text"; "checks" lists items as "a;b", "name"
// is "kicker|name|place|level".

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// A print stays up at least this long unless the next one replaces it.
const MIN_HOLD = 2.2;
const PRINT_TOP = 370;
// Prints sit lower when the story bar takes the row under the logo.
const PRINT_TOP_WITH_STEPS = 430;

const printEnd = (props: Prop[], i: number) =>
  Math.min(
    Math.max(props[i].until, props[i].at + MIN_HOLD),
    props[i + 1]?.at ?? Infinity,
  );

const Camera: React.FC<{ data: VoicesData; mediaBase: string }> = ({
  data,
  mediaBase,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const props = data.props ?? [];
  const face = data.students[data.order[0]].face;
  // A gentle push-in as each print lands.
  let scale = 1;
  props.forEach((p) => {
    scale = Math.max(
      scale,
      interpolate(
        t,
        [p.at - 0.02, p.at + 0.25, p.at + 1.4, p.at + 1.9],
        [1, 1.07, 1.07, 1],
        {
          ...clamp,
          easing: ease,
        },
      ),
    );
  });
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

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: CURSIVE,
      fontWeight: 700,
      fontSize: 46,
      lineHeight: 1,
      color: COLORS.red,
      rotate: "-2deg",
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{ children: React.ReactNode; long: boolean }> = ({
  children,
  long,
}) => (
  <div
    style={{
      fontFamily: INTER_TIGHT,
      letterSpacing: TIGHT_TRACKING,
      fontWeight: 800,
      fontSize: long ? 58 : 72,
      lineHeight: 1.04,
      color: COLORS.darkGreen,
      textAlign: "center",
      textWrap: "balance",
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 40,
}) => (
  <div
    style={{
      padding: "8px 24px 10px",
      borderRadius: 999,
      backgroundColor: COLORS.green,
      color: COLORS.white,
      fontFamily: INTER_TIGHT,
      fontWeight: 800,
      fontSize: size,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={54} height={54} viewBox="0 0 48 48">
          <path
            d="m24 5 5.6 12 13 1.5-9.7 8.9 2.7 12.9L24 33.8l-11.6 6.5 2.7-12.9-9.7-8.9 13-1.5z"
            fill={COLORS.red}
            opacity={interpolate(
              frame,
              [6 + i * 3, 9 + i * 3],
              [0.15, 1],
              clamp,
            )}
            transform={`rotate(${interpolate(frame, [6 + i * 3, 9 + i * 3], [-40, 0], clamp)} 24 24)`}
          />
        </svg>
      ))}
    </div>
  );
};

const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={58} height={58} viewBox="0 0 48 48">
      <circle
        cx={24}
        cy={24}
        r={19}
        fill="none"
        stroke={COLORS.darkGreen}
        strokeWidth={3.5}
      />
      <path
        d="M24 24v-9"
        stroke={COLORS.darkGreen}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <path
        d="M24 24v-14"
        stroke={COLORS.red}
        strokeWidth={3.5}
        strokeLinecap="round"
        transform={`rotate(${interpolate(frame, [0, 20], [0, 720], { ...clamp, easing: ease })} 24 24)`}
      />
    </svg>
  );
};

const Visto: React.FC = () => {
  const frame = useCurrentFrame();
  const at = 8;
  return (
    <div
      style={{
        position: "absolute",
        right: -34,
        top: -30,
        padding: "4px 18px",
        border: `6px solid ${COLORS.red}`,
        borderRadius: 14,
        color: COLORS.red,
        backgroundColor: "rgba(255, 252, 249, 0.9)",
        fontFamily: INTER_TIGHT,
        fontWeight: 800,
        fontSize: 46,
        letterSpacing: "0.14em",
        rotate: "12deg",
        opacity: interpolate(frame, [at, at + 2], [0, 1], clamp),
        scale: interpolate(frame, [at, at + 5], [2.2, 1], {
          ...clamp,
          easing: Easing.bezier(0.5, 0, 0.75, 0),
        }),
      }}
    >
      VISTO
    </div>
  );
};

const PrintBody: React.FC<{ prop: Prop }> = ({ prop }) => {
  const parts = prop.label.split("|");
  const [kicker, text] = parts;
  const long = (text ?? "").length > 22;
  switch (prop.kind) {
    case "name": {
      const [, name, place, level] = parts;
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <Headline long={false}>{name}</Headline>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontFamily: INTER_TIGHT,
                fontWeight: 700,
                fontSize: 38,
                color: COLORS.darkGray,
              }}
            >
              {place}
            </div>
            <Pill size={30}>{level}</Pill>
          </div>
        </>
      );
    }
    case "checks":
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {text.split(";").map((item) => (
              <Pill key={item}>✓ {item}</Pill>
            ))}
          </div>
        </>
      );
    case "stars":
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <Stars />
          <Headline long={long}>{text}</Headline>
        </>
      );
    case "clock":
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Clock />
            <Headline long={long}>{text}</Headline>
          </div>
        </>
      );
    case "map2": {
      // "City:University;City:University" pinned on a small map of Italy.
      const pins = text.split(";").map((p) => p.split(":"));
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <PinMap cities={pins.map(([city]) => city)} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pins.map(([city, uni]) => (
                <div
                  key={city}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      fontFamily: CURSIVE,
                      fontWeight: 700,
                      fontSize: 38,
                      lineHeight: 1,
                      color: COLORS.red,
                    }}
                  >
                    {city}
                  </div>
                  <Pill size={34}>✓ {uni}</Pill>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
    case "visa":
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <Headline long={long}>{text}</Headline>
          <Visto />
        </>
      );
    default:
      return (
        <>
          <Kicker>{kicker}</Kicker>
          <Headline long={long}>{text}</Headline>
        </>
      );
  }
};

const PinMap: React.FC<{ cities: string[] }> = ({ cities }) => {
  const frame = useCurrentFrame();
  const width = 170;
  return (
    <svg
      width={width}
      height={(width * ITALY_VIEWBOX.height) / ITALY_VIEWBOX.width}
      viewBox={`0 0 ${ITALY_VIEWBOX.width} ${ITALY_VIEWBOX.height}`}
    >
      <path
        d={ITALY_PATH}
        fill="rgba(47, 141, 79, 0.12)"
        stroke={COLORS.green}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {cities.map((city, i) => {
        const [cx, cy] = CITY_POINTS[city] ?? [0, 0];
        const at = 6 + i * 6;
        return (
          <circle
            key={city}
            cx={cx}
            cy={cy}
            r={interpolate(frame, [at, at + 5], [0, 11], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.8, 0.64, 1),
            })}
            fill={COLORS.red}
            stroke={COLORS.white}
            strokeWidth={3}
          />
        );
      })}
    </svg>
  );
};

// The story so far: one pill per step under the logo, the current one green.
const StepBar: React.FC<{ steps: string[]; active: number }> = ({
  steps,
  active,
}) => (
  <div
    style={{
      position: "absolute",
      top: 346,
      left: 70,
      right: 55,
      display: "flex",
      justifyContent: "center",
      gap: 8,
      fontFamily: INTER_TIGHT,
      fontWeight: 700,
      fontSize: 25,
      letterSpacing: "0.01em",
    }}
  >
    {steps.map((step, i) => (
      <div
        key={step}
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          backgroundColor:
            i === active ? COLORS.green : "rgba(255, 252, 249, 0.9)",
          color:
            i === active
              ? COLORS.white
              : i < active
                ? COLORS.green
                : "rgba(30, 30, 30, 0.45)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.14)",
        }}
      >
        {i < active ? "✓ " : ""}
        {step}
      </div>
    ))}
  </div>
);

const StepTrack: React.FC<{ data: VoicesData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const clips = data.items.filter((it) => it.kind === "clip" && it.step);
  const steps = [
    ...new Set(clips.map((it) => (it.kind === "clip" ? it.step : ""))),
  ] as string[];
  const current = clips.filter((it) => it.start <= t + 0.01).pop();
  if (
    !current ||
    current.kind !== "clip" ||
    t >= (clips[clips.length - 1]?.end ?? 0)
  ) {
    return null;
  }
  return <StepBar steps={steps} active={steps.indexOf(current.step ?? "")} />;
};

// A cream print card that drops in above the speaker's head.
const Print: React.FC<{ prop: Prop; total: number; top: number }> = ({
  prop,
  total,
  top,
}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [total - 6, total], [0, 1], clamp);
  const enter = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: ease });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, enter * 1.6) * (1 - out),
        translate: `0px ${(1 - enter) * -40 - out * 30}px`,
        scale: 0.92 + enter * 0.08,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          maxWidth: 900,
          padding: "26px 40px 30px",
          borderRadius: 32,
          backgroundColor: "rgba(255, 252, 249, 0.97)",
          boxShadow: "0 22px 54px rgba(0, 0, 0, 0.26)",
        }}
      >
        <PrintBody prop={prop} />
      </div>
    </div>
  );
};

export const Review: React.FC<{ data: VoicesData; mediaBase: string }> = ({
  data,
  mediaBase,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);
  const props = data.props ?? [];
  const cards = data.items.filter((it) => it.kind !== "clip");
  const hidden = cards.map((it): [number, number] => [it.start, it.end]);
  const student = data.students[data.order[0]];
  const hasSteps = data.items.some((it) => it.kind === "clip" && it.step);
  // Laurel wipes out of the title card, between story steps and into the
  // end card.
  const wipes = data.items.flatMap((it, i) => {
    const prev = data.items[i - 1];
    if (it.kind === "title") {
      return [it.end];
    }
    if (it.kind === "end") {
      return [it.start];
    }
    return it.kind === "clip" &&
      prev?.kind === "clip" &&
      it.step &&
      prev.step !== it.step
      ? [it.start]
      : [];
  });
  let chapter = 0;
  const musicVolume = (f: number) => {
    const t = f / fps;
    const speaking = data.items.some(
      (it) => it.kind === "clip" && t >= it.start + 0.2 && t < it.end - 0.3,
    );
    const fade = interpolate(
      f,
      [0, 10, durationInFrames - 30, durationInFrames],
      [0, 1, 1, 0],
      clamp,
    );
    return (speaking ? 0.07 : 0.22) * fade;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <Camera data={data} mediaBase={mediaBase} />
      <Header fadeIn />
      {hasSteps ? <StepTrack data={data} /> : null}

      {props.map((p, i) => {
        const total = sec(printEnd(props, i)) - sec(p.at);
        return (
          <Sequence
            key={`print-${i}`}
            from={sec(p.at)}
            durationInFrames={Math.max(1, total)}
            layout="none"
          >
            <Print
              prop={p}
              total={total}
              top={hasSteps ? PRINT_TOP_WITH_STEPS : PRINT_TOP}
            />
          </Sequence>
        );
      })}

      <VoiceCaptions captions={data.captions} hidden={hidden} />

      {cards.map((it, i) => {
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
              <EndCard
                text={it.text}
                marco={it.marco}
                photo={it.photo ? `${mediaBase}/${it.photo}` : undefined}
                caption={`${student.name} · ${student.uni}`}
              />
            )}
          </Sequence>
        );
      })}
      {wipes.map((at) => (
        <Sequence
          key={`wipe-${at}`}
          from={Math.max(0, sec(at - WIPE_HALF_SEC))}
          durationInFrames={sec(2 * WIPE_HALF_SEC)}
          layout="none"
        >
          <Wipe />
        </Sequence>
      ))}

      {wipes
        .filter((at) => !cards.some((it) => it.start === at || it.end === at))
        .map((at) => (
          <Sfx
            key={`step-${at}`}
            at={at - WIPE_HALF_SEC}
            src="sfx/whoosh.wav"
            volume={0.3}
          />
        ))}
      {data.music ? (
        <Audio
          src={staticFile(`music/${data.music}.mp3`)}
          volume={musicVolume}
        />
      ) : null}
      {props.map((p, i) => (
        <Fragment key={`sfx-${i}`}>
          <Sfx at={p.at} src="sfx/gx/whoosh-cine.wav" volume={0.3} />
          {p.kind === "visa" ? (
            <Sfx at={p.at + 8 / fps} src="sfx/gx/impact-1.wav" volume={0.3} />
          ) : null}
          {p.kind === "clock" ? (
            <Sfx at={p.at + 0.05} src="sfx/gx/tick-1.wav" volume={0.4} />
          ) : null}
          {p.kind === "stars" ? (
            <Sfx at={p.at + 0.3} src="sfx/gx/ding-1.wav" volume={0.22} />
          ) : null}
        </Fragment>
      ))}
      {cards.map((it, i) =>
        it.kind === "chapter" ? (
          <Sfx
            key={`ch-${i}`}
            at={it.start - SLIDE}
            src="sfx/gx/paper-riffle.wav"
            volume={0.45}
          />
        ) : it.kind === "title" ? (
          <Sfx
            key={`ti-${i}`}
            at={it.end - WIPE_HALF_SEC}
            src="sfx/whoosh.wav"
            volume={0.35}
          />
        ) : (
          <Fragment key={`end-${i}`}>
            <Sfx
              at={it.start - WIPE_HALF_SEC}
              src="sfx/whoosh.wav"
              volume={0.35}
            />
            <Sfx at={it.start + 0.6} src="sfx/gx/ding-1.wav" volume={0.22} />
          </Fragment>
        ),
      )}
    </AbsoluteFill>
  );
};
