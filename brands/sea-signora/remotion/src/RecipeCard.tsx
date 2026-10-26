import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, safe} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Two recipes of one evening», take 3: the recipe card.
// One recipe, written once, cooked twice. Each step is a rhyme: the dish does it, then the candle does
// the same verb. The shot sits in an editorial window on night; under it the step number + verb stays
// for the whole step and only "the dish / the candle" switches. Step 07 is the evening itself, and the
// only transition in the video is the slow fade from the lit candle into the Blackout Night poster.
// No grade (client, 26.10), hard cuts on the beat (2 beats a shot, finale 4).

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

// ref-two-recipes (96 BPM) re-looped every 16 beats in public/music/final-recipe-card.mp3
const BASE = [0.743, 1.37, 1.997, 2.647, 3.274, 3.924, 4.551, 5.178, 5.828, 6.455, 7.105, 7.755, 8.382, 9.009, 9.66, 10.286];
const LOOP = 10.937 - 0.743;
const BEATS = [0, 1, 2].flatMap((k) => BASE.map((b) => b + k * LOOP));
const beat = (i: number) => (i <= 0 ? 0 : BEATS[i - 1]);

type Shot = {clip: string; start: number; fy: number; who: string};
type Step = {n: string; verb: string; shots: [Shot, Shot]};
const s = (clip: string, start: number, fy: number, who: string): Shot => ({clip, start, fy, who});
const DISH = 'the dish';
const CANDLE = 'the candle';

export const STEPS: Step[] = [
  {n: '', verb: 'two hands', shots: [s('IMG_0684', 0.55, 60, 'the chef'), s('IMG_0764', 5.72, 69, 'the candle maker')]},
  {n: '01', verb: 'heat', shots: [s('IMG_0667', 10.07, 55, DISH), s('IMG_0760', 0, 82, CANDLE)]},
  {n: '02', verb: 'measure', shots: [s('IMG_0638', 2.26, 46, DISH), s('IMG_0746', 2.07, 63, CANDLE)]},
  {n: '03', verb: 'season', shots: [s('IMG_0708', 0.93, 60, DISH), s('IMG_0748', 33.66, 46, CANDLE)]},
  {n: '04', verb: 'stir', shots: [s('IMG_0696', 6.88, 62, DISH), s('IMG_0762', 5, 75, CANDLE)]},
  {n: '05', verb: 'pour', shots: [s('IMG_0655', 8.08, 73, DISH), s('IMG_0767', 11.13, 30, CANDLE)]},
  {n: '06', verb: 'place', shots: [s('IMG_0637', 5.3, 60, DISH), s('IMG_0754', 5.9, 55, CANDLE)]},
  {n: '07', verb: 'the evening', shots: [s('IMG_0709', 2.7, 74, DISH), s('candle-light', 3.575, 58, CANDLE)]},
];

const BEATS_PER_SHOT = 2;
const FINALE_BEATS = 4;
const SHOTS = STEPS.flatMap((st) => st.shots.map((sh) => ({...sh, step: st})));
const CUTS = SHOTS.map((_, i) => beat(i * BEATS_PER_SHOT));
const SHOTS_END = beat((SHOTS.length - 1) * BEATS_PER_SHOT + FINALE_BEATS);
const FADE = 0.8;
const HOLD = 4;
export const RECIPE_CARD_S = SHOTS_END + FADE + HOLD;

// window: 960 x 1080 on night, between the title block and the step line
const WIN = {top: 392, left: 60, width: 960, height: 1080};

export const RecipeCard: React.FC = () => {
  const f = useCurrentFrame();
  const end = fr(SHOTS_END);
  const posterO = interpolate(f, [end, end + fr(FADE)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const idx = Math.max(0, CUTS.findIndex((c, i) => f >= fr(c) && (i === CUTS.length - 1 || f < fr(CUTS[i + 1]))));
  const cur = SHOTS[idx];
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <div style={{position: 'absolute', top: safe.top + 8, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono,
        fontSize: 19, letterSpacing: 5, color: colors.ivory, opacity: 0.6, textTransform: 'uppercase'}}>
        Sea, Signora × the candle cluub
      </div>
      <div style={{position: 'absolute', top: safe.top + 46, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.display,
        fontSize: 50, letterSpacing: 1, color: colors.ivory, textTransform: 'uppercase'}}>
        Two recipes of one evening
      </div>

      <div style={{position: 'absolute', ...WIN, overflow: 'hidden', outline: '1px solid rgba(248,246,245,0.18)'}}>
        {SHOTS.map((sh, i) => {
          const from = fr(CUTS[i]);
          const to = i === SHOTS.length - 1 ? end + fr(FADE) : fr(CUTS[i + 1]);
          return (
            <Sequence key={i} from={from} durationInFrames={to - from}>
              <OffthreadVideo src={staticFile(`videos/reel/${sh.clip}.mp4`)} startFrom={fr(sh.start)} muted
                style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${sh.fy}%`}} />
            </Sequence>
          );
        })}
      </div>

      <div style={{position: 'absolute', top: WIN.top + WIN.height + 22, left: 0, right: 0, textAlign: 'center', color: colors.ivory}}>
        <span style={{fontFamily: fonts.display, fontSize: 44, opacity: 0.55, marginRight: cur.step.n ? 22 : 0}}>{cur.step.n}</span>
        <span style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 46}}>{cur.step.verb}</span>
      </div>
      <div style={{position: 'absolute', top: WIN.top + WIN.height + 84, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono,
        fontSize: 19, letterSpacing: 5, color: colors.ivory, opacity: 0.6, textTransform: 'uppercase'}}>
        {cur.who}
      </div>

      <AbsoluteFill style={{opacity: posterO}}>
        <Img src={staticFile('photos/blackout-poster.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <Audio src={staticFile('music/final-recipe-card.mp3')} />
    </AbsoluteFill>
  );
};
