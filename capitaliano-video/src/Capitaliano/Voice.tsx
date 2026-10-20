import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./brand";

const BANDS = 24;
const MIN_DB = -75;
const MAX_DB = -20;

// Normalized voice spectrum (low → high), shared by all visualizers.
export const useVoice = (audioSrc: string): number[] => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(audioSrc),
    frame,
    fps,
    windowInSeconds: 30,
  });
  if (!audioData) {
    return new Array(BANDS).fill(0);
  }
  // Voice energy lives in the lower part of the spectrum.
  return visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 128,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  })
    .slice(0, BANDS)
    .map((value) => {
      const db = 20 * Math.log10(Math.max(value, 1e-6));
      return Math.min(1, Math.max(0, (db - MIN_DB) / (MAX_DB - MIN_DB)));
    });
};

export const loudness = (levels: number[]) =>
  levels.slice(0, 8).reduce((sum, v) => sum + v, 0) / 8;

// Bar equalizer for the split layout.
export const Equalizer: React.FC<{ levels: number[]; height: number }> = ({
  levels,
  height,
}) => {
  // Mirror so the loudest (low) bands sit in the center.
  const bars = [...levels.slice().reverse(), ...levels];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height,
      }}
    >
      {bars.map((level, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: Math.max(10, level * height),
            borderRadius: 5,
            background: `linear-gradient(180deg, ${COLORS.green}, ${COLORS.darkGreen})`,
            boxShadow: `0 0 ${8 + level * 18}px rgba(47, 141, 79, ${0.35 + level * 0.45})`,
          }}
        />
      ))}
    </div>
  );
};

const AURA_BARS = 72;

// Circular audio aura plus a rotating gradient ring around the speaker circle.
export const Aura: React.FC<{
  levels: number[];
  cx: number;
  cy: number;
  r: number;
}> = ({ levels, cx, cy, r }) => {
  const frame = useCurrentFrame();
  const size = 2 * (r + 90);
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: cx - c,
        top: cy - c,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="aura-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.green} />
          <stop offset="55%" stopColor={COLORS.darkGreen} stopOpacity={0.2} />
          <stop offset="100%" stopColor={COLORS.green} />
        </linearGradient>
      </defs>
      {new Array(AURA_BARS).fill(0).map((_, i) => {
        // Symmetric around the vertical axis: low bands at the top and bottom.
        const half = AURA_BARS / 2;
        const band = Math.floor(
          ((i < half ? i : AURA_BARS - i) / half) * (levels.length - 1),
        );
        const level = levels[band] ?? 0;
        const angle = (i / AURA_BARS) * Math.PI * 2 - Math.PI / 2;
        const inner = r + 26;
        const outer = inner + 8 + level * 56;
        return (
          <line
            key={i}
            x1={c + Math.cos(angle) * inner}
            y1={c + Math.sin(angle) * inner}
            x2={c + Math.cos(angle) * outer}
            y2={c + Math.sin(angle) * outer}
            stroke={COLORS.green}
            strokeOpacity={0.35 + level * 0.6}
            strokeWidth={7}
            strokeLinecap="round"
          />
        );
      })}
      <circle
        cx={c}
        cy={c}
        r={r + 12}
        fill="none"
        stroke="url(#aura-ring)"
        strokeWidth={7}
        style={{
          rotate: `${frame * 1.2}deg`,
          transformOrigin: `${c}px ${c}px`,
        }}
      />
    </svg>
  );
};

// Soft cream cloud at the bottom of the full-screen layout; it breathes with
// the voice and keeps captions readable over the video.
export const Cloud: React.FC<{ levels: number[] }> = ({ levels }) => {
  const level = loudness(levels);
  return (
    <div
      style={{
        position: "absolute",
        left: -260,
        right: -260,
        top: 1040,
        height: 1100,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(255, 252, 249, 0.97) 55%, rgba(255, 252, 249, 0.75) 75%, rgba(255, 252, 249, 0) 100%)",
        filter: "blur(30px)",
        scale: `${1 + level * 0.06}`,
        boxShadow: `0 -40px ${120 + level * 120}px rgba(47, 141, 79, ${0.12 + level * 0.18})`,
      }}
    />
  );
};
