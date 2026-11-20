import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Villa Prato «Pellicola» (client 20.11: the page / word-card language is the same as the birthday reel — make something
// else). A strip of film in Sea, Signora orange runs up through a green frame, steadily, on the tempo of the track
// (one film frame every two beats): sprocket holes, a frame number on every frame, a mono edge print along the side
// (SEA, SIGNORA × VILLA PRATO · CENA A QUATTRO MANI · 13.11). Each film frame plays its own take of the evening, in order,
// once. No cuts and no jumps: the motion is the strip itself. The headline stands still on the green until the strip
// covers it; at the end the strip slows and stops on the chef with the room, then the end card.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, SA = brandPalette.sand454, I = colors.ivory;
const BEAT = (60 / 122) * FPS;
const PITCH = 880, FW = 640, FH = 800, SX = 140, SW = 800;   // film frame pitch, picture size, strip x / width
const SPEED = PITCH / (2 * BEAT);                               // px per output frame: one film frame every two beats
const CLIPS: [string, number][] = [
  ['6013', 0.5], ['6022', 0], ['5962', 0], ['5983', 5.7], ['6050', 2.4], ['6093', 0.6], ['6096', 2.7], ['6047', 0],
  ['6159', 12.0], ['6165', 8.0], ['6086', 4.6], ['6090', 5.6], ['6162', 0.8], ['6177', 24.4], ['6178', 9.6], ['6138', 9.6],
  ['6174', 1.5], ['6182', 0.6], ['6226', 0.6], ['6100', 0.6], ['6227', 5.0], ['6239', 2.0],
];
const INTRO = Math.round(4 * BEAT);                                       // the title alone on green
const STOP_OFF = 1920 + (CLIPS.length - 1) * PITCH + FH / 2 - 960;        // offset that centres the last frame
const RUN = Math.round(STOP_OFF / SPEED);                                 // frames of steady running
const EASE = Math.round(2 * BEAT), HOLD = Math.round(3 * BEAT), END = Math.round(4 * BEAT);
export const FILM_FRAMES = INTRO + RUN + EASE + HOLD + END;

// strip offset at output frame f: steady run, then the last two beats ease into the stop
const offsetAt = (f: number) => {
  const t = f - INTRO;
  if (t <= 0) return 0;
  const runTo = STOP_OFF - (SPEED * EASE) / 2;                           // the ease covers half the distance a steady run would
  const steadyEnd = runTo / SPEED;
  if (t <= steadyEnd) return t * SPEED;
  const e = Math.min(1, (t - steadyEnd) / EASE);
  return runTo + (STOP_OFF - runTo) * Easing.out(Easing.quad)(e);
};
const enterFrame = (i: number) => {                                        // first output frame where film frame i is on screen
  const need = 1920 + i * PITCH - 1920;                                    // its top reaches the bottom edge
  return INTRO + Math.max(0, Math.floor(need / SPEED) - 2);
};
const mono = (s: number, c: string): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: s, letterSpacing: 5, textTransform: 'uppercase', color: c});

const Strip: React.FC = () => {
  const f = useCurrentFrame();
  const off = offsetAt(f);
  const top0 = 1920 - off;                                                // y of film frame 0
  const holes = [];
  const hp = PITCH / 8;
  const first = Math.floor((off - 1920) / hp) - 2;
  for (let k = first; k < first + 1920 / hp + 4; k++) {
    const y = top0 + k * hp + 20;
    if (y < -60 || y > 1960) continue;
    holes.push(<div key={`l${k}`} style={{position: 'absolute', left: SX + 22, top: y, width: 34, height: 52, borderRadius: 8, background: G}} />);
    holes.push(<div key={`r${k}`} style={{position: 'absolute', left: SX + SW - 56, top: y, width: 34, height: 52, borderRadius: 8, background: G}} />);
  }
  return (
    <>
      <div style={{position: 'absolute', left: SX, top: Math.max(0, top0 - 60), width: SW, bottom: 0, background: O}} />
      {holes}
      {CLIPS.map(([c, at], i) => {
        const y = top0 + i * PITCH;
        if (y > 1960 || y + FH < -40) return null;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: SX + 80, top: y, width: FW, height: FH, overflow: 'hidden', background: '#000'}}>
              <Sequence from={enterFrame(i) - f}>
                <OffthreadVideo src={staticFile(`videos/villa/RZ4_${c}.mp4`)} startFrom={Math.round(at * FPS)} muted
                  style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </Sequence>
            </div>
            <div style={{position: 'absolute', left: SX + 80, top: y + FH + 14, width: FW, display: 'flex', justifyContent: 'space-between', ...mono(18, G)}}>
              <span>{`${String(i + 1).padStart(2, '0')}A`}</span><span>cena a quattro mani</span><span>{`▸ ${i + 1}`}</span>
            </div>
          </React.Fragment>
        );
      })}
      {/* edge print on the green, running with the strip */}
      <div style={{position: 'absolute', left: 64, top: top0 - 200, width: 40, height: CLIPS.length * PITCH + 400, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: 'translate(30px, 0) rotate(90deg)', whiteSpace: 'nowrap', ...mono(20, SA)}}>
          {Array.from({length: 18}, () => 'sea, signora × villa prato  ·  cena a quattro mani  ·  13.11  ·  ').join('')}
        </div>
      </div>
      <div style={{position: 'absolute', left: 1016, top: top0 - 200, width: 40, height: CLIPS.length * PITCH + 400, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: 'translate(30px, 0) rotate(90deg)', whiteSpace: 'nowrap', ...mono(20, SA)}}>
          {Array.from({length: 40}, (_, k) => `${String(k + 1).padStart(2, '0')}A  ▸  `).join('')}
        </div>
      </div>
    </>
  );
};
const Title: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
    <div style={mono(22, SA)}>sea, signora × villa prato · 13.11</div>
    <div style={{fontFamily: fonts.display, fontSize: 124, lineHeight: 0.95, color: I, marginTop: 30}}><div>Cena a</div><div>Quattro Mani</div></div>
  </div>
);
const End: React.FC = () => (
  <AbsoluteFill style={{background: O, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
    <div style={{fontFamily: fonts.display, fontSize: 108, color: G, lineHeight: 1}}>Sea, Signora</div>
    <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 64, color: I, margin: '16px 0'}}>×</div>
    <div style={{fontFamily: fonts.display, fontSize: 108, color: G, lineHeight: 1}}>Villa Prato</div>
    <div style={{...mono(22, G), marginTop: 50}}>cena a quattro mani · 13.11</div>
  </AbsoluteFill>
);
export const VillaFilm: React.FC = () => (
  <AbsoluteFill style={{background: G, overflow: 'hidden'}}>
    <Audio src={staticFile('music/villa-hands.mp3')} volume={(fr) => interpolate(fr, [0, 3, FILM_FRAMES - 30, FILM_FRAMES], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    <Title />
    <Strip />
    <Sequence from={FILM_FRAMES - END}><End /></Sequence>
  </AbsoluteFill>
);
