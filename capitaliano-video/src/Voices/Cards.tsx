import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
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
import { TelegramIcon } from "./Overlays";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const CardFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.cream,
      backgroundImage: `radial-gradient(${COLORS.dot} 2.5px, transparent 2.5px)`,
      backgroundSize: "36px 36px",
      backgroundPosition: "18px 18px",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 420,
        bottom: 440,
        left: 90,
        right: 90,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        textAlign: "center",
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: CURSIVE,
      fontWeight: 700,
      fontSize: 64,
      color: COLORS.red,
      transform: "skewX(-15deg)",
      rotate: "-3deg",
    }}
  >
    {children}
  </div>
);

export const TitleCard: React.FC<{ text: string; kicker: string }> = ({
  text,
  kicker,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CardFrame>
      <Kicker>{kicker}</Kicker>
      <div
        style={{
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.04,
          color: COLORS.darkGreen,
          textWrap: "balance",
          translate: `0px ${interpolate(frame, [0, 0.5 * fps], [60, 0], { ...clamp, easing: ease })}px`,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        {text}
      </div>
    </CardFrame>
  );
};

// A myth in a white card, crossed out in red before the answer.
export const MythCard: React.FC<{ text: string; index: number }> = ({
  text,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CardFrame>
      <div
        style={{
          padding: "10px 26px",
          borderRadius: 999,
          backgroundColor: COLORS.red,
          color: COLORS.white,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: "0.12em",
        }}
      >
        МИФ №{index}
      </div>
      <div
        style={{
          padding: "40px 48px",
          borderRadius: 40,
          backgroundColor: COLORS.white,
          boxShadow: "0 24px 60px rgba(27, 94, 52, 0.16)",
          fontSize: 80,
          fontWeight: 700,
          lineHeight: 1.12,
          color: COLORS.darkGray,
          textWrap: "balance",
          scale: interpolate(frame, [0, 0.4 * fps], [0.85, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 14 }),
          }),
        }}
      >
        {/* A red line through every line of text, drawn left to right. */}
        <span
          style={{
            backgroundImage: `linear-gradient(${COLORS.red}, ${COLORS.red})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 58%",
            backgroundSize: `${interpolate(frame, [0.9 * fps, 1.3 * fps], [0, 100], { ...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1) })}% 10px`,
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          {text}
        </span>
      </div>
    </CardFrame>
  );
};

export const EndCard: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <CardFrame>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 720,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          scale: interpolate(frame, [0, 0.5 * fps], [0.9, 1], {
            ...clamp,
            easing: ease,
          }),
        }}
      />
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
          color: COLORS.darkGreen,
          textWrap: "balance",
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], clamp),
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 34px 14px 16px",
          borderRadius: 999,
          backgroundColor: COLORS.white,
          boxShadow: "0 12px 34px rgba(27, 94, 52, 0.16)",
          color: COLORS.darkGreen,
          fontWeight: 700,
          fontSize: 46,
          opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], clamp),
        }}
      >
        <TelegramIcon size={56} />
        @capitaliano.info
      </div>
    </CardFrame>
  );
};
