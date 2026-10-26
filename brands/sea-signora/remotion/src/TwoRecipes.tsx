import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, grade, safe} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// «Two recipes of one evening» — the candle and the dish are made the same way.
// Client notes (26.10): split for the WHOLE video (finale too), no poster, 15+ s,
// ONE title for the whole video, calmer cuts (~2.5 s), the subject (plate / candle)
// centred inside each half. Plus a non-split version: full-frame shots one after another, 20–30 s.
// fy = vertical focus, computed with tools/subject_center.py (centre of detail in the shot).

export const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

type Clip = {src: string; start: number; fy?: number};
type Pair = [Clip, Clip]; // [kitchen, candle]

// ── split: track "The art of hands" (152 BPM), one pair every 6 beats, finale from beat 36
const B_HANDS = [0.093, 0.534, 0.952, 1.37, 1.788, 2.206, 2.624, 3.042, 3.46, 3.855, 4.249, 4.644, 5.039, 5.41, 5.805,
  6.177, 6.548, 6.989, 7.407, 7.825, 8.22, 8.615, 9.033, 9.404, 9.822, 10.217, 10.612, 11.006, 11.424, 11.819, 12.214,
  12.608, 13.003, 13.398, 13.816, 14.211, 14.605, 15.0, 15.395, 15.79, 16.184, 16.579, 16.974, 17.369];
export const SPLIT_S = 18.4;

const c = (n: string, start: number, fy: number): Clip => ({src: n.endsWith('.mp4') ? n : `IMG_${n}.mp4`, start, fy});

export const SPLITS: Record<string, Pair[]> = {
  // the selection · the heat · the pour · the precision · the plating · the finish · two flames
  s1: [
    [c('0633', 3.9, 73), c('0763', 2.6, 56)],
    [c('0696', 8.3, 62), c('0762', 3.5, 74)],
    [c('0654', 1.5, 68), c('0747', 0.2, 34)],
    [c('0702', 10.6, 68), c('0772', 4.3, 16)],
    [c('0657', 2.4, 42), c('0751', 1.4, 66)],
    [c('0711', 0.3, 60), c('0776', 0, 90)],
    [c('0706', 5.5, 50), c('candle-light.mp4', 2.6, 59)],
  ],
  s2: [
    [c('0646', 5.2, 74), c('0746', 1.5, 63)],
    [c('0686', 1.5, 56), c('0764', 3.2, 67)],
    [c('0653', 0.7, 51), c('0766', 3.0, 26)],
    [c('0701', 9.9, 79), c('0777', 0.5, 86)],
    [c('0656', 5.6, 45), c('0754', 7.4, 58)],
    [c('0665', 0.6, 62), c('0778', 3.0, 88)],
    [c('0706', 7.0, 54), c('candle-light.mp4', 2.6, 59)],
  ],
};
const SPLIT_CUTS = [0, 6, 12, 18, 24, 30, 36].map((i) => (i === 0 ? 0 : B_HANDS[i]));

// ── sequential: track "kitchen cinematic" (103 BPM), one shot every 4 beats, 23.4 s
const B_KITCHEN = [0.116, 0.766, 1.416, 1.997, 2.577, 3.158, 3.738, 4.296, 4.876, 5.433, 6.014, 6.571, 7.152, 7.709,
  8.29, 8.87, 9.451, 10.008, 10.588, 11.146, 11.726, 12.283, 12.864, 13.444, 14.002, 14.582, 15.163, 15.72, 16.3, 16.858,
  17.438, 17.995, 18.576, 19.156, 19.737, 20.294, 20.875, 21.432];
export const SEQ_S = 23.4;
// chef ↔ candle maker, then the same step for each: selection, pour, precision, heat → flame
const SEQ: Clip[] = [
  c('0638', 2.1, 50), c('0749', 14.6, 50), c('0647', 1.3, 50), c('0763', 2.6, 50), c('0654', 1.5, 50),
  c('0747', 0.2, 50), c('0702', 10.6, 50), c('0772', 4.3, 50), c('0706', 5.5, 50), c('candle-light.mp4', 2.6, 50),
];
const SEQ_CUTS = SEQ.map((_, i) => (i === 0 ? 0 : B_KITCHEN[i * 4 - 1]));

const TITLE = 'Two recipes of one evening';

const Shot: React.FC<{c: Clip; len: number}> = ({c: clip, len}) => {
  const f = useCurrentFrame();
  const scale = 1.0 + 0.04 * (f / Math.max(1, len)); // calm drift only
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`videos/reel/${clip.src}`)}
        startFrom={fr(clip.start)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${clip.fy ?? 50}%`,
          transform: `scale(${scale})`, transformOrigin: `50% ${clip.fy ?? 50}%`, filter: grade.filter}}
      />
      <AbsoluteFill style={{background: grade.warmth, mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};

const Fades: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, total - 14, total - 1], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: colors.night, opacity: o}} />;
};

export const TwoRecipesSplit: React.FC<{variant?: string}> = ({variant = 's1'}) => {
  const pairs = SPLITS[variant] ?? SPLITS.s1;
  const total = fr(SPLIT_S);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {pairs.map((p, i) => {
        const from = fr(SPLIT_CUTS[i]);
        const to = i === pairs.length - 1 ? total : fr(SPLIT_CUTS[i + 1]);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 958, overflow: 'hidden'}}><Shot c={p[0]} len={to - from} /></div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 962, height: 958, overflow: 'hidden'}}><Shot c={p[1]} len={to - from} /></div>
          </Sequence>
        );
      })}
      {/* one title for the whole video, on the seam */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 960 - 110, height: 220,
        background: 'linear-gradient(to bottom, rgba(11,11,11,0) 0%, rgba(11,11,11,0.5) 50%, rgba(11,11,11,0) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 960 - 34, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontFamily: fonts.display, fontSize: 54, color: colors.ivory, textTransform: 'uppercase', letterSpacing: 1,
          textShadow: '0 1px 14px rgba(0,0,0,0.6)'}}>{TITLE}</span>
      </div>
      <Fades total={total} />
      <Audio src={staticFile('music/ref-art-of-hands.mp3')} />
    </AbsoluteFill>
  );
};

export const TwoRecipesSeq: React.FC = () => {
  const total = fr(SEQ_S);
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {SEQ.map((clip, i) => {
        const from = fr(SEQ_CUTS[i]);
        const to = i === SEQ.length - 1 ? total : fr(SEQ_CUTS[i + 1]);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Shot c={clip} len={to - from} />
          </Sequence>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 620,
        background: 'linear-gradient(to bottom, rgba(11,11,11,0.75) 0%, rgba(11,11,11,0.35) 55%, rgba(11,11,11,0) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: safe.top + 30, textAlign: 'center'}}>
        <span style={{fontFamily: fonts.display, fontSize: 58, color: colors.ivory, textTransform: 'uppercase', letterSpacing: 1}}>{TITLE}</span>
      </div>
      <Fades total={total} />
      <Audio src={staticFile('music/ref-kitchen-cinematic.mp3')} />
    </AbsoluteFill>
  );
};
