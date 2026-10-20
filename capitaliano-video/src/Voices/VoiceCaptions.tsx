import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { COLORS, INTER_TIGHT, TIGHT_TRACKING } from "../Capitaliano/brand";

const SWITCH_CAPTIONS_EVERY_MS = 1100;
const FADE_FRAMES = 4;

const Page: React.FC<{ page: TikTokPage; durationInFrames: number }> = ({
  page,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = page.startMs + (frame / fps) * 1000;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px 2px",
        padding: "16px 20px",
        borderRadius: 30,
        backgroundColor: "rgba(255, 252, 249, 0.94)",
        boxShadow: "0 14px 40px rgba(0, 0, 0, 0.2)",
        fontFamily: INTER_TIGHT,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.1,
        letterSpacing: TIGHT_TRACKING,
        opacity: interpolate(
          frame,
          [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
        scale: interpolate(frame, [0, 0.18 * fps], [0.94, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {page.tokens.map((token, i) => {
        const active = token.fromMs <= now && token.toMs > now;
        return (
          <span
            key={`${token.fromMs}-${i}`}
            style={{
              padding: "2px 12px",
              borderRadius: 14,
              backgroundColor: active ? COLORS.green : "transparent",
              color: active ? COLORS.white : COLORS.darkGreen,
            }}
          >
            {token.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

// Word-by-word captions on a cream plate in the lower safe zone; each
// sentence and each answer gets its own pages, and they fade out before the
// next phrase. `hidden` ranges (seconds) keep the plate off cards and the
// passport.
export const VoiceCaptions: React.FC<{
  captions: (Caption & { pageBreakAfter?: boolean })[];
  hidden: [number, number][];
}> = ({ captions, hidden }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: captions.map((c) => ({
          ...c,
          pageBreakAfter: c.pageBreakAfter || /[.?!…»]$/.test(c.text.trim()),
        })),
        combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      }).pages,
    [captions],
  );
  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const start = page.startMs / 1000;
        if (hidden.some(([a, b]) => start >= a && start < b)) {
          return null;
        }
        const next = pages[i + 1];
        // Never run into a card or the passport that comes next.
        const nextHidden = Math.min(
          ...hidden.map(([a]) => a).filter((a) => a > start),
        );
        const from = Math.round(start * fps);
        const end = Math.round(
          Math.min(
            next ? (next.startMs / 1000) * fps : Infinity,
            ((page.startMs + page.durationMs) / 1000 + 0.35) * fps,
            nextHidden * fps,
          ),
        );
        if (end - from <= 0) {
          return null;
        }
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={end - from}
            layout="none"
          >
            <div
              style={{
                position: "absolute",
                top: 1290,
                height: 210,
                left: 120,
                right: 193,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Page page={page} durationInFrames={end - from} />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
