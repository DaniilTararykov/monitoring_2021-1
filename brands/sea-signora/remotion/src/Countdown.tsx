import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11: ten days to the first birthday (12.11). Two stories a day, same clean language as «Vocabolario»
// (flat brand colour, one shape, little text, no black):
//  · Countdown — «12 november · our first birthday» + days to go (small, no big number), one moment in an arch.
//  · Window    — a moment of the restaurant today, full frame, with one flat brand-colour band at the bottom.
// All footage from the Drive folder «Lisa & Danik», not used before. Silent; one link chip, on Saturday.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};
const FPS = 30;
const vid = (n: string) => staticFile(`videos/w6/${n}.mp4`);
// a clip (videos/w6/<name>.mp4) or, with a «.jpg» name, a photo (photos/w6/<name>)
const Media: React.FC<{clip: string; start: number; rate: number; fx: number; fy: number; zoom: number}> = ({clip, start, rate, fx, fy, zoom}) => {
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`,
    transformOrigin: `${fx}% ${fy}%`, filter: 'contrast(1.08) saturate(1.15)'};
  return clip.endsWith('.jpg')
    ? <Img src={staticFile(`photos/w6/${clip}`)} style={style} />
    : <OffthreadVideo src={vid(clip)} startFrom={Math.round(start * FPS)} playbackRate={rate} muted style={style} />;
};
let STILL = false; // photo stories are rendered as one frame: no build-in
const ease = (f: number, a: number, len = 10) => STILL ? 1 : interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export type CountdownProps = {days: number; bg: Bg; clip: string; start?: number; rate?: number; fx?: number; fy?: number; zoom?: number; line: string; place: string};

export const Countdown: React.FC<CountdownProps> = ({days, bg, clip, start = 0, rate = 1, fx = 50, fy = 50, zoom = 1, line, place}) => {
  const f = useCurrentFrame();
  const c = BG[bg];
  const AW = 660, AH = 860, AX = 540 - AW / 2, AY = 560;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 36, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', marginTop: 14, color: c.accent}}>
          12 november · our first birthday
        </div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', marginTop: 10, opacity: 0.75}}>
          {days} days to go
        </div>
      </div>
      <div style={{position: 'absolute', left: AX, top: AY, width: AW, height: AH, overflow: 'hidden', borderRadius: `${AW / 2}px ${AW / 2}px 0 0`}}>
        <Media clip={clip} start={start} rate={rate} fx={fx} fy={fy} zoom={zoom} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: AY + AH + 64, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, opacity: ease(f, 6)}}>{line}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: 4, textTransform: 'uppercase', marginTop: 14, opacity: ease(f, 12)}}>{place}</div>
      </div>
    </AbsoluteFill>
  );
};

export type WindowProps = {band: Bg; clip: string; start?: number; rate?: number; fx?: number; fy?: number; zoom?: number; title: string; sub: string; kicker?: string;
  cta?: string};

export const Window: React.FC<WindowProps> = ({band, clip, start = 0, rate = 1, fx = 50, fy = 50, zoom = 1, title, sub, kicker, cta}) => {
  const f = useCurrentFrame();
  const c = BG[band];
  const BAND = 560;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1920 - BAND, overflow: 'hidden'}}>
        <Media clip={clip} start={start} rate={rate} fx={fx} fy={fy} zoom={zoom} />
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

// ───────────────────────── the week 02–08.11 (14 stories)
const S6 = (sec: number) => Math.round(sec * FPS);
type Item = {id: string; frames: number} & ({kind: 'c'; p: CountdownProps} | {kind: 'w'; p: WindowProps});
export const WEEK6: Item[] = [
  {id: 'W6-1mon-1v-ten', frames: S6(4.5), kind: 'c', p: {days: 10, bg: 'green', clip: 'w6_lh', line: 'a full room, every night', place: 'via fiori chiari 32 · brera'}},
  {id: 'W6-1mon-2p-this-morning', frames: 1, kind: 'w', p: {band: 'white', clip: 'fish.jpg', fy: 45, kicker: 'this morning', title: 'Fresh from the market', sub: 'on your plate tonight'}},
  {id: 'W6-2tue-1v-nine', frames: S6(6), kind: 'c', p: {days: 9, bg: 'orange', clip: 'w6_la', line: 'your table, our favourite view', place: 'every night from 19:00'}},
  {id: 'W6-2tue-2p-raw-scallop', frames: 1, kind: 'w', p: {band: 'green', clip: 'scallops.jpg', fy: 40, kicker: 'raw bar', title: 'Raw scallop', sub: 'before the yuzu koshu and sour cherries'}},
  {id: 'W6-3wed-1v-eight', frames: S6(4.4), kind: 'c', p: {days: 8, bg: 'white', clip: 'w6_lc', line: 'oysters of the day, opened on the spot', place: 'from our aquariums'}},
  {id: 'W6-3wed-2v-the-last-drop', frames: S6(4.7), kind: 'w', p: {band: 'orange', clip: 'w6_lg', kicker: 'in the kitchen', title: 'The last drop', sub: 'olive oil, just before it leaves the pass'}},
  {id: 'W6-4thu-1v-seven', frames: S6(6), kind: 'c', p: {days: 7, bg: 'green', clip: 'w6_li', line: 'every plate, finished by hand', place: 'open kitchen'}},
  {id: 'W6-4thu-2p-crab-toast', frames: 1, kind: 'w', p: {band: 'white', clip: 'toast.jpg', fy: 45, kicker: 'antipasti', title: 'King crab toast', sub: 'stracciatella and tomato'}},
  {id: 'W6-5fri-1v-six', frames: S6(6), kind: 'c', p: {days: 6, bg: 'orange', clip: 'w6_ld', line: 'friday starts at the bar', place: 'cocktails with a story'}},
  {id: 'W6-5fri-2p-tech-mango', frames: 1, kind: 'w', p: {band: 'green', clip: 'cocktail.jpg', fx: 40, fy: 45, kicker: 'from our bar book', title: 'Tech-Mango', sub: 'tequila, mango and a spicy kick'}},
  {id: 'W6-6sat-1v-five', frames: S6(5.8), kind: 'c', p: {days: 5, bg: 'white', clip: 'w6_le', line: 'gelato & sorbets for saturday', place: '12:30—15:30 & 19:00—00:00'}},
  {id: 'W6-6sat-2p-mussels', frames: 1, kind: 'w', p: {band: 'orange', clip: 'mussels.jpg', fy: 45, kicker: 'main courses', title: 'Sautéed mussels', sub: "with leek and 'nduja", cta: 'book a table'}},
  {id: 'W6-7sun-1v-four', frames: S6(4.9), kind: 'c', p: {days: 4, bg: 'green', clip: 'w6_v15', line: 'she has seen every night of the year', place: 'see you on 12.11'}},
  {id: 'W6-7sun-2v-save-the-date', frames: S6(6), kind: 'w', p: {band: 'white', clip: 'w6_lj', kicker: 'save the date', title: '12 November', sub: 'our first birthday · come celebrate with us'}},
];
export const WEEK6_COMPONENTS = WEEK6.map((it) => ({id: it.id, frames: it.frames,
  component: () => { STILL = it.frames === 1; return it.kind === 'c' ? <Countdown {...it.p} /> : <Window {...it.p} />; }}));
