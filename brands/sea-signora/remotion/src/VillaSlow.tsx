import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato, creative and aesthetic cut (client 20.11). The camera shot 50 fps, so the key gestures can slow down
// for real: each shot starts at real speed and drops into slow motion on its moment (the shaker pour, the ladle, the
// tweezers, the dot of sauce, the jug, the caramel). Straight cuts on the beat of our own slow track, no transitions,
// no zooms, no animated type; one warm film grade on every shot and the real sound of each shot under the music.
// Headline «Cena a Quattro Mani» sits still on the first two shots.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const B = (60 / 100) * FPS; // marble-minimal, 100 bpm
const bt = (b: number) => Math.round(b * B);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});
const GRADE = 'contrast(1.07) saturate(1.06) sepia(0.1) brightness(0.97)';

// clip, start inside the 50 fps window (s), beats, slow: share of the shot played at 0.6×
const SHOTS: [string, number, number, number][] = [
  ['6013', 0.5, 3, 0], ['6022', 0, 2, 0], ['5983', 1.2, 2, 0], ['6050', 0.9, 3, 0],
  ['6093', 0.6, 2, 0], ['6096', 0.9, 3, 0.6], ['6047', 0, 2, 0],
  ['6086', 0.8, 3, 0.6], ['6090', 1.0, 3, 0.6], ['6159', 1.0, 2, 0], ['6162', 0.8, 3, 0.6], ['6178', 1.0, 2, 0],
  ['6138', 1.0, 3, 0.6], ['6174', 0.9, 2, 0], ['6182', 0.6, 2, 0],
  ['6227', 1.0, 5, 0.7], ['6239', 1.0, 3, 0],
];
const SLOW = 0.6, END = 4;
const MONT = SHOTS.reduce((s, x) => s + x[2], 0);
export const SLOW_FRAMES = bt(MONT + END);

const Part: React.FC<{n: string; from: number; rate: number; sound: boolean}> = ({n, from, rate, sound}) => (
  <OffthreadVideo src={staticFile(`videos/villa-hq/RZ4_${n}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted={!sound} volume={0.35}
    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: GRADE}} />
);
// a shot at real speed that drops to slow motion for its last `slow` share, continuing from the same source moment
const Ramp: React.FC<{n: string; at: number; frames: number; slow: number}> = ({n, at, frames, slow}) => {
  const fast = Math.round(frames * (1 - slow));
  const at2 = at + fast / FPS; // source time where the slow part picks up
  return (
    <>
      <Sequence durationInFrames={fast || 1}><Part n={n} from={at} rate={1} sound /></Sequence>
      {slow > 0 && <Sequence from={fast}><Part n={n} from={at2} rate={SLOW} sound={false} /></Sequence>}
    </>
  );
};
const Vignette = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />;
const Title: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: 'linear-gradient(to top, rgba(11,11,11,0.8), rgba(11,11,11,0.48) 45%, rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 90, right: 90, top: 1300}}>
      <div style={mono(20, SA)}>sea, signora × villa prato · 13.11</div>
      <div style={{fontFamily: fonts.display, fontSize: 118, lineHeight: 0.95, color: I, marginTop: 20}}><div>Cena a</div><div>Quattro Mani</div></div>
    </div>
  </>
);
const End: React.FC = () => (
  <AbsoluteFill style={{background: G, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
    <div style={{fontFamily: fonts.display, fontSize: 104, color: I, lineHeight: 1}}>Sea, Signora</div>
    <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 60, color: O, margin: '14px 0'}}>×</div>
    <div style={{fontFamily: fonts.display, fontSize: 104, color: I, lineHeight: 1}}>Villa Prato</div>
  </AbsoluteFill>
);
export const VillaSlow: React.FC = () => {
  let b = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music/villa-letter.mp3')} volume={(fr) => interpolate(fr, [0, 6, SLOW_FRAMES - 40, SLOW_FRAMES], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {SHOTS.map(([n, at, beats, slow], i) => {
        const from = bt(b); b += beats;
        const len = bt(b) - from;
        return <Sequence key={i} from={from} durationInFrames={len}><Ramp n={n} at={at} frames={len} slow={slow} /><Vignette /></Sequence>;
      })}
      <Sequence durationInFrames={bt(5)}><Title /></Sequence>
      <Sequence from={bt(MONT)}><End /></Sequence>
    </AbsoluteFill>
  );
};
