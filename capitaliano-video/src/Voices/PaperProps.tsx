import {
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  CURSIVE,
  INTER_TIGHT,
  TIGHT_TRACKING,
} from "../Capitaliano/brand";
import { ItalyMap } from "./Overlays";
import type { Prop } from "./types";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Where props land around the photo card, clear of the speaker's face:
// the card's lower corners and the margins beside its middle.
export const PROP_SLOTS: { x: number; y: number; rotate: number }[] = [
  { x: 260, y: 1190, rotate: -6 },
  { x: 830, y: 1140, rotate: 5 },
  { x: 940, y: 950, rotate: -4 },
  { x: 160, y: 970, rotate: 7 },
];

const ICON = 68;
const stroke = {
  fill: "none",
  stroke: COLORS.darkGreen,
  strokeWidth: 3.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Icon: React.FC<{ kind: string }> = ({ kind }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const red = { ...stroke, stroke: COLORS.red };
  switch (kind) {
    case "embassy":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path
            {...stroke}
            d="M6 18 24 7l18 11M8 40h32M11 20v17M19 20v17M29 20v17M37 20v17M6 44h36"
          />
        </svg>
      );
    case "docs":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M14 10h18l6 6v26H14z" />
          <path {...stroke} d="M10 6h18M10 6v30" opacity={0.5} />
          <path {...red} d="M19 22h14M19 28h14M19 34h9" />
        </svg>
      );
    case "clock": {
      // The minute hand races round: "a couple of minutes".
      const a = (frame / fps) * 540;
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <circle {...stroke} cx={24} cy={24} r={18} />
          <path {...stroke} d="M24 24v-8" />
          <path {...red} d="M24 24v-13" transform={`rotate(${a} 24 24)`} />
        </svg>
      );
    }
    case "ticket":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path
            {...stroke}
            d="M6 14h36v7a4 4 0 0 0 0 6v7H6v-7a4 4 0 0 0 0-6z"
          />
          <path {...red} d="m17 24 5 5 9-10" />
        </svg>
      );
    case "cap":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M4 18 24 9l20 9-20 9z" />
          <path {...stroke} d="M12 22v9c6 5 18 5 24 0v-9" />
          <path {...red} d="M44 18v12" />
        </svg>
      );
    case "chat":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M8 10h32v22H20l-8 7v-7H8z" />
          <circle cx={17} cy={21} r={2.4} fill={COLORS.red} />
          <circle cx={24} cy={21} r={2.4} fill={COLORS.red} />
          <circle cx={31} cy={21} r={2.4} fill={COLORS.red} />
        </svg>
      );
    case "calendar":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M8 12h32v28H8zM8 20h32M16 7v9M32 7v9" />
          <circle {...red} cx={28} cy={30} r={5} />
        </svg>
      );
    case "link":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path
            {...stroke}
            d="M21 27a7 7 0 0 0 10 0l7-7a7 7 0 0 0-10-10l-3 3"
          />
          <path {...red} d="M27 21a7 7 0 0 0-10 0l-7 7a7 7 0 0 0 10 10l3-3" />
        </svg>
      );
    case "check":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M8 8h32v32H8z" />
          <path {...red} d="m15 24 7 7 12-14" />
        </svg>
      );
    case "tag":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M6 10h20l16 14-16 14H6z" />
          <circle {...red} cx={15} cy={24} r={4} />
        </svg>
      );
    case "heart":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path
            d="M24 40 9 25a8.5 8.5 0 0 1 12-12l3 3 3-3a8.5 8.5 0 0 1 12 12z"
            fill={COLORS.red}
          />
        </svg>
      );
    case "box":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path {...stroke} d="M6 16 24 8l18 8v18l-18 8-18-8z" />
          <path {...stroke} d="M6 16l18 8 18-8M24 24v18" />
          <path {...red} d="m15 12 18 8" />
        </svg>
      );
    case "star":
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 48 48">
          <path
            d="m24 5 5.6 12 13 1.5-9.7 8.9 2.7 12.9L24 33.8l-11.6 6.5 2.7-12.9-9.7-8.9 13-1.5z"
            fill={COLORS.red}
          />
        </svg>
      );
    default:
      return null;
  }
};

const Tape: React.FC<{ tilt: number }> = ({ tilt }) => (
  <div
    style={{
      position: "absolute",
      top: -18,
      left: "50%",
      width: 110,
      height: 34,
      marginLeft: -55,
      rotate: `${tilt}deg`,
      backgroundColor: "rgba(47, 141, 79, 0.32)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
    }}
  />
);

const Paper: React.FC<{ children: React.ReactNode; tape: number }> = ({
  children,
  tape,
}) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: "26px 28px 20px",
      borderRadius: 10,
      backgroundColor: COLORS.white,
      boxShadow:
        "0 2px 3px rgba(0, 0, 0, 0.12), 0 18px 36px rgba(27, 94, 52, 0.22)",
    }}
  >
    <Tape tilt={tape} />
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: INTER_TIGHT,
      letterSpacing: TIGHT_TRACKING,
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1.05,
      color: COLORS.darkGreen,
      textAlign: "center",
      maxWidth: 270,
      textWrap: "balance",
    }}
  >
    {children}
  </div>
);

const Body: React.FC<{ prop: Prop; tape: number }> = ({ prop, tape }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  switch (prop.kind) {
    case "stamp":
      return (
        <div
          style={{
            padding: "10px 30px",
            border: `7px solid ${COLORS.red}`,
            borderRadius: 18,
            color: COLORS.red,
            backgroundColor: "rgba(255, 252, 249, 0.9)",
            fontFamily: INTER_TIGHT,
            fontWeight: 800,
            fontSize: 76,
            letterSpacing: "0.14em",
          }}
        >
          {prop.label}
        </div>
      );
    case "chip":
      return (
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 999,
            backgroundColor: COLORS.green,
            color: COLORS.white,
            fontFamily: INTER_TIGHT,
            fontWeight: 800,
            fontSize: prop.label.length > 6 ? 34 : 52,
            maxWidth: 360,
            textAlign: "center",
            boxShadow: "0 14px 30px rgba(27, 94, 52, 0.3)",
          }}
        >
          {prop.label}
        </div>
      );
    case "map":
      return (
        <Paper tape={tape}>
          <ItalyMap city={prop.label} width={150} />
          <div
            style={{
              fontFamily: CURSIVE,
              fontWeight: 700,
              fontSize: 46,
              color: COLORS.red,
              marginTop: -10,
            }}
          >
            {prop.label}
          </div>
        </Paper>
      );
    case "stars":
      return (
        <Paper tape={tape}>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width={46} height={46} viewBox="0 0 48 48">
                <path
                  d="m24 5 5.6 12 13 1.5-9.7 8.9 2.7 12.9L24 33.8l-11.6 6.5 2.7-12.9-9.7-8.9 13-1.5z"
                  fill={COLORS.red}
                  opacity={interpolate(
                    frame,
                    [0.15 * fps + i * 3, 0.15 * fps + i * 3 + 3],
                    [0.15, 1],
                    clamp,
                  )}
                />
              </svg>
            ))}
          </div>
          <Label>{prop.label}</Label>
        </Paper>
      );
    case "route": {
      const [from, to] = prop.label.split("→").map((s) => s.trim());
      const draw = interpolate(frame, [4, 0.9 * fps], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      return (
        <Paper tape={tape}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: INTER_TIGHT,
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.darkGreen,
            }}
          >
            <span>{from}</span>
            <svg width={70} height={20} viewBox="0 0 70 20">
              <path
                d="M2 10h60m-8-7 8 7-8 7"
                fill="none"
                stroke={COLORS.red}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
            </svg>
            <span style={{ opacity: interpolate(draw, [0.7, 1], [0, 1]) }}>
              {to} ✓
            </span>
          </div>
        </Paper>
      );
    }
    default:
      return (
        <Paper tape={tape}>
          <Icon kind={prop.kind} />
          <Label>{prop.label}</Label>
        </Paper>
      );
  }
};

// A paper cut-out slapped onto the desk on its cue word, lifted off at the
// end of its answer or when the next prop takes its place.
export const PaperProp: React.FC<{ prop: Prop; durationInFrames: number }> = ({
  prop,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slot = PROP_SLOTS[prop.slot % PROP_SLOTS.length];
  const seed = `${prop.kind}-${prop.label}`;
  const stamp = prop.kind === "stamp";
  const inFrames = stamp ? 5 : 8;
  const scale = stamp
    ? interpolate(frame, [0, inFrames], [2.4, 1], {
        ...clamp,
        easing: Easing.bezier(0.5, 0, 0.75, 0),
      })
    : interpolate(frame, [0, inFrames], [0.55, 1], {
        ...clamp,
        easing: Easing.bezier(0.34, 1.6, 0.64, 1),
      });
  const out = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [0, 1],
    clamp,
  );
  // Stop-motion wobble: the cut-out settles in 8 fps steps.
  const step = Math.floor(frame / (fps / 8));
  const wobble = (random(`${seed}-${step}`) - 0.5) * 1.6;
  const rotate =
    slot.rotate +
    (stamp ? -8 : 0) +
    wobble +
    (1 - Math.min(1, frame / inFrames)) * 10;
  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        translate: `-50% -50%`,
        rotate: `${rotate}deg`,
        scale: scale * (1 - out * 0.25),
        opacity: interpolate(frame, [0, 2], [0, 1], clamp) * (1 - out),
      }}
    >
      <Body prop={prop} tape={(random(seed) - 0.5) * 16} />
    </div>
  );
};
