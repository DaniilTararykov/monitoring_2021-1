import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Reel «Sea, Signora Milano turns one» (client, 30.10; format after the client's reference: a paper note in the
// middle of a fast montage, the words arriving one by one, the note growing; the end on a softened frame with the
// handle). The montage is the restaurant's year: moments from the Drive folder «Lisa & Danik» (content shootings,
// life content, events), each cut on the steadiest, sharpest half second of its clip (scratchpad windows.py).
// Silent: the music is added in Instagram — cuts sit on a 0.5 s grid (120 bpm) so they land on most beats.

const FPS = 30;
export const CUT = 15; // frames per cut

export type YearCut = {clip: string; start: number; zoom?: number; fx?: number; fy?: number; rot?: number};

// the words of the note and the frame each one lands on
const WORDS: {text: string; at: number; line: number}[] = [
  {text: 'Sea,', at: 30, line: 0},
  {text: 'Signora', at: 45, line: 0},
  {text: 'Milano', at: 75, line: 1},
  {text: 'turns', at: 105, line: 2},
  {text: 'one', at: 135, line: 2},
];

const Shot: React.FC<{c: YearCut}> = ({c}) => {
  const z = c.zoom ?? 1;
  const r = Math.abs(c.rot ?? 0) * Math.PI / 180;
  const cover = Math.cos(r) + (1920 / 1080) * Math.sin(r);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(`videos/year/${c.clip}.mp4`)} startFrom={Math.round(c.start * FPS)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${c.fx ?? 50}% ${c.fy ?? 50}%`,
          transform: `rotate(${c.rot ?? 0}deg) scale(${z * cover})`, transformOrigin: `${c.fx ?? 50}% ${c.fy ?? 50}%`}} />
    </AbsoluteFill>
  );
};

// the paper note: ivory card, a soft fold at the corner, slightly tilted; words in brand orange
const Note: React.FC<{f: number}> = ({f}) => {
  const lines: string[][] = [[], [], []];
  WORDS.forEach((w) => { if (f >= w.at) lines[w.line].push(w.text); });
  const last = [...WORDS].reverse().find((w) => f >= w.at);
  const pop = last ? interpolate(f - last.at, [0, 4], [1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <div style={{position: 'relative', width: 640, height: 720, transform: `rotate(-1.6deg) scale(${pop})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 6,
        background: 'linear-gradient(160deg, #FBF7EF 0%, #F3ECDF 55%, #EADFCB 100%)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.38), inset 0 0 40px rgba(160,130,90,0.18)'}} />
      {/* folded corner */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 54, height: 54,
        background: 'linear-gradient(135deg, rgba(0,0,0,0) 50%, #E3D6BF 50%, #F7F1E6 100%)', borderTopLeftRadius: 6}} />
      <div style={{position: 'absolute', left: 46, right: 24, top: 64, fontFamily: fonts.display, fontSize: 102, lineHeight: 1.0, whiteSpace: 'nowrap',
        textTransform: 'uppercase', color: brandPalette.orange158, letterSpacing: 1}}>
        {lines.map((l, i) => <div key={i} style={{minHeight: 112}}>{l.join(' ')}</div>)}
      </div>
    </div>
  );
};

const IgGlyph: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.6}>
    <rect x="5" y="5" width="38" height="38" rx="11" />
    <circle cx="24" cy="24" r="9" />
    <circle cx="35" cy="13" r="1.6" fill={color} stroke="none" />
  </svg>
);

export const yearDuration = (n: number, endS: number) => n * CUT + Math.round(endS * FPS);

export const Anniversary: React.FC<{cuts: YearCut[]; endS: number}> = ({cuts, endS}) => {
  const f = useCurrentFrame();
  const montageEnd = cuts.length * CUT;
  const ending = f >= montageEnd;
  // the note grows in steps with the words, then once more for the end card
  const scale = interpolate(f, [0, 70, 76, 100, 106, 130, 138, montageEnd, montageEnd + 10], [0.42, 0.42, 0.5, 0.5, 0.58, 0.58, 0.64, 0.64, 0.9],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const endIn = interpolate(f, [montageEnd, montageEnd + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lastCut = cuts[cuts.length - 1];
  return (
    <AbsoluteFill style={{background: brandPalette.green5605}}>
      {cuts.map((c, i) => (
        <Sequence key={i} from={i * CUT} durationInFrames={CUT}>
          <Shot c={c} />
        </Sequence>
      ))}
      {/* end: the last moment held, softened */}
      {ending ? (
        <Sequence from={montageEnd}>
          <AbsoluteFill style={{filter: `blur(${18 * endIn}px) brightness(${1 - 0.4 * endIn})`, transform: 'scale(1.06)'}}>
            <Shot c={{...lastCut, start: lastCut.start + CUT / FPS}} />
          </AbsoluteFill>
        </Sequence>
      ) : null}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(to bottom, rgba(11,11,11,0.35), rgba(11,11,11,0))'}} />
      <div style={{position: 'absolute', top: 262, right: 70, opacity: 1 - endIn}}>
        <IgGlyph size={46} color={colors.ivory} />
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `translateY(${300 * (1 - endIn) - 60 * endIn}px) scale(${scale})`}}><Note f={f} /></div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1460, textAlign: 'center', opacity: endIn, color: colors.ivory}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><IgGlyph size={64} color={colors.ivory} /></div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 4, marginTop: 16, textTransform: 'uppercase'}}>@seasignora.milano</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 34, marginTop: 12}}>grazie per questo primo anno</div>
      </div>
    </AbsoluteFill>
  );
};
