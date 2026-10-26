import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, grade} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Blackout Night × the candle cluub — "Two ways of cooking".
// Story: one evening, two crafts. Each of the 4 courses of the Blackout Night menu is paired
// with one step of making the candle (raw → heat → pour → finish). Then the two meet in a
// fast full-screen finale, the candle flame fills the frame, lights go out (the "blackout")
// and the poster appears out of the dark, lit like by a candle.
// All cuts sit on the beat of the reference track (152 BPM, 1 beat ≈ 0.41 s).

export const FPS = 30;
const B = [0.093, 0.534, 0.952, 1.37, 1.788, 2.206, 2.624, 3.042, 3.46, 3.855, 4.249, 4.644, 5.039, 5.41, 5.805, 6.177,
  6.548, 6.989, 7.407, 7.825, 8.22, 8.615, 9.033, 9.404, 9.822, 10.217, 10.612, 11.006, 11.424, 11.819, 12.214, 12.608,
  13.003, 13.398, 13.816, 14.211, 14.605, 15.0, 15.395, 15.79, 16.184, 16.579, 16.974, 17.369];
export const DURATION_S = 18.4;
const fr = (s: number) => Math.round(s * FPS);
const beat = (i: number) => (i <= 0 ? 0 : fr(B[i]));

type Clip = {src: string; start: number; rate?: number; fy?: number; fx?: number};
type Shot = {clip: Clip; from: number; to: number}; // beat indexes

// ── Split acts: [top = kitchen, bottom = candle], 2 shots per half, bottom cuts 1 beat later
const ACTS: {top: Clip[]; bottom: Clip[]}[] = [
  // 0 · hook: the flame in the kitchen ↔ the candle waiting for its flame
  {top: [{src: 'IMG_0706.mp4', start: 3.2}], bottom: [{src: 'IMG_0776.mp4', start: 0}]},
  // I · Akami, culatello e porcini  ↔  raw wax
  {top: [{src: 'IMG_0647.mp4', start: 2.1}, {src: 'IMG_0719.mp4', start: 4.1}],
    bottom: [{src: 'IMG_0746.mp4', start: 3.1, fy: 40}, {src: 'IMG_0763.mp4', start: 3.2}]},
  // II · Scampo, lardo, trombette  ↔  heat: wax melting
  {top: [{src: 'IMG_0702.mp4', start: 6.6}, {src: 'IMG_0703.mp4', start: 1.1}],
    bottom: [{src: 'IMG_0762.mp4', start: 3.6}, {src: 'IMG_0764.mp4', start: 3.2}]},
  // III · Tagliolini, calamari e finferli  ↔  pour
  {top: [{src: 'IMG_0681.mp4', start: 12.1}, {src: 'IMG_0711.mp4', start: 0.9}],
    bottom: [{src: 'IMG_0766.mp4', start: 3.0, rate: 0.75}, {src: 'IMG_0773.mp4', start: 9.8}]},
  // IV · Polpo, zucca, nocciole  ↔  the wick, the finish
  {top: [{src: 'IMG_0655.mp4', start: 9.0}, {src: 'IMG_0657.mp4', start: 2.4}],
    bottom: [{src: 'IMG_0772.mp4', start: 5.1}, {src: 'IMG_0776.mp4', start: 0}]},
];
const COURSES = ['', 'Akami · culatello · porcini', 'Scampo · lardo · trombette', 'Tagliolini · calamari · finferli', 'Polpo · zucca · nocciole'];
const ACT_BEATS = [0, 4, 10, 16, 22, 28]; // act i spans ACT_BEATS[i]..ACT_BEATS[i+1]

// ── Finale: full-screen, one shot per beat, plates and candles alternate
const FINALE: Clip[] = [
  {src: 'IMG_0663.mp4', start: 13.4}, {src: 'IMG_0778.mp4', start: 2.7}, {src: 'IMG_0713.mp4', start: 0.2},
  {src: 'IMG_0774.mp4', start: 0.2}, {src: 'IMG_0718.mp4', start: 0},
];
const FINALE_FROM = 28;
const FLAME_FROM = 33; // the flame close-up, then lights out
const BLACK_FROM = 35; // blackout
const POSTER_FROM = 36;

const Video: React.FC<{c: Clip; len: number; punch?: boolean}> = ({c, len, punch = true}) => {
  const f = useCurrentFrame();
  // punch-in on the cut (1.14 → 1.04 in 7 frames), then a slow push for constant movement
  const p = punch ? interpolate(f, [0, 7], [1.14, 1.04], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 1.04;
  const scale = p + 0.05 * (f / Math.max(1, len));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`videos/reel/${c.src}`)}
        startFrom={fr(c.start)}
        playbackRate={c.rate ?? 1}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `scale(${scale})`, filter: grade.filter}}
      />
      <AbsoluteFill style={{background: grade.warmth, mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};

// Shots of one half inside an act: equal split of the act, bottom offset by 1 beat.
const shotsFor = (clips: Clip[], a: number, b: number, offset: number): Shot[] => {
  if (clips.length === 1) return [{clip: clips[0], from: a, to: b}];
  const mid = Math.round((a + b) / 2) + offset;
  return [{clip: clips[0], from: a, to: mid}, {clip: clips[1], from: mid, to: b}];
};

const Half: React.FC<{shots: Shot[]}> = ({shots}) => (
  <>
    {shots.map((s, i) => (
      <Sequence key={i} from={beat(s.from)} durationInFrames={beat(s.to) - beat(s.from)}>
        <Video c={s.clip} len={beat(s.to) - beat(s.from)} />
      </Sequence>
    ))}
  </>
);

export const BlackoutReel: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => {
  const f = useCurrentFrame();
  const top: Shot[] = [];
  const bot: Shot[] = [];
  ACTS.forEach((act, i) => {
    top.push(...shotsFor(act.top, ACT_BEATS[i], ACT_BEATS[i + 1], 0));
    bot.push(...shotsFor(act.bottom, ACT_BEATS[i], ACT_BEATS[i + 1], 1));
  });
  // split opening: halves slide in from top and bottom on the first two beats
  const open = interpolate(f, [0, beat(2)], [1, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
  const splitEnd = beat(FINALE_FROM);
  // poster: appears from black with candle-like flicker and slow pull-back
  const pf = f - beat(POSTER_FROM);
  const posterIn = interpolate(pf, [0, 4, 6, 9, 12, 22], [0, 0.55, 0.3, 0.8, 0.65, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flicker = 1 + 0.035 * Math.sin(pf * 0.9) * Math.sin(pf * 0.37);
  const posterScale = interpolate(pf, [0, 120], [1.12, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  // course caption: tiny, inside the black seam between the halves (no plate over the picture)
  const actIdx = ACT_BEATS.findIndex((b, i) => f >= beat(b) && f < beat(ACT_BEATS[i + 1] ?? 999));
  const capA = actIdx > 0 ? interpolate(f - beat(ACT_BEATS[actIdx]), [2, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  return (
    <AbsoluteFill style={{background: colors.night}}>
      {f < splitEnd ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 938, overflow: 'hidden', transform: `translateY(${-open * 938}px)`}}>
            <Half shots={top} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 982, height: 938, overflow: 'hidden', transform: `translateY(${open * 938}px)`}}>
            <Half shots={bot} />
          </div>
          {actIdx > 0 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 938, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: capA}}>
              <span style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 20, letterSpacing: 4, color: colors.ivory, textTransform: 'uppercase'}}>
                {['', 'I', 'II', 'III', 'IV'][actIdx]} · {COURSES[actIdx]}
              </span>
            </div>
          ) : null}
        </>
      ) : null}

      {FINALE.map((c, i) => (
        <Sequence key={i} from={beat(FINALE_FROM + i)} durationInFrames={beat(FINALE_FROM + i + 1) - beat(FINALE_FROM + i)}>
          <Video c={c} len={beat(FINALE_FROM + i + 1) - beat(FINALE_FROM + i)} />
        </Sequence>
      ))}
      <Sequence from={beat(FLAME_FROM)} durationInFrames={beat(BLACK_FROM) - beat(FLAME_FROM)}>
        <Video c={{src: 'IMG_0706.mp4', start: 6.2, rate: 0.6, fy: 30}} len={beat(BLACK_FROM) - beat(FLAME_FROM)} punch={false} />
      </Sequence>
      {/* blackout: hard cut to black for one beat */}
      <Sequence from={beat(POSTER_FROM)}>
        <AbsoluteFill style={{opacity: posterIn, filter: `brightness(${flicker})`}}>
          <Img src={staticFile('photos/blackout-poster.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${posterScale})`}} />
        </AbsoluteFill>
      </Sequence>

      {withAudio ? <Audio src={staticFile('music/ref-art-of-hands.mp3')} /> : null}
    </AbsoluteFill>
  );
};
