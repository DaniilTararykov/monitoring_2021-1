import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Reel «Two ways of cooking — getting ready for Blackout Night» (client, 26.10).
// A shot-for-shot rebuild of the client's own cut (copy_86F1BBB0…mov, 20.8 s): our 25 s «Two recipes»
// render re-timed ×1.3–1.4, five shots from the last Blackout Night, light-leak transitions, the poster
// at the end and the client's soundtrack. Only the title changes. Cut points and source offsets were
// found by frame matching against the client's file (grayscale MSE), so the rhythm is theirs.

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
export const TWO_WAYS_S = 20.833;

type Cut = {clip: string; from: number; to: number; start: number; rate: number; zoom?: number; fx?: number};
const CUTS: Cut[] = [
  {clip: 'IMG_0638', from: 0, to: 1.0, start: 2.275, rate: 1.4, zoom: 1.12},
  {clip: 'IMG_0746', from: 1.0, to: 2.267, start: 2.177, rate: 1.3, zoom: 1.08, fx: 60},
  {clip: 'IMG_0637', from: 2.267, to: 3.5, start: 5.327, rate: 1.4},
  {clip: 'IMG_0748', from: 3.5, to: 4.7, start: 33.691, rate: 1.4},
  {clip: 'IMG_0655', from: 4.7, to: 5.933, start: 8.08, rate: 1.4},
  {clip: 'IMG_0767', from: 5.933, to: 7.167, start: 11.203, rate: 1.34},
  {clip: 'IMG_0684', from: 7.167, to: 8.267, start: 0.589, rate: 1.38},
  {clip: 'IMG_0762', from: 8.267, to: 9.367, start: 5.034, rate: 1.38},
  {clip: 'IMG_0708', from: 9.367, to: 10.233, start: 1.462, rate: 1.43},
  {clip: 'candle-light', from: 10.233, to: 11.367, start: 3.65, rate: 1.36},
  {clip: 'blackout-past', from: 11.367, to: 12.9, start: 0, rate: 1},
  {clip: 'blackout-past', from: 12.9, to: 14.233, start: 1.468, rate: 1},
  {clip: 'blackout-past', from: 14.233, to: 15.4, start: 2.757, rate: 1},
  {clip: 'blackout-past', from: 15.4, to: 16.633, start: 3.987, rate: 1},
  {clip: 'blackout-past', from: 16.633, to: 17.5, start: 5.182, rate: 1},
  {clip: 'IMG_0709', from: 17.5, to: 18.467, start: 2.874, rate: 1.23},
];
const POSTER_AT = 18.467;

const Shot: React.FC<{c: Cut}> = ({c}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(`videos/reel/${c.clip}.mp4`)} startFrom={fr(c.start)} playbackRate={c.rate} muted
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${c.zoom ?? 1})`, transformOrigin: `${c.fx ?? 50}% 50%`}} />
  </AbsoluteFill>
);

// light leak: soft blobs of light swept across the frame (screen blend), like the client's transitions
const Leak: React.FC<{at: number; dur: number; warm?: boolean; from?: 'left' | 'right'}> = ({at, dur, warm, from = 'right'}) => {
  const f = useCurrentFrame() / FPS;
  const p = (f - at) / dur;
  if (p < 0 || p > 1) return null;
  const o = Math.sin(Math.PI * p);
  const x = from === 'right' ? 110 - 70 * p : -10 + 70 * p;
  const c1 = warm ? 'rgba(255,214,120,1)' : 'rgba(255,255,255,1)';
  const c2 = warm ? 'rgba(255,120,40,0.85)' : 'rgba(255,240,225,0.8)';
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o, pointerEvents: 'none',
      background: `radial-gradient(circle at ${x}% 45%, ${c1} 0%, ${c2} 22%, rgba(0,0,0,0) 48%),
                   radial-gradient(circle at ${x + (from === 'right' ? 18 : -18)}% 75%, ${c2} 0%, rgba(0,0,0,0) 35%)`}} />
  );
};

export const TwoWays: React.FC = () => {
  const f = useCurrentFrame();
  const total = fr(TWO_WAYS_S);
  const posterFrom = fr(POSTER_AT);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {CUTS.map((c, i) => (
        <Sequence key={i} from={fr(c.from)} durationInFrames={fr(c.to) - fr(c.from)}>
          <Shot c={c} />
        </Sequence>
      ))}
      {/* one title for the whole reel, on a soft night shade */}
      {f < posterFrom ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560,
            background: 'linear-gradient(to bottom, rgba(11,11,11,0.62) 0%, rgba(11,11,11,0.38) 45%, rgba(11,11,11,0) 100%)'}} />
          <div style={{position: 'absolute', left: 40, right: 40, top: 262, textAlign: 'center', color: colors.ivory}}>
            <div style={{fontFamily: fonts.display, fontSize: 60, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1}}>Two ways of cooking</div>
            <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', marginTop: 16, opacity: 0.9}}>
              getting ready for blackout night
            </div>
          </div>
        </>
      ) : null}
      <Sequence from={posterFrom} durationInFrames={total - posterFrom}>
        <AbsoluteFill>
          <Img src={staticFile('photos/blackout-poster.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      </Sequence>
      <Leak at={11.3} dur={0.28} />
      <Leak at={11.55} dur={0.16} from="left" />
      <Leak at={18.33} dur={0.32} warm />
      <Audio src={staticFile('music/final-two-ways-client.m4a')} />
    </AbsoluteFill>
  );
};
