import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, grade, safe} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Blackout Night × the candle cluub — "2 ways of cooking" split-screen reel.
// Top: the chef cooks the new autumn menu. Bottom: the candle is made by hand.
// Cuts land on the beat of the reference track (152 BPM): top cuts every 4 beats,
// bottom cuts offset by 2 beats, so the two halves answer each other.

export const FPS = 30;
const BEATS = [0.093, 0.534, 0.952, 1.37, 1.788, 2.206, 2.624, 3.042, 3.46, 3.855, 4.249, 4.644, 5.039, 5.41, 5.805, 6.177,
  6.548, 6.989, 7.407, 7.825, 8.22, 8.615, 9.033, 9.404, 9.822, 10.217, 10.612, 11.006, 11.424, 11.819, 12.214, 12.608,
  13.003, 13.398, 13.816, 14.211, 14.605, 15.0, 15.395, 15.79, 16.184, 16.579, 16.974, 17.369];
export const DURATION_S = 18.4;
const f = (s: number) => Math.round(s * FPS);

type Clip = {src: string; start: number; fy?: number; rate?: number};
// chef (top): raw tuna → sauce → fire → tagliolini → precision → finished plate
const TOP: Clip[] = [
  {src: 'IMG_0647.mp4', start: 2.1}, {src: 'IMG_0635.mp4', start: 7.2}, {src: 'IMG_0654.mp4', start: 1.8},
  {src: 'IMG_0655.mp4', start: 9.0}, {src: 'IMG_0668.mp4', start: 7.9, fy: 45}, {src: 'IMG_0681.mp4', start: 12.1},
  {src: 'IMG_0702.mp4', start: 6.6}, {src: 'IMG_0707.mp4', start: 8.8}, {src: 'IMG_0711.mp4', start: 0.9},
];
// candle (bottom): materials → maker → hands → pour → stir → wick → set → flame
const BOTTOM: Clip[] = [
  {src: 'IMG_0756.mp4', start: 4.0}, {src: 'IMG_0745.mp4', start: 11.6, fy: 40}, {src: 'IMG_0750.mp4', start: 2.1},
  {src: 'IMG_0763.mp4', start: 3.2}, {src: 'IMG_0762.mp4', start: 3.6}, {src: 'IMG_0754.mp4', start: 7.3},
  {src: 'IMG_0772.mp4', start: 5.1}, {src: 'IMG_0774.mp4', start: 0.2}, {src: 'IMG_0776.mp4', start: 0},
  {src: 'IMG_0777.mp4', start: 0},
];
const END_BEAT = 36; // end card from here

const Half: React.FC<{clip: Clip; frames: number; top: boolean}> = ({clip, frames, top}) => {
  const fr = useCurrentFrame();
  const zoom = 1.04 + 0.04 * (fr / Math.max(1, frames)); // subtle push-in, hides edge jitter
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`videos/reel/${clip.src}`)}
        startFrom={f(clip.start)}
        playbackRate={clip.rate ?? 1}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${clip.fy ?? 50}%`, transform: `scale(${zoom})`, filter: grade.filter}}
      />
      <AbsoluteFill style={{background: grade.warmth, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill
        style={{background: top ? 'linear-gradient(to top, rgba(11,11,11,0.55), rgba(11,11,11,0) 30%)' : 'linear-gradient(to bottom, rgba(11,11,11,0.55), rgba(11,11,11,0) 30%)'}}
      />
    </AbsoluteFill>
  );
};

const Track: React.FC<{clips: Clip[]; cuts: number[]; top: boolean}> = ({clips, cuts, top}) => (
  <>
    {clips.map((c, i) => {
      const from = i === 0 ? 0 : f(cuts[i - 1]);
      const to = f(cuts[i] ?? BEATS[END_BEAT]);
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <Half clip={c} frames={to - from} top={top} />
        </Sequence>
      );
    })}
  </>
);

const label: React.CSSProperties = {fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, color: colors.ivory, textTransform: 'uppercase', position: 'absolute', left: safe.side};

export const BlackoutReel: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const topCuts = TOP.map((_, i) => BEATS[(i + 1) * 4]);
  const botCuts = BOTTOM.map((_, i) => BEATS[2 + i * 4]);
  const endFrom = f(BEATS[END_BEAT]);
  const intro = interpolate(frame, [0, 6, f(BEATS[8]) - 6, f(BEATS[8])], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const endIn = interpolate(frame, [endFrom, endFrom + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 958, overflow: 'hidden'}}>
        <Track clips={TOP} cuts={topCuts} top />
        <div style={{...label, bottom: 34}}>the kitchen</div>
      </div>
      <div style={{position: 'absolute', top: 962, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
        <Track clips={BOTTOM} cuts={botCuts} top={false} />
        <div style={{...label, top: 34}}>the candle</div>
      </div>
      {/* hairline between the two kitchens */}
      <div style={{position: 'absolute', top: 958, left: 0, right: 0, height: 4, background: colors.night}} />

      {/* intro title on the seam */}
      <div style={{position: 'absolute', top: 960 - 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: intro}}>
        <div style={{background: colors.night, padding: '22px 44px', textAlign: 'center'}}>
          <div style={{fontFamily: fonts.display, fontSize: 64, color: colors.ivory, textTransform: 'uppercase', letterSpacing: 1}}>Two ways of cooking</div>
        </div>
      </div>

      {/* end card */}
      <Sequence from={endFrom}>
        <AbsoluteFill style={{opacity: endIn}}>
          <AbsoluteFill style={{overflow: 'hidden'}}>
            <OffthreadVideo src={staticFile('videos/reel/IMG_0778.mp4')} startFrom={f(2.7)} muted
              style={{width: '100%', height: '100%', objectFit: 'cover', filter: `${grade.filter} brightness(0.75)`}} />
            <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.4) 45%, rgba(11,11,11,0) 70%)'}} />
          </AbsoluteFill>
          <div style={{position: 'absolute', top: safe.top + 40, left: 0, right: 0, textAlign: 'center', color: colors.ivory}}>
            <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, letterSpacing: 6, textTransform: 'uppercase'}}>29/10 · from 19:00</div>
            <div style={{fontFamily: fonts.display, fontSize: 110, lineHeight: 1, textTransform: 'uppercase', marginTop: 22}}>Blackout<br />night</div>
            <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', marginTop: 26}}>dinner by candlelight</div>
            <div style={{width: 200, height: 3, background: colors.orange, margin: '30px auto'}} />
            <div style={{fontFamily: fonts.display, fontSize: 52, textTransform: 'none'}}>the candle cluub × Sea, Signora</div>
            <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', marginTop: 18, opacity: 0.85}}>via fiori chiari 32 · brera</div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill style={{background: colors.night, opacity: out}} />
      {withAudio ? <Audio src={staticFile('music/ref-art-of-hands.mp3')} /> : null}
    </AbsoluteFill>
  );
};
