import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, grade} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Два рецепта одного вечера» — Blackout Night × the candle cluub.
// Idea: making a scented candle and cooking haute cuisine are the same process —
// the same passion, precision and recipe. Top: the kitchen. Bottom: the candle.
// Each pair shows the SAME step of the two recipes; both halves cut together, on the beat.
// No pop-ins, no punch zooms: calm split like the reference, slow drift inside the shot.
// End: the last pair dissolves into blur and the event poster comes out of it.

export const FPS = 30;
// beats of the reference track (≈96 BPM), seconds
const B = [0.743, 1.37, 1.997, 2.647, 3.274, 3.924, 4.551, 5.178, 5.828, 6.455, 7.105, 7.755, 8.382, 9.009, 9.66,
  10.286, 10.937, 11.564, 12.214];
export const DURATION_S = 13.4;
const fr = (s: number) => Math.round(s * FPS);

type Clip = {src: string; start: number; rate?: number; fy?: number};
type Pair = {top: Clip; bottom: Clip; text: string};

// one pair every 3 beats; the last pair holds longer and dissolves into the poster
const PAIRS: Pair[] = [
  {top: {src: 'IMG_0647.mp4', start: 1.3}, bottom: {src: 'IMG_0763.mp4', start: 2.6}, text: 'two recipes of one evening'},
  {top: {src: 'IMG_0706.mp4', start: 3.2}, bottom: {src: 'IMG_0762.mp4', start: 3.5}, text: 'the heat'},
  {top: {src: 'IMG_0654.mp4', start: 1.5}, bottom: {src: 'IMG_0747.mp4', start: 0.2}, text: 'the pour'},
  {top: {src: 'IMG_0702.mp4', start: 10.6}, bottom: {src: 'IMG_0772.mp4', start: 4.3}, text: 'the precision'},
  {top: {src: 'IMG_0711.mp4', start: 0.3}, bottom: {src: 'IMG_0776.mp4', start: 0}, text: 'the finish'},
];
const CUTS = [0, B[2], B[5], B[8], B[11]]; // pair i starts here
const POSTER_AT = B[15]; // poster fully in; the last pair is blurred out by then
const LAST_PAIR_END = B[15];

const Half: React.FC<{c: Clip; len: number}> = ({c, len}) => {
  const f = useCurrentFrame();
  const scale = 1.02 + 0.04 * (f / Math.max(1, len)); // slow, constant drift
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`videos/reel/${c.src}`)}
        startFrom={fr(c.start)}
        playbackRate={c.rate ?? 1}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${c.fy ?? 50}%`, transform: `scale(${scale})`, filter: grade.filter}}
      />
      <AbsoluteFill style={{background: grade.warmth, mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};

export const BlackoutReel: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => {
  const f = useCurrentFrame();
  // dissolve: the last pair blurs and dims, the poster resolves out of the blur
  const blurOut = interpolate(f, [fr(B[13]), fr(B[15])], [0, 24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dimOut = interpolate(f, [fr(B[13]), fr(B[15])], [1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const posterO = interpolate(f, [fr(B[14]), fr(B[15]) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const posterBlur = interpolate(f, [fr(B[14]), fr(B[16])], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const posterScale = interpolate(f, [fr(B[14]), fr(DURATION_S)], [1.08, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const end = interpolate(f, [fr(DURATION_S) - 12, fr(DURATION_S) - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const idx = CUTS.findIndex((c, i) => f >= fr(c) && f < fr(CUTS[i + 1] ?? LAST_PAIR_END + 99));
  const capIn = idx >= 0 ? interpolate(f - fr(CUTS[idx]), [3, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  return (
    <AbsoluteFill style={{background: colors.night}}>
      <AbsoluteFill style={{filter: `blur(${blurOut}px) brightness(${dimOut})`}}>
        {PAIRS.map((p, i) => {
          const from = fr(CUTS[i]);
          const to = i === PAIRS.length - 1 ? fr(POSTER_AT) + 20 : fr(CUTS[i + 1]);
          return (
            <Sequence key={i} from={from} durationInFrames={to - from}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden'}}>
                <Half c={p.top} len={to - from} />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 960, overflow: 'hidden'}}>
                <Half c={p.bottom} len={to - from} />
              </div>
            </Sequence>
          );
        })}
        {/* soft shade along the seam so the italic caption reads without a plate */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 960 - 90, height: 180,
          background: 'linear-gradient(to bottom, rgba(11,11,11,0) 0%, rgba(11,11,11,0.35) 50%, rgba(11,11,11,0) 100%)'}} />
        {idx >= 0 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 960 - 30, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: capIn}}>
            <span style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, color: colors.ivory, letterSpacing: 0.5,
              textShadow: '0 1px 12px rgba(0,0,0,0.55)'}}>
              {PAIRS[idx].text}
            </span>
          </div>
        ) : null}
      </AbsoluteFill>

      <Sequence from={fr(B[14])}>
        <AbsoluteFill style={{opacity: posterO, filter: `blur(${posterBlur}px)`}}>
          <Img src={staticFile('photos/blackout-poster.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${posterScale})`}} />
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill style={{background: colors.night, opacity: end}} />
      {withAudio ? <Audio src={staticFile('music/ref-two-recipes.mp3')} /> : null}
    </AbsoluteFill>
  );
};
