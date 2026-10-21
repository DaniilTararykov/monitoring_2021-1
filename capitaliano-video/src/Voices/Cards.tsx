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
import type { MarcoPose } from "./types";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Dots: React.CSSProperties = {
  backgroundColor: COLORS.cream,
  backgroundImage: `radial-gradient(${COLORS.dot} 2.5px, transparent 2.5px)`,
  backgroundSize: "36px 36px",
  backgroundPosition: "18px 18px",
};

const CardFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={Dots}>
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

// Marco, the mascot: a cut-out standing on the bottom edge of the frame.
const MARCO: Record<MarcoPose, { width: number; height: number }> = {
  point: { width: 929, height: 1004 },
  present: { width: 937, height: 1004 },
  notebook: { width: 563, height: 985 },
  peace: { width: 736, height: 986 },
  open: { width: 971, height: 990 },
};

const Marco: React.FC<{ pose: MarcoPose; height: number; delay?: number }> = ({
  pose,
  height,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay * fps;
  const rise = interpolate(f, [0, 0.55 * fps], [height * 0.45, 0], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.4, 0.64, 1),
  });
  const width = (MARCO[pose].width / MARCO[pose].height) * height;
  return (
    <Img
      src={staticFile(`marco/${pose}.png`)}
      style={{
        position: "absolute",
        bottom: -8,
        left: (1080 - width) / 2,
        width,
        height,
        transformOrigin: "50% 100%",
        translate: `0px ${rise + Math.sin(f / 9) * 4}px`,
        rotate: `${Math.sin(f / 14) * 1.2}deg`,
        opacity: interpolate(f, [0, 4], [0, 1], clamp),
      }}
    />
  );
};

const MarcoTag: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 20px 8px 10px",
      borderRadius: 999,
      backgroundColor: COLORS.cream,
      color: COLORS.darkGreen,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "0.01em",
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: COLORS.red,
        color: COLORS.white,
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      AI
    </div>
    Марко · нейропомощник
  </div>
);

export const TitleCard: React.FC<{
  text: string;
  kicker: string;
  marco?: MarcoPose;
}> = ({ text, kicker, marco }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!marco) {
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
  }
  // Marco asks the question in a speech bubble.
  const pop = interpolate(frame, [0.15 * fps, 0.5 * fps], [0.6, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <AbsoluteFill
      style={{
        ...Dots,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <Marco pose={marco} height={marco === "notebook" ? 960 : 880} />
      <div
        style={{
          position: "absolute",
          top: 372,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        <Kicker>{kicker}</Kicker>
      </div>
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          padding: "44px 46px 30px",
          borderRadius: 48,
          backgroundColor: COLORS.white,
          boxShadow: "0 24px 60px rgba(27, 94, 52, 0.18)",
          textAlign: "center",
          transformOrigin: "50% 120%",
          scale: pop,
          opacity: interpolate(
            frame,
            [0.15 * fps, 0.15 * fps + 5],
            [0, 1],
            clamp,
          ),
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.06,
            color: COLORS.darkGreen,
            textWrap: "balance",
          }}
        >
          {text}
        </div>
        <MarcoTag />
        {/* Tail pointing down at Marco */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "50%",
            marginLeft: -30,
            width: 0,
            height: 0,
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderTop: `34px solid ${COLORS.white}`,
          }}
        />
      </div>
    </AbsoluteFill>
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

export const EndCard: React.FC<{ text: string; marco?: MarcoPose }> = ({
  text,
  marco,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const content = (
    <>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: marco ? 640 : 720,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          scale: interpolate(frame, [0, 0.5 * fps], [0.9, 1], {
            ...clamp,
            easing: ease,
          }),
        }}
      />
      <div
        style={{
          fontSize: marco ? 60 : 64,
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
    </>
  );
  if (!marco) {
    return <CardFrame>{content}</CardFrame>;
  }
  return (
    <AbsoluteFill
      style={{
        ...Dots,
        fontFamily: INTER_TIGHT,
        letterSpacing: TIGHT_TRACKING,
      }}
    >
      <Marco pose={marco} height={860} delay={0.2} />
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          textAlign: "center",
        }}
      >
        {content}
      </div>
    </AbsoluteFill>
  );
};
