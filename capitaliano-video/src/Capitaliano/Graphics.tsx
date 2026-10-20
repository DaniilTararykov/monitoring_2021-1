import { Audio } from "@remotion/media";
import {
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, CURSIVE, INTER_TIGHT, TIGHT_TRACKING } from "./brand";

export type CardGraphic = {
  kind: "card";
  text: string;
  variant: "white" | "green";
  // Red cursive note under the card (slot A only).
  note?: string;
  // Cross out the text with a red line (a myth being busted).
  strike?: boolean;
};

export type StatGraphic = {
  kind: "stat";
  // Counted up from 0; use valueText instead for non-numeric values.
  value?: number;
  valueText?: string;
  suffix?: string;
  label: string;
};

export type StepsGraphic = {
  kind: "steps";
  // 0 shows the three steps with none active.
  active: 0 | 1 | 2 | 3;
  text: string;
};

export type CompareGraphic = {
  kind: "compare";
  good: { title: string; sub: string };
  bad: { title: string; sub: string };
  // When the second card appears, relative to the beat start.
  badAtSec: number;
};

export type MeterGraphic = {
  kind: "meter";
  label: string;
  endLabel: string;
};

export type Graphic =
  | CardGraphic
  | StatGraphic
  | StepsGraphic
  | CompareGraphic
  | MeterGraphic;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const CardView: React.FC<{ g: CardGraphic; compact: boolean }> = ({
  g,
  compact,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isGreen = g.variant === "green";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: compact ? "26px 44px" : "32px 48px",
          borderRadius: 32,
          backgroundColor: isGreen ? COLORS.green : COLORS.white,
          color: isGreen ? COLORS.white : COLORS.darkGreen,
          boxShadow: "0 20px 50px rgba(27, 94, 52, 0.16)",
          fontFamily: INTER_TIGHT,
          fontWeight: 700,
          fontSize: compact ? 58 : 66,
          lineHeight: 1.08,
          letterSpacing: TIGHT_TRACKING,
          textAlign: "center",
        }}
      >
        {g.text}
        {g.strike ? (
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: "50%",
              height: 9,
              borderRadius: 5,
              backgroundColor: COLORS.red,
              rotate: "-3deg",
              transformOrigin: "left center",
              scale: `${interpolate(frame, [0.5 * fps, 0.85 * fps], [0, 1], {
                ...clamp,
                easing: Easing.bezier(0.33, 1, 0.68, 1),
              })} 1`,
            }}
          />
        ) : null}
      </div>
      {g.note && !compact ? (
        <div
          style={{
            fontFamily: CURSIVE,
            fontWeight: 700,
            fontSize: 58,
            color: COLORS.red,
            // Calligraphic slant ~18° per the style guide.
            transform: "skewX(-18deg)",
            rotate: "-3deg",
            opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], clamp),
          }}
        >
          {g.note}
        </div>
      ) : null}
    </div>
  );
};

const StatView: React.FC<{ g: StatGraphic }> = ({ g }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counted =
    g.value === undefined
      ? g.valueText
      : Math.round(
          interpolate(frame, [0.15 * fps, 1.1 * fps], [0, g.value], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 170,
          lineHeight: 1,
          color: COLORS.green,
        }}
      >
        {counted}
        {g.suffix}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "12px 30px",
          borderRadius: 999,
          backgroundColor: COLORS.white,
          boxShadow: "0 12px 30px rgba(27, 94, 52, 0.12)",
          fontWeight: 500,
          fontSize: 46,
          color: COLORS.darkGray,
          opacity: interpolate(frame, [0.4 * fps, 0.8 * fps], [0, 1], clamp),
        }}
      >
        {g.label}
      </div>
    </div>
  );
};

const StepsView: React.FC<{ g: StepsGraphic }> = ({ g }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {[1, 2, 3].map((n) => {
          const isActive = n === g.active;
          const isDone = n < g.active;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              {n > 1 ? (
                <div
                  style={{
                    width: 90,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      n <= g.active ? COLORS.green : "rgba(27, 94, 52, 0.18)",
                  }}
                />
              ) : null}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: 52,
                  backgroundColor:
                    isActive || isDone ? COLORS.green : COLORS.white,
                  color: isActive || isDone ? COLORS.white : COLORS.darkGreen,
                  border: `5px solid ${COLORS.green}`,
                  opacity: isDone ? 0.55 : 1,
                  scale: isActive
                    ? interpolate(frame, [0.2 * fps, 0.6 * fps], [1, 1.18], {
                        ...clamp,
                        easing: Easing.spring({ damping: 12 }),
                      })
                    : 1,
                }}
              >
                {n}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          maxWidth: 900,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.1,
          color: COLORS.darkGreen,
          opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], clamp),
        }}
      >
        {g.text}
      </div>
    </div>
  );
};

const Mark: React.FC<{ good: boolean }> = ({ good }) => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <circle cx={32} cy={32} r={32} fill={good ? COLORS.green : COLORS.red} />
    <path
      d={good ? "M18 33 L28 43 L47 22" : "M21 21 L43 43 M43 21 L21 43"}
      stroke={COLORS.white}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const CompareCard: React.FC<{
  good: boolean;
  title: string;
  sub: string;
}> = ({ good, title, sub }) => (
  <div
    style={{
      width: 430,
      padding: "30px 28px",
      borderRadius: 32,
      backgroundColor: COLORS.white,
      boxShadow: "0 20px 50px rgba(27, 94, 52, 0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      fontFamily: INTER_TIGHT,
      letterSpacing: TIGHT_TRACKING,
      textAlign: "center",
    }}
  >
    <Mark good={good} />
    <div style={{ fontWeight: 700, fontSize: 50, color: COLORS.darkGreen }}>
      {title}
    </div>
    <div
      style={{
        fontWeight: 500,
        fontSize: 40,
        color: good ? COLORS.darkGray : COLORS.red,
      }}
    >
      {sub}
    </div>
  </div>
);

const CompareView: React.FC<{ g: CompareGraphic }> = ({ g }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badFrom = Math.round(g.badAtSec * fps);

  return (
    <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
      <CompareCard good title={g.good.title} sub={g.good.sub} />
      <div
        style={{
          opacity: interpolate(frame, [badFrom, badFrom + 8], [0, 1], clamp),
          scale: interpolate(frame, [badFrom, badFrom + 0.5 * fps], [0.7, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <CompareCard good={false} title={g.bad.title} sub={g.bad.sub} />
      </div>
      <Sequence from={badFrom} durationInFrames={fps} layout="none">
        <Audio src={staticFile("sfx/switch.wav")} volume={0.35} />
      </Sequence>
    </div>
  );
};

const MeterView: React.FC<{ g: MeterGraphic }> = ({ g }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [0.3 * fps, 2.6 * fps], [0.08, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <div
      style={{
        width: 900,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 60, color: COLORS.darkGreen }}>
          {g.label}
        </div>
        <div
          style={{
            fontFamily: CURSIVE,
            fontWeight: 700,
            fontSize: 66,
            color: COLORS.red,
            transform: "skewX(-18deg)",
            opacity: interpolate(frame, [1.8 * fps, 2.4 * fps], [0, 1], clamp),
          }}
        >
          {g.endLabel}
        </div>
      </div>
      <div
        style={{
          height: 44,
          borderRadius: 22,
          backgroundColor: COLORS.white,
          boxShadow: "inset 0 0 0 3px rgba(27, 94, 52, 0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            borderRadius: 22,
            background: `linear-gradient(90deg, ${COLORS.green} 0%, ${COLORS.green} 35%, ${COLORS.red} 100%)`,
            backgroundSize: "900px 100%",
          }}
        />
      </div>
    </div>
  );
};

export const GraphicView: React.FC<{ graphic: Graphic; compact: boolean }> = ({
  graphic,
  compact,
}) => {
  switch (graphic.kind) {
    case "card":
      return <CardView g={graphic} compact={compact} />;
    case "stat":
      return <StatView g={graphic} />;
    case "steps":
      return <StepsView g={graphic} />;
    case "compare":
      return <CompareView g={graphic} />;
    case "meter":
      return <MeterView g={graphic} />;
  }
};
