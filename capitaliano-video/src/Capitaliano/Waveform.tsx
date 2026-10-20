import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./brand";

const BAR_COUNT = 48;
const MAX_BAR_HEIGHT = 120;
const MIN_DB = -75;
const MAX_DB = -20;

// Equalizer in the graphic zone, driven by the speaker's voice.
export const Waveform: React.FC<{ audioSrc: string }> = ({ audioSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(audioSrc),
    frame,
    fps,
    windowInSeconds: 30,
  });

  let levels: number[] = new Array(BAR_COUNT / 2).fill(0);
  if (audioData) {
    // Voice energy lives in the lower part of the spectrum.
    const frequencies = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 128,
      optimizeFor: "speed",
      dataOffsetInSeconds,
    }).slice(0, BAR_COUNT / 2);
    levels = frequencies.map((value) => {
      const db = 20 * Math.log10(Math.max(value, 1e-6));
      return Math.min(1, Math.max(0, (db - MIN_DB) / (MAX_DB - MIN_DB)));
    });
  }

  // Mirror so the loudest (low) bands sit in the center.
  const bars = [...levels.slice().reverse(), ...levels];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: MAX_BAR_HEIGHT,
      }}
    >
      {bars.map((level, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: Math.max(10, level * MAX_BAR_HEIGHT),
            borderRadius: 5,
            background: `linear-gradient(180deg, ${COLORS.green}, ${COLORS.darkGreen})`,
            boxShadow: `0 0 ${8 + level * 18}px rgba(47, 141, 79, ${0.35 + level * 0.45})`,
          }}
        />
      ))}
    </div>
  );
};
