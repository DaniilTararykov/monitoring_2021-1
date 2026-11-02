import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11. Two stories a day (three on Friday: the Holy Shell candle). Framed look (Arch / Window) on Mon, Wed, Fri,
// Sun; full-frame look (Full) on Tue, Thu, Sat (client 02.11: «every other day»), same clean language as «Vocabolario» (flat brand colour, one shape, little text, no black):
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
export const Media: React.FC<{photo?: string; shots?: Shot[]; fx: number; fy: number; zoom: number}> = ({photo, shots = [], fx, fy, zoom}) => {
  if (photo) return <Img src={staticFile(photo.includes('/') ? `photos/${photo}` : `photos/w6/${photo}`)} style={STYLE(fx, fy, zoom)} />;
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
export const setStill = (v: boolean) => { STILL = v; };
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
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: 4, textTransform: 'uppercase', marginTop: 14, lineHeight: 1.7, whiteSpace: 'pre-line', opacity: ease(f, 12)}}>{place}</div>
      </div>
    </AbsoluteFill>
  );
};

export type Slide = {photo: string; title: string; sub: string; fx?: number; fy?: number};
const SLIDE = (sec = 3.6) => Math.round(sec * FPS); // one photo of a «slides» story
export type WindowProps = Frame & {band: Bg; title?: string; sub?: string; kicker?: string; cta?: string; slides?: Slide[]; slideSec?: number};

export const Window: React.FC<WindowProps> = (props) => {
  const fr = useCurrentFrame();
  // «slides»: several photos one after another (hard cuts), each with its own title and line
  const k = props.slides ? Math.min(props.slides.length - 1, Math.floor(fr / SLIDE(props.slideSec))) : 0;
  const sl = props.slides?.[k];
  const f = sl ? fr - k * SLIDE(props.slideSec) : fr;
  const {band, shots, zoom = 1, kicker, cta} = props;
  const photo = sl ? sl.photo : props.photo;
  const fx = sl?.fx ?? props.fx ?? 50, fy = sl?.fy ?? props.fy ?? 50;
  const title = sl ? sl.title : props.title, sub = sl ? sl.sub : props.sub;
  const c = BG[band];
  const BAND = 560;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1920 - BAND, overflow: 'hidden'}}>
        <Media photo={photo} shots={shots} fx={fx} fy={fy} zoom={zoom} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1920 - BAND + 56, color: c.ink}}>
        {kicker ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: 5, textTransform: 'uppercase', color: c.accent, opacity: sl ? 1 : ease(f, 2)}}>{kicker}</div> : null}
        <div style={{fontFamily: fonts.display, fontSize: 72, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.02, marginTop: kicker ? 14 : 0,
          opacity: ease(f, 4), transform: `translateY(${(1 - ease(f, 4)) * 16}px)`}}>{title}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 36, marginTop: 14, whiteSpace: 'pre-line', opacity: ease(f, 10)}}>{sub}</div>
        {cta ? (
          <div style={{display: 'inline-flex', marginTop: 26, padding: '14px 26px', borderRadius: 18, background: c.accent, color: c.bg,
            fontFamily: fonts.mono, fontWeight: 500, fontSize: 26}}>{cta}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// «Full» — the other look, used every other day (client 02.11: not always the framed style): the photo or video fills the
// whole story, ivory text straight on it at the top (ceiling / background, away from faces and plates), a soft brand-green
// shade behind it only for legibility.
export type FullProps = Frame & {kicker?: string; title?: string; sub?: string; place?: string; cta?: string; slides?: Slide[]; slideSec?: number};

export const Full: React.FC<FullProps> = (props) => {
  const fr = useCurrentFrame();
  const k = props.slides ? Math.min(props.slides.length - 1, Math.floor(fr / SLIDE(props.slideSec))) : 0;
  const sl = props.slides?.[k];
  const f = sl ? fr - k * SLIDE(props.slideSec) : fr;
  const {shots, zoom = 1, kicker, place, cta} = props;
  const photo = sl ? sl.photo : props.photo;
  const fx = sl?.fx ?? props.fx ?? 50, fy = sl?.fy ?? props.fy ?? 50;
  const title = sl ? sl.title : props.title, sub = sl ? sl.sub : props.sub;
  const ink = colors.ivory;
  const shadow = '0 2px 18px rgba(12, 22, 13, 0.45)';
  return (
    <AbsoluteFill style={{background: brandPalette.green5605}}>
      <AbsoluteFill><Media photo={photo} shots={shots} fx={fx} fy={fy} zoom={zoom} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(27,47,28,0.7) 0%, rgba(27,47,28,0.45) 22%, rgba(27,47,28,0) 40%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: fonts.display, fontSize: 36, letterSpacing: 1, color: ink,
        textShadow: shadow}}>Sea, Signora</div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 330, textAlign: 'center', color: ink, textShadow: shadow}}>
        {kicker ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: 5, textTransform: 'uppercase', opacity: sl ? 0.9 : 0.9 * ease(f, 2)}}>{kicker}</div> : null}
        {title ? <div style={{fontFamily: fonts.display, fontSize: 76, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.02, whiteSpace: 'pre-line', marginTop: kicker ? 14 : 0,
          opacity: ease(f, 4), transform: `translateY(${(1 - ease(f, 4)) * 16}px)`}}>{title}</div> : null}
        {sub ? <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 38, marginTop: 12, whiteSpace: 'pre-line', opacity: ease(f, 10)}}>{sub}</div> : null}
        {place ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', marginTop: 18, opacity: 0.9 * ease(f, 14)}}>{place}</div> : null}
        {cta ? (
          <div style={{display: 'inline-flex', marginTop: 26, padding: '14px 26px', borderRadius: 18, background: colors.ivory, color: brandPalette.green5605,
            fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, textShadow: 'none'}}>{cta}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── the week 02–08.11 (14 stories: 9 videos of 11–12 s + 5 photos)
const sh = (clip: string, start: number, dur: number, rate?: number): Shot => ({clip, start, dur, rate});
const HOURS = '12:30—15:30 | 19:00—00:00';
const WEEK_HOURS = 'monday—friday 19:00—00:00\nsaturday—sunday 12:30—15:30 | 19:00—00:00';
type Item = {id: string; kind: 'a'; p: ArchProps} | {id: string; kind: 'w'; p: WindowProps} | {id: string; kind: 'f'; p: FullProps};
export const WEEK6: Item[] = [
  {id: 'W6-1mon-1v-full-room', kind: 'a', p: {bg: 'green', kicker: 'tonight in brera', line: 'a full room, every night', place: 'via fiori chiari 32',
    shots: [sh('c_r7c6', 0.5, 4), sh('c_r6c13', 1, 4), sh('c_r1c8', 0.5, 4)]}},
  {id: 'W6-1mon-2p-this-morning', kind: 'w', p: {band: 'white', photo: 'fish.jpg', fy: 45, title: 'Fresh catch of the day', sub: 'on your plate tonight'}},
  {id: 'W6-2tue-1v-your-table', kind: 'f', p: {kicker: 'tuesday', title: 'Your table', sub: 'our favourite view',
    shots: [sh('c_r4c9', 1, 6), sh('c_r9c4', 5, 6)]}},
  {id: 'W6-2tue-2p-wine', kind: 'f', p: {photo: 'bn_wine.jpg', fy: 45, title: 'A glass of white', sub: 'poured at your table'}},
  {id: 'W6-3wed-1v-open-kitchen', kind: 'a', p: {bg: 'white', kicker: 'open kitchen', line: 'dinner, cooked in front of you', place: WEEK_HOURS,
    shots: [sh('d1_r6c8', 1, 4), sh('d1_r6c7', 2, 4), sh('d1_r7c10', 0.5, 4)]}},
  {id: 'W6-3wed-2p-polpo', kind: 'w', p: {band: 'orange', photo: 'bn_polpo2.jpg', fy: 50, kicker: 'new on the menu', title: 'Polpo', sub: 'zucca, nocciole e scorzanera'}},
  {id: 'W6-4thu-1v-one-week', kind: 'f', p: {kicker: '12 november · our first birthday', title: 'One week to go', sub: 'dj, welcome drinks and the tuna show',
    shots: [sh('c_r8c7', 1, 4), sh('c_r10c6', 1, 4), sh('c_r3c14', 6, 4)]}},
  {id: 'W6-4thu-2v-new-on-the-menu', kind: 'f', p: {kicker: 'new on the menu', slideSec: 5, slides: [
    {photo: 'bn_akami.jpg', fy: 55, title: 'Akami', sub: 'culatello e porcini'},
    {photo: 'bn_scampo.jpg', fy: 55, title: 'Scampo', sub: 'lardo di Colonnata, royale di foie gras\ne trombette dei morti'}]}},
  {id: 'W6-5fri-1v-flambe', kind: 'a', p: {bg: 'orange', kicker: 'table service', line: 'flambé, right at your table', place: 'via fiori chiari 32 · brera',
    shots: [sh('d2_r5c13', 2.5, 4), sh('d2_r5c13', 16.5, 7.5)]}},
  {id: 'W6-5fri-2p-new-cocktails', kind: 'w', p: {band: 'green', photo: 'bn_cocktails.jpg', fy: 55, kicker: 'the bar', title: 'New cocktails', sub: 'come and try the new list'}},
  {id: 'W6-5fri-3p-holy-shell', kind: 'w', p: {band: 'white', photo: 'bn_candle.jpg', fy: 70, kicker: 'the candle cluub × sea, signora', title: 'Holy Shell',
    sub: 'our limited edition candle\nmarine and earthy', cta: 'shop the candle'}},
  {id: 'W6-6sat-1v-on-ice', kind: 'f', p: {kicker: 'our grill', title: 'Choose from the ice', sub: 'we take it to the grill', place: 'saturday 12:30—15:30 | 19:00—00:00',
    shots: [sh('c_r3c11', 0.2, 4.2), sh('c_r4c11', 0.3, 4), sh('c_r4c11', 13.5, 4.5)]}},
  {id: 'W6-6sat-2p-tagliolini', kind: 'f', p: {photo: 'bn_tagliolini.jpg', fy: 45, kicker: 'new on the menu', title: 'Tagliolini', sub: 'calamari e finferli', cta: 'book a table'}},
  {id: 'W6-7sun-1v-the-signora', kind: 'a', p: {bg: 'green', kicker: 'sunday', line: 'she has seen every night of the year', place: HOURS,
    shots: [sh('w6_v15', 0.4, 4.6), sh('c_r6c12', 4, 4), sh('c_r6c14', 1, 4)]}},
  {id: 'W6-7sun-2v-save-the-date', kind: 'w', p: {band: 'white', kicker: 'save the date', title: '12 November', sub: 'our first birthday · from 19:00\ndj, welcome drinks and the tuna show',
    shots: [sh('c_r9c3', 2, 6), sh('w6_lj', 0.4, 5.6)]}},
];
const frames = (it: Item) => it.p.photo ? 1 : 'slides' in it.p && it.p.slides ? it.p.slides.length * SLIDE(it.p.slideSec) : (it.p.shots ?? []).reduce((s, x) => s + shotFrames(x), 0);
export const WEEK6_COMPONENTS = WEEK6.map((it) => ({id: it.id, frames: frames(it),
  component: () => { STILL = !!it.p.photo; return it.kind === 'a' ? <Arch {...it.p} /> : it.kind === 'f' ? <Full {...it.p} /> : <Window {...it.p} />; }}));
