import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import type {YearCut} from './Anniversary';

loadBrandFonts();

// Reel «1 anno» — our own take on the anniversary (client 31.10: «your version: creative, catchy, little text, clean»).
// One idea: a huge «1» in the brand display face is a window onto the year — the moments cut on the half-beats inside
// it, the flat brand colour around it changes every bar; then the camera flies through the «1» into the room, and the
// reel ends full-frame on one wide shot with two short lines. Text on screen: «Sea, Signora», «anno», and at the end
// «un anno di / Sea, Signora». Warm, lively grade; music: brera-house (our own track).

const FPS = 30;
const BG = [brandPalette.green5605, brandPalette.orange158, colors.ivory];
const INK = [colors.ivory, brandPalette.green5605, brandPalette.green5605];
const ONE = {size: 1500, x: 540, y: 1430}; // the «1»: font size and baseline position

const Clip: React.FC<{c: YearCut}> = ({c}) => (
  <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
    style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.2)'}} />
);

export const ONE_YEAR_END = 2.6; // seconds held on the wide shot

export const OneYear: React.FC<{cuts: YearCut[]; finale: YearCut; audio?: {src: string; from: number}}> = ({cuts, finale, audio}) => {
  const f = useCurrentFrame();
  const starts = cuts.map((_, i) => cuts.slice(0, i).reduce((s, c) => s + c.n, 0));
  const montageEnd = starts[starts.length - 1] + cuts[cuts.length - 1].n;
  const FLY = 14;
  const total = montageEnd + FLY + Math.round(ONE_YEAR_END * FPS);
  const bar = Math.floor(f / 30); // ~ one bar of brera-house (123 bpm ≈ 31 frames)
  const bg = BG[bar % BG.length], ink = INK[bar % INK.length];
  // the «1» appears (0–8), then flies through (montageEnd → +FLY)
  const inT = interpolate(f, [0, 8], [0.85, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const fly = interpolate(f, [montageEnd, montageEnd + FLY], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const z = inT * (1 + fly * 34);
  const lineIn = (at: number) => interpolate(f, [at, at + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const endAt = montageEnd + FLY;
  return (
    <AbsoluteFill style={{background: f < endAt ? bg : brandPalette.green5605}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>
          <clipPath id="one" clipPathUnits="userSpaceOnUse">
            <text x={ONE.x} y={ONE.y} textAnchor="middle" fontFamily={fonts.display} fontSize={ONE.size}
              transform={`translate(${ONE.x} 960) scale(${z * 1.32} ${z}) translate(${-ONE.x} -960)`}>1</text>
          </clipPath>
        </defs>
      </svg>
      {/* the year, seen through the «1» */}
      <AbsoluteFill style={{clipPath: f < endAt ? 'url(#one)' : undefined}}>
        {cuts.map((c, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={c.n}>
            <Clip c={c} />
          </Sequence>
        ))}
        <Sequence from={montageEnd}>
          <AbsoluteFill style={{transform: `scale(${1 + (1 - fly) * 0.15})`}}><Clip c={finale} /></AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
      {f < montageEnd ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: fonts.display, fontSize: 44, color: ink, letterSpacing: 1}}>
            Sea, Signora
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 74, color: ink,
            opacity: lineIn(6)}}>anno</div>
        </>
      ) : null}
      {f >= endAt ? (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(11,11,11,0.62) 0%, rgba(11,11,11,0) 38%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center', color: colors.ivory}}>
            <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 58, opacity: lineIn(endAt + 4),
              transform: `translateY(${(1 - lineIn(endAt + 4)) * 18}px)`}}>un anno di</div>
            <div style={{fontFamily: fonts.display, fontSize: 112, textTransform: 'uppercase', letterSpacing: 2, marginTop: 6, opacity: lineIn(endAt + 10),
              transform: `translateY(${(1 - lineIn(endAt + 10)) * 18}px)`}}>Sea, Signora</div>
          </div>
        </>
      ) : null}
      {audio ? (
        <Audio src={staticFile(audio.src)} startFrom={Math.round(audio.from * FPS)}
          volume={(fr) => interpolate(fr, [0, 4, total - 20, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      ) : null}
    </AbsoluteFill>
  );
};

export const oneYearDuration = (cuts: YearCut[]) => cuts.reduce((s, c) => s + c.n, 0) + 14 + Math.round(ONE_YEAR_END * FPS);
