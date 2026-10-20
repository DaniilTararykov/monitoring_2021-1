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
import { Beat, beatAt } from "./Beats";
import { COLORS, INTER_TIGHT, SAFE, SLOTS, TIGHT_TRACKING } from "./brand";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

const CaptionPage: React.FC<{ page: TikTokPage; large: boolean }> = ({
  page,
  large,
}) => {
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
        maxWidth: 940,
        fontFamily: INTER_TIGHT,
        fontWeight: 700,
        fontSize: large ? 76 : 62,
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
              color: isActive ? COLORS.white : COLORS.darkGray,
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
// Captions sit on the cream zone in slot B, or move up to slot A while a
// beat occupies slot B.
export const Captions: React.FC<{ captionsSrc: string; beats: Beat[] }> = ({
  captionsSrc,
  beats,
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
        const up = beatAt(beats, page.startMs / 1000)?.slot === "b";
        const slot = up ? SLOTS.a : SLOTS.b;
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={endFrame - startFrame}
            layout="none"
          >
            <div
              style={{
                position: "absolute",
                top: slot.top,
                height: slot.height,
                left: SAFE.left,
                right: SAFE.right,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CaptionPage page={page} large={up} />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
