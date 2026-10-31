import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import type {YearCut} from './Anniversary';

loadBrandFonts();

// Reel «1 anno» — our own take on the anniversary (client 31.10: «your version: creative, catchy, little text, clean»).
// The «1» is the frame of the reel, not a window for the whole montage (client: «nothing is visible inside the 1»):
// it opens on one calm wide shot of the room seen through a huge brand-font «1» and flies through it; the year then
// plays full-frame, clean, no text, cut on the half-beats; at the end the last shot closes back into the «1» on
// brand orange with two short lines under it. Warm, lively grade; music: brera-house (our own track).

const FPS = 30;
const ONE = {size: 1500, x: 540, y: 1430, wide: 1.32}; // the «1»: font size, baseline, horizontal stretch
const INTRO = 26, FLY = 14, CLOSE = 16;
export const ONE_YEAR_END = 2.8; // seconds the closing «1» holds

const Clip: React.FC<{c: YearCut; from?: number}> = ({c, from = 0}) => (
  <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round((c.start + from) * FPS)} muted
    style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.2)'}} />
);

const OneMask: React.FC<{id: string; z: number}> = ({id, z}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        <text x={ONE.x} y={ONE.y} textAnchor="middle" fontFamily={fonts.display} fontSize={ONE.size}
          transform={`translate(${ONE.x} 960) scale(${z * ONE.wide} ${z}) translate(${-ONE.x} -960)`}>1</text>
      </clipPath>
    </defs>
  </svg>
);

export const oneYearDuration = (cuts: YearCut[]) => INTRO + FLY + cuts.reduce((s, c) => s + c.n, 0) + Math.round(ONE_YEAR_END * FPS);

export const OneYear: React.FC<{cuts: YearCut[]; opening: YearCut; finale: YearCut; audio?: {src: string; from: number}}> = ({cuts, opening, finale, audio}) => {
  const f = useCurrentFrame();
  const m0 = INTRO + FLY; // montage starts
  const starts = cuts.map((_, i) => m0 + cuts.slice(0, i).reduce((s, c) => s + c.n, 0));
  const m1 = m0 + cuts.reduce((s, c) => s + c.n, 0); // montage ends, the finale shot starts
  const total = oneYearDuration(cuts);
  const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  // opening: the «1» settles (0–10), then the camera flies through it (INTRO → INTRO+FLY)
  const zOpen = interpolate(f, [0, 10], [0.9, 1], {...clamp, easing: Easing.out(Easing.cubic)})
    * (1 + 34 * interpolate(f, [INTRO, INTRO + FLY], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}));
  // closing: the finale shot shrinks back into the «1»
  const zClose = 1 + 34 * (1 - interpolate(f, [m1, m1 + CLOSE], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}));
  const lineIn = (at: number) => interpolate(f, [at, at + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const opening1 = f < m0, closing = f >= m1;
  return (
    <AbsoluteFill style={{background: closing ? brandPalette.orange158 : brandPalette.green5605}}>
      <OneMask id="one-open" z={zOpen} />
      <OneMask id="one-close" z={zClose} />
      {opening1 ? (
        <>
          <AbsoluteFill style={{clipPath: 'url(#one-open)'}}><Clip c={opening} /></AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: fonts.display, fontSize: 44,
            color: colors.ivory, letterSpacing: 1, opacity: 1 - interpolate(f, [INTRO, INTRO + 6], [0, 1], clamp)}}>Sea, Signora</div>
        </>
      ) : null}
      {cuts.map((c, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={c.n}>
          <Clip c={c} />
        </Sequence>
      ))}
      {closing ? (
        <>
          <AbsoluteFill style={{clipPath: 'url(#one-close)'}}>
            <Sequence from={m1}><Clip c={finale} /></Sequence>
          </AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1490, textAlign: 'center', color: brandPalette.green5605}}>
            <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 58, opacity: lineIn(m1 + CLOSE - 4),
              transform: `translateY(${(1 - lineIn(m1 + CLOSE - 4)) * 16}px)`}}>un anno di</div>
            <div style={{fontFamily: fonts.display, fontSize: 100, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4, opacity: lineIn(m1 + CLOSE + 2),
              transform: `translateY(${(1 - lineIn(m1 + CLOSE + 2)) * 16}px)`}}>Sea, Signora</div>
          </div>
        </>
      ) : null}
      {audio ? (
        <Audio src={staticFile(audio.src)} startFrom={Math.round(audio.from * FPS)}
          volume={(fr) => interpolate(fr, [0, 4, total - 20, total], [0, 1, 1, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};
