import {
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, CURSIVE, INTER_TIGHT, TIGHT_TRACKING } from "./brand";

export type CardVariant = "white" | "green";

export type Card = {
  text: string;
  fromSec: number;
  durationSec: number;
  variant: CardVariant;
  // Optional red cursive note shown under the card.
  note?: string;
  // Cross out the card text with a red line (e.g. a myth being busted).
  strike?: boolean;
};

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isGreen = card.variant === "green";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        translate: interpolate(
          frame,
          [0, 0.6 * fps],
          ["0px 260px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
        opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 880,
          padding: "36px 52px",
          borderRadius: 36,
          backgroundColor: isGreen ? COLORS.green : COLORS.white,
          color: isGreen ? COLORS.white : COLORS.darkGreen,
          boxShadow: "0 24px 60px rgba(27, 94, 52, 0.18)",
          fontFamily: INTER_TIGHT,
          fontWeight: 700,
          fontSize: 72,
          lineHeight: 1.08,
          letterSpacing: TIGHT_TRACKING,
          textAlign: "center",
        }}
      >
        {card.text}
        {card.strike ? (
          <div
            style={{
              position: "absolute",
              left: 32,
              right: 32,
              top: "50%",
              height: 10,
              borderRadius: 5,
              backgroundColor: COLORS.red,
              rotate: "-4deg",
              transformOrigin: "left center",
              scale: `${interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.33, 1, 0.68, 1),
              })} 1`,
            }}
          />
        ) : null}
      </div>
      {card.note ? (
        <div
          style={{
            fontFamily: CURSIVE,
            fontWeight: 700,
            fontSize: 64,
            color: COLORS.red,
            // Calligraphic slant ~18° per the style guide.
            transform: "skewX(-18deg)",
            rotate: "-4deg",
            opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {card.note}
        </div>
      ) : null}
    </div>
  );
};

// White and green cards that pop up from the bottom with an ease-out.
export const Cards: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {cards.map((card, i) => (
        <Sequence
          key={i}
          name={`Card: ${card.text}`}
          from={Math.round(card.fromSec * fps)}
          durationInFrames={Math.max(1, Math.round(card.durationSec * fps))}
          layout="absolute-fill"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <CardView card={card} />
        </Sequence>
      ))}
    </>
  );
};
