import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, motion} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {Chat} from './components/Chat';
import {OverlayView} from './components/Text';
import {Chip, Photo, SafeGuides, Scrim} from './components/Visual';
import type {Overlay, Story as StoryT} from './types';

loadBrandFonts();

export const storyFrames = (s: StoryT) =>
  s.chat ? 30 + s.chat.length * 66 + 75 : s.scenes.reduce((a, sc) => a + sc.frames, 0);

const needsScrim = (o?: Overlay) => ({top: o?.position === 'top', bottom: o?.position === 'bottom' || o?.position === 'center'});

const Fade: React.FC<{frames: number; total: number; children: React.ReactNode}> = ({frames, total, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, motion.crossfadeFrames, total - 1], [0, 1, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: frames === 0 ? 1 : o}}>{children}</AbsoluteFill>;
};

export const StoryVideo: React.FC<{story: StoryT; guides?: boolean; frozen?: boolean}> = ({story, guides, frozen}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const fps = cfg.fps;
  // frozen = rendered inside a still (brand sheet): no audio, no end fade
  const durationInFrames = frozen ? 100000 : cfg.durationInFrames;
  const end = interpolate(frame, [durationInFrames - motion.endFadeFrames, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const vol = (f: number) =>
    interpolate(f, [0, 12, durationInFrames - 20, durationInFrames - 1], [0, 0.8, 0.8, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

  let cursor = 0;
  const scenes = story.scenes.map((sc, i) => {
    const from = cursor;
    cursor += sc.frames;
    // overlap each new scene a little so it can crossfade over the previous one
    const overlap = i === 0 || story.transition !== 'fade' ? 0 : motion.crossfadeFrames;
    const sScrim = needsScrim(sc.overlay);
    return (
      <Sequence key={i} from={from - overlap} durationInFrames={sc.frames + overlap}>
        <Fade frames={overlap} total={sc.frames + overlap}>
          <Photo scene={{...sc, frames: sc.frames + overlap}} />
          {sc.overlay ? (
            <>
              <Scrim top={sScrim.top} bottom={sScrim.bottom} />
              <OverlayView o={{...sc.overlay, delay: (sc.overlay.delay ?? 4) + overlap}} />
            </>
          ) : null}
        </Fade>
      </Sequence>
    );
  });

  const g = needsScrim(story.overlay);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {story.chat ? <Chat pairs={story.chat} step={66} /> : scenes}
      {story.overlay ? (
        <>
          {story.overlay.position === 'center' ? <AbsoluteFill style={{background: colors.night, opacity: 0.55}} /> : null}
          <Scrim top={g.top && story.overlay.y === undefined} bottom={g.bottom || !!story.cta} />
          <OverlayView o={story.overlay} />
        </>
      ) : story.cta && !story.chat ? (
        <Scrim bottom strength={0.7} />
      ) : null}
      {story.cta ? <Chip cta={story.cta} /> : null}
      <AbsoluteFill style={{background: colors.night, opacity: end}} />
      {guides ? <SafeGuides /> : null}
      {frozen || story.music === 'none' ? null : <Audio
        src={staticFile(`music/${story.music}.mp3`)}
        startFrom={Math.round((story.musicFrom ?? 0) * fps)}
        volume={vol}
      />}
    </AbsoluteFill>
  );
};
