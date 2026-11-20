import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato, extra creative cut (client 20.11: «экстра креативный, динамичный, ~30 с, концептуальный по кадрам —
// логично и красиво»). Concept: a relay of gestures. Every straight cut carries the movement of the shot before it on
// to the next, so the evening reads as one continuous hand-off: looking up at the dome → the room under it → a detail
// of the room; one menu → a table of menus; a bottle pours → a shaker pours → the glasses stand full; tweezers → tweezers;
// a dot of sauce → a plate → a pass full of plates; a jug pours at the pass → the same pour at the table; a plate carried
// down the stairs → set down in front of a guest; the last pour of caramel → the chef's hands. No transitions, no zooms,
// no animated type: the headline simply sits on the first two shots. Cuts on the beat of brera-house (122 bpm); short
// chains run one beat a shot, reveals hold for three or four.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const B = (60 / 122) * FPS;
const bt = (b: number) => Math.round(b * B);
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 6, textTransform: 'uppercase', color: c});

const SHOTS: [string, number, number][] = [ // clip, start (s), beats
  // arriving: look up, look around, look closer
  ['6013', 0.5, 3], ['6022', 0, 2], ['5962', 0, 2], ['5953', 0.8, 1],
  // one menu, then a table of them
  ['5983', 5.7, 2], ['6050', 2.4, 3],
  // the pour chain at the bar
  ['6093', 0.6, 2], ['6044', 6.0, 1], ['6097', 0, 1], ['6096', 2.7, 1], ['6047', 0, 2],
  // the kitchen: ladle, tweezers, tweezers, the tray
  ['6086', 4.6, 2], ['6090', 5.6, 1], ['6088', 3.0, 1], ['6085', 1.2, 2],
  // the dots of sauce: a chef, a hand, a plate, a spoon, then all the plates
  ['6165', 8.0, 2], ['6159', 12.0, 2], ['6162', 0.8, 1], ['6163', 10.5, 1], ['6177', 24.4, 1], ['6178', 9.6, 3],
  // the same pour, at the pass and then at the table
  ['6138', 9.6, 2], ['6226', 0.6, 2],
  // carried down the stairs, set in front of a guest, the table
  ['6174', 1.5, 2], ['6125', 2.0, 2], ['6100', 0.6, 2],
  // the wine, the last pour, then the chef's hands
  ['6182', 0.6, 2], ['6227', 5.0, 3], ['6239', 2.0, 4],
];
const END = 4;
const MONT = SHOTS.reduce((s, x) => s + x[2], 0);
export const RELAY_FRAMES = bt(MONT + END);

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
  <AbsoluteFill style={{background: SA, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
    <div style={{fontFamily: fonts.display, fontSize: 104, color: G, lineHeight: 1}}>Sea, Signora</div>
    <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 60, color: O, margin: '14px 0'}}>×</div>
    <div style={{fontFamily: fonts.display, fontSize: 104, color: G, lineHeight: 1}}>Villa Prato</div>
  </AbsoluteFill>
);

export const VillaRelay: React.FC = () => {
  let b = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music/villa-hands.mp3')} volume={(fr) => interpolate(fr, [0, 3, RELAY_FRAMES - 30, RELAY_FRAMES], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {SHOTS.map(([n, at, beats], i) => {
        const from = bt(b); b += beats;
        return (
          <Sequence key={i} from={from} durationInFrames={bt(b) - from}>
            <OffthreadVideo src={staticFile(`videos/villa/RZ4_${n}.mp4`)} startFrom={Math.round(at * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
        );
      })}
      <Sequence durationInFrames={bt(5)}><Title /></Sequence>
      <Sequence from={bt(MONT)}><End /></Sequence>
    </AbsoluteFill>
  );
};
