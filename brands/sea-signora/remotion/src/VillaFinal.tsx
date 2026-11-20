import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato, plain cut (client 20.11: headline «Cena a Quattro Mani», energetic but no effects, a bit of everything;
// no text animation, no transitions). Straight cuts on every second beat of brera-house (122 bpm), each shot used once,
// the evening in order: villa, bar, kitchen, service, dessert, the chef with the room. No zooms, no fades, no motion on
// the type: the headline simply sits on the first two shots, the logos on the last card.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const B = (60 / 122) * FPS;
const bt = (b: number) => Math.round(b * B);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});

const SHOTS: [string, number, number][] = [ // clip, start (s), beats
  ['6022', 0, 2], ['5962', 0, 2], ['6013', 0.5, 2], ['5983', 5.7, 2], ['6050', 2.4, 2],
  ['6093', 0.6, 2], ['6096', 2.7, 2], ['6047', 0, 2],
  ['6159', 12.0, 2], ['6165', 8.0, 2], ['6086', 4.6, 2], ['6090', 5.6, 2], ['6151', 6.6, 2], ['6162', 0.8, 2], ['6177', 24.4, 2], ['6138', 3.5, 2],
  ['6174', 1.5, 2], ['6182', 0.6, 2], ['6226', 0.6, 2], ['6100', 0.6, 2],
  ['6227', 5.0, 2], ['6239', 2.0, 4],
];
const END = 4;
const MONT = SHOTS.reduce((s, x) => s + x[2], 0);
export const FINAL_FRAMES = bt(MONT + END);

const Title: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: 'linear-gradient(to top, rgba(11,11,11,0.8), rgba(11,11,11,0.48) 45%, rgba(11,11,11,0))'}} />
    <div style={{position: 'absolute', left: 90, right: 90, top: 1300}}>
      <div style={mono(20, SA)}>sea, signora × villa prato · 13.11</div>
      <div style={{fontFamily: fonts.display, fontSize: 118, lineHeight: 0.95, color: I, marginTop: 20}}>{'Cena a\nQuattro Mani'.split('\n').map((l) => <div key={l}>{l}</div>)}</div>
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

export const VillaFinal: React.FC = () => {
  let b = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music/villa-hands.mp3')} volume={(fr) => interpolate(fr, [0, 3, FINAL_FRAMES - 30, FINAL_FRAMES], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {SHOTS.map(([n, at, beats], i) => {
        const from = bt(b); b += beats;
        return (
          <Sequence key={i} from={from} durationInFrames={bt(b) - from}>
            <OffthreadVideo src={staticFile(`videos/villa/RZ4_${n}.mp4`)} startFrom={Math.round(at * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
        );
      })}
      <Sequence durationInFrames={bt(4)}><Title /></Sequence>
      <Sequence from={bt(MONT)}><End /></Sequence>
    </AbsoluteFill>
  );
};
