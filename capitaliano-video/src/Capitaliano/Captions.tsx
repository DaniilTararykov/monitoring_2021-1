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
import { Beat } from "./Beats";
import { COLORS, INTER_TIGHT, TIGHT_TRACKING } from "./brand";
import { CAPTION_REGION, layoutAt } from "./Layouts";

const SWITCH_CAPTIONS_EVERY_MS = 1000;
// Words a beat start lands just after still belong to the new layout.
const LAYOUT_LOOKAHEAD_SEC = 0.3;

const FADE_FRAMES = 5;

const CaptionPage: React.FC<{
  page: TikTokPage;
  fontSize: number;
  durationInFrames: number;
}> = ({ page, fontSize, durationInFrames }) => {
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
        maxWidth: "100%",
        fontFamily: INTER_TIGHT,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.1,
        letterSpacing: TIGHT_TRACKING,
        scale: interpolate(frame, [0, 0.2 * fps], [0.92, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        // Fade in and fully out before the next phrase starts.
        opacity: interpolate(
          frame,
          [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
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

// Word-by-word subtitles with a green pill on the active word. Each sentence
// gets its own pages, and the caption region follows the beat's layout.
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
      // Never let a page run across the end of a sentence or a layout change.
      captions: captions.map((c, i) => {
        const next = captions[i + 1];
        const layoutChanges =
          next !== undefined &&
          layoutAt(beats, c.startMs / 1000 + LAYOUT_LOOKAHEAD_SEC) !==
            layoutAt(beats, next.startMs / 1000 + LAYOUT_LOOKAHEAD_SEC);
        return {
          ...c,
          pageBreakAfter:
            c.pageBreakAfter || /[.?!…]$/.test(c.text.trim()) || layoutChanges,
        };
      }),
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    }).pages;
  }, [captions, beats]);

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
        const region =
          CAPTION_REGION[
            layoutAt(beats, page.startMs / 1000 + LAYOUT_LOOKAHEAD_SEC)
          ];
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
                top: region.top,
                height: region.height,
                left: region.left,
                right: region.right,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CaptionPage
                page={page}
                fontSize={region.fontSize}
                durationInFrames={endFrame - startFrame}
              />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
