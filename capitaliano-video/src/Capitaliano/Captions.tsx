import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { COLORS, INTER_TIGHT, TIGHT_TRACKING } from "./brand";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 8,
        maxWidth: 920,
        fontFamily: INTER_TIGHT,
        fontWeight: 700,
        fontSize: 68,
        lineHeight: 1.1,
        letterSpacing: TIGHT_TRACKING,
        scale: interpolate(frame, [0, 0.2 * fps], [0.92, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {page.tokens.map((token, i) => {
        const isActive =
          token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
        return (
          <span
            key={`${token.fromMs}-${i}`}
            style={{
              padding: "4px 16px",
              borderRadius: 18,
              backgroundColor: isActive ? COLORS.green : "transparent",
              color: COLORS.white,
              textShadow: isActive ? "none" : "0 4px 18px rgba(0, 0, 0, 0.55)",
            }}
          >
            {token.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

// Word-by-word subtitles with a green pill on the active word.
export const Captions: React.FC<{ captionsSrc: string }> = ({
  captionsSrc,
}) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(captionsSrc));
      setCaptions(await response.json());
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [captionsSrc, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(() => {
    if (!captions) {
      return [];
    }
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    }).pages;
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            ((page.startMs + page.durationMs) / 1000) * fps + 0.3 * fps,
          ),
        );
        if (endFrame - startFrame <= 0) {
          return null;
        }
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={endFrame - startFrame}
            layout="absolute-fill"
            style={{
              top: 1660,
              height: 180,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
