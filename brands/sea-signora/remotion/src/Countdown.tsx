import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11. Two stories a day, same clean language as «Vocabolario» (flat brand colour, one shape, little text, no black):
//  · Arch   — 2–3 calm shots of the restaurant in an arch, a kicker on top, one line under it.
//  · Window — full frame, with one flat brand-colour band at the bottom.
// Client 01.11: no big numbers; the birthday (12.11) only twice in the week (Thu «one week to go», Sun save the date);
// room shots only where the room is full (no empty tables); video stories 10–15 s. Dish texts checked against the menu.
// Footage: LIFE CONTENT, not used before (no Lago, no events). Silent; one link chip, on Saturday.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};
const FPS = 30;
export type Shot = {clip: string; start: number; dur: number; rate?: number};
const shotFrames = (sh: Shot) => Math.round((sh.dur / (sh.rate ?? 1)) * FPS);
const STYLE = (fx: number, fy: number, zoom: number): React.CSSProperties => ({width: '100%', height: '100%', objectFit: 'cover',
  objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%`, filter: 'contrast(1.08) saturate(1.15)'});
// a photo (photos/w6/<name>.jpg) or a sequence of video shots (videos/w7/<clip>.mp4), hard cuts
const Media: React.FC<{photo?: string; shots?: Shot[]; fx: number; fy: number; zoom: number}> = ({photo, shots = [], fx, fy, zoom}) => {
  if (photo) return <Img src={staticFile(`photos/w6/${photo}`)} style={STYLE(fx, fy, zoom)} />;
  let at = 0;
  return (
    <>
      {shots.map((sh, i) => {
        const from = at; at += shotFrames(sh);
        return (
          <Sequence key={i} from={from} durationInFrames={shotFrames(sh)}>
            <OffthreadVideo src={staticFile(`videos/w7/${sh.clip}.mp4`)} startFrom={Math.round(sh.start * FPS)} playbackRate={sh.rate ?? 1} muted
              style={STYLE(fx, fy, zoom)} />
          </Sequence>
        );
      })}
    </>
  );
};
let STILL = false; // photo stories are rendered as one frame: no build-in
const ease = (f: number, a: number, len = 10) => STILL ? 1 : interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

type Frame = {photo?: string; shots?: Shot[]; fx?: number; fy?: number; zoom?: number};
export type ArchProps = Frame & {bg: Bg; kicker: string; line: string; place: string};

export const Arch: React.FC<ArchProps> = ({bg, photo, shots, fx = 50, fy = 50, zoom = 1, kicker, line, place}) => {
  const f = useCurrentFrame();
  const c = BG[bg];
  const AW = 660, AH = 860, AX = 540 - AW / 2, AY = 540;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 36, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', marginTop: 14, color: c.accent}}>{kicker}</div>
      </div>
      <div style={{position: 'absolute', left: AX, top: AY, width: AW, height: AH, overflow: 'hidden', borderRadius: `${AW / 2}px ${AW / 2}px 0 0`}}>
        <Media photo={photo} shots={shots} fx={fx} fy={fy} zoom={zoom} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: AY + AH + 64, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, opacity: ease(f, 6)}}>{line}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: 4, textTransform: 'uppercase', marginTop: 14, opacity: ease(f, 12)}}>{place}</div>
      </div>
    </AbsoluteFill>
  );
};

export type WindowProps = Frame & {band: Bg; title: string; sub: string; kicker?: string; cta?: string};

export const Window: React.FC<WindowProps> = ({band, photo, shots, fx = 50, fy = 50, zoom = 1, title, sub, kicker, cta}) => {
  const f = useCurrentFrame();
  const c = BG[band];
  const BAND = 560;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1920 - BAND, overflow: 'hidden'}}>
        <Media photo={photo} shots={shots} fx={fx} fy={fy} zoom={zoom} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1920 - BAND + 56, color: c.ink}}>
        {kicker ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: 5, textTransform: 'uppercase', color: c.accent, opacity: ease(f, 2)}}>{kicker}</div> : null}
        <div style={{fontFamily: fonts.display, fontSize: 72, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.02, marginTop: kicker ? 14 : 0,
          opacity: ease(f, 4), transform: `translateY(${(1 - ease(f, 4)) * 16}px)`}}>{title}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 36, marginTop: 14, opacity: ease(f, 10)}}>{sub}</div>
        {cta ? (
          <div style={{display: 'inline-flex', marginTop: 26, padding: '14px 26px', borderRadius: 18, background: c.accent, color: c.bg,
            fontFamily: fonts.mono, fontWeight: 500, fontSize: 26}}>{cta}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── the week 02–08.11 (14 stories: 9 videos of 11–12 s + 5 photos)
const sh = (clip: string, start: number, dur: number, rate?: number): Shot => ({clip, start, dur, rate});
const HOURS = '12:30—15:30 & 19:00—00:00';
type Item = {id: string; kind: 'a'; p: ArchProps} | {id: string; kind: 'w'; p: WindowProps};
export const WEEK6: Item[] = [
  {id: 'W6-1mon-1v-full-room', kind: 'a', p: {bg: 'green', kicker: 'tonight in brera', line: 'a full room, every night', place: 'via fiori chiari 32',
    shots: [sh('c_r7c6', 0.5, 4), sh('c_r6c13', 1, 4), sh('c_r1c8', 0.5, 4)]}},
  {id: 'W6-1mon-2p-this-morning', kind: 'w', p: {band: 'white', photo: 'fish.jpg', fy: 45, title: 'Fresh catch of the day', sub: 'on your plate tonight'}},
  {id: 'W6-2tue-1v-your-table', kind: 'a', p: {bg: 'orange', kicker: 'tuesday', line: 'your table, our favourite view', place: 'every night from 19:00',
    shots: [sh('w6_la', 5.5, 6), sh('c_r7c12', 1, 5)]}},
  {id: 'W6-2tue-2p-raw-scallop', kind: 'w', p: {band: 'green', photo: 'scallops.jpg', fy: 40, kicker: 'raw bar', title: 'Raw scallop', sub: 'with yuzu koshu and fermented sour cherries'}},
  {id: 'W6-3wed-1v-open-kitchen', kind: 'a', p: {bg: 'white', kicker: 'open kitchen', line: 'dinner, cooked in front of you', place: 'every night from 19:00',
    shots: [sh('d1_r6c8', 1, 4), sh('d1_r6c7', 2, 4), sh('d1_r7c10', 0.5, 4)]}},
  {id: 'W6-3wed-2v-the-last-touch', kind: 'w', p: {band: 'orange', kicker: 'at the pass', title: 'The last touch', sub: 'every plate, finished by hand',
    shots: [sh('d1_r8c15', 2, 5), sh('d1_r9c7', 0.5, 3.5), sh('d1_r9c6', 1, 4)]}},
  {id: 'W6-4thu-1v-one-week', kind: 'a', p: {bg: 'green', kicker: '12 november · our first birthday', line: 'one week to go', place: 'via fiori chiari 32 · brera',
    shots: [sh('c_r8c7', 1, 4), sh('c_r10c6', 1, 4), sh('c_r3c14', 6, 4)]}},
  {id: 'W6-4thu-2p-crab-toast', kind: 'w', p: {band: 'white', photo: 'toast.jpg', fy: 45, kicker: 'appetizers', title: 'King crab toast', sub: 'stracciatella and tomato'}},
  {id: 'W6-5fri-1v-flambe', kind: 'a', p: {bg: 'orange', kicker: 'table service', line: 'flambé, right at your table', place: 'crêpes suzette',
    shots: [sh('d2_r5c13', 2.5, 4), sh('d2_r5c13', 16.5, 7.5)]}},
  {id: 'W6-5fri-2p-tech-mango', kind: 'w', p: {band: 'green', photo: 'cocktail.jpg', fx: 40, fy: 45, kicker: 'from our bar book', title: 'Tech-Mango', sub: 'tequila, mango and a spicy kick'}},
  {id: 'W6-6sat-1v-on-ice', kind: 'a', p: {bg: 'white', kicker: 'our grill', line: 'fresh on ice, straight to the grill', place: 'langoustine xxl · carabineros',
    shots: [sh('c_r3c11', 0.2, 4.2), sh('c_r4c11', 0.3, 4), sh('c_r4c11', 13.5, 4.5)]}},
  {id: 'W6-6sat-2p-mussels', kind: 'w', p: {band: 'orange', photo: 'mussels.jpg', fy: 45, kicker: 'main courses', title: 'Sautéed mussels', sub: "with leek and 'nduja", cta: 'book a table'}},
  {id: 'W6-7sun-1v-the-signora', kind: 'a', p: {bg: 'green', kicker: 'sunday', line: 'she has seen every night of the year', place: HOURS,
    shots: [sh('w6_v15', 0.4, 4.6), sh('c_r2c12', 4, 4), sh('c_r6c14', 1, 4)]}},
  {id: 'W6-7sun-2v-save-the-date', kind: 'w', p: {band: 'white', kicker: 'save the date', title: '12 November', sub: 'our first birthday · come celebrate with us',
    shots: [sh('c_r9c3', 2, 6), sh('w6_lj', 0.4, 5.6)]}},
];
const frames = (it: Item) => it.p.photo ? 1 : (it.p.shots ?? []).reduce((s, x) => s + shotFrames(x), 0);
export const WEEK6_COMPONENTS = WEEK6.map((it) => ({id: it.id, frames: frames(it),
  component: () => { STILL = !!it.p.photo; return it.kind === 'a' ? <Arch {...it.p} /> : <Window {...it.p} />; }}));
