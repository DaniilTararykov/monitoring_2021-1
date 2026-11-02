import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';
import {Full, FullProps, Shot, setStill} from './Countdown';

loadBrandFonts();

// Week 02–08.11, remade from scratch (client 02.11: «absolutely new ideas, nothing already used»).
// New formats only — postcard, tall window, film strip, ticket, rules, porthole, programme — on flat brand colour
// (Mon, Wed, Fri, Sun), and full-frame stories (Tue, Thu, Sat). No polls (client). Material: the Blackout Night shoot
// (photos never used) and LIFE CONTENT clips never used, nothing from the evening of 01.08.
// Birthday (12.11) only on Thu and Sun; link chips only on Wed and Sat.

const FPS = 30;
const G = brandPalette.green5605, O = brandPalette.orange158, I = colors.ivory;
const ph = (n: string) => staticFile(`photos/n6/${n}.jpg`);
const cover = (fx = 50, fy = 50): React.CSSProperties => ({width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`,
  filter: 'contrast(1.06) saturate(1.1)'});
const Wordmark: React.FC<{color: string; top?: number}> = ({color, top = 262}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: fonts.display, fontSize: 36, letterSpacing: 1, color}}>Sea, Signora</div>
);
const mono = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.mono, fontWeight: 500, fontSize: size,
  letterSpacing: size > 24 ? 3 : 5, textTransform: 'uppercase', color, ...extra});
const display = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.display, fontSize: size,
  textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.04, color, ...extra});
const italic = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: fonts.serif, fontStyle: 'italic', fontSize: size,
  lineHeight: 1.3, color, whiteSpace: 'pre-line', ...extra});

// ── Postcard: the photo on an ivory card, a thin postmark over its corner
type PostcardProps = {bg: string; photo: string; fx?: number; fy?: number; title: string; sub: string; place: string};
const Postcard: React.FC<PostcardProps> = ({bg, photo, fx, fy, title, sub, place}) => (
  <AbsoluteFill style={{background: bg}}>
    <Wordmark color={I} />
    <div style={{position: 'absolute', left: 90, right: 90, top: 400, height: 1120, background: I, borderRadius: 10, padding: 30}}>
      <div style={{height: 720, overflow: 'hidden', borderRadius: 4}}><Img src={ph(photo)} style={cover(fx, fy)} /></div>
      <div style={{position: 'absolute', right: 56, top: 56, width: 176, height: 176, borderRadius: '50%', border: `3px solid ${I}`, transform: 'rotate(-12deg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
        <div style={mono(16, I)}>Brera</div>
        <div style={{width: 110, height: 2, background: I}} />
        <div style={mono(16, I)}>Milano</div>
      </div>
      <div style={{padding: '40px 14px 0', color: G}}>
        <div style={display(62, G)}>{title}</div>
        <div style={italic(36, G, {marginTop: 12})}>{sub}</div>
        <div style={mono(17, O, {marginTop: 22})}>{place}</div>
      </div>
    </div>
  </AbsoluteFill>
);

// ── Tall window: one photo in a tall rounded window
type TallProps = {bg: string; photo: string; fx?: number; fy?: number; kicker: string; title: string; sub: string};
const Tall: React.FC<TallProps> = ({bg, photo, fx, fy, kicker, title, sub}) => (
  <AbsoluteFill style={{background: bg}}>
    <Wordmark color={I} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 316, textAlign: 'center', ...mono(20, O)}}>{kicker}</div>
    <div style={{position: 'absolute', left: 230, width: 620, top: 400, height: 900, borderRadius: 310, overflow: 'hidden'}}><Img src={ph(photo)} style={cover(fx, fy)} /></div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1350, textAlign: 'center'}}>
      <div style={display(64, I)}>{title}</div>
      <div style={italic(36, I, {marginTop: 12})}>{sub}</div>
    </div>
  </AbsoluteFill>
);

// ── Film strip: three frames of one evening, one under the other
type StripProps = {bg: string; title: string; frames: {photo: string; fx?: number; fy?: number; label: string}[]};
const Strip: React.FC<StripProps> = ({bg, title, frames}) => (
  <AbsoluteFill style={{background: bg}}>
    <Wordmark color={I} />
    <div style={{position: 'absolute', left: 80, right: 80, top: 330, textAlign: 'center', ...display(54, I)}}>{title}</div>
    {frames.map((fr, i) => (
      <div key={i} style={{position: 'absolute', left: 110, right: 110, top: 440 + i * 360, height: 360}}>
        <div style={{height: 300, overflow: 'hidden', borderRadius: 6}}><Img src={ph(fr.photo)} style={cover(fr.fx, fr.fy)} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
          <div style={mono(16, O)}>{`0${i + 1}`}</div>
          <div style={italic(26, I)}>{fr.label}</div>
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

// ── Ticket: a reservation ticket, photo on top, perforation, the details and the chip
type TicketProps = {bg: string; photo: string; fx?: number; fy?: number; kicker: string; title: string; rows: string[]; cta: string};
const Ticket: React.FC<TicketProps> = ({bg, photo, fx, fy, kicker, title, rows, cta}) => {
  const TOP = 400, H = 1130, CUT = 620; // card top, height, perforation (from card top)
  return (
    <AbsoluteFill style={{background: bg}}>
      <Wordmark color={G} />
      <div style={{position: 'absolute', left: 110, right: 110, top: TOP, height: H, background: I, borderRadius: 26, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 28, right: 28, top: 28, height: CUT - 56, overflow: 'hidden', borderRadius: 14}}><Img src={ph(photo)} style={cover(fx, fy)} /></div>
        <div style={{position: 'absolute', left: 46, right: 46, top: CUT, borderTop: `3px dashed ${G}`, opacity: 0.35}} />
        <div style={{position: 'absolute', left: 50, right: 50, top: CUT + 50}}>
          <div style={mono(17, O)}>{kicker}</div>
          <div style={display(66, G, {marginTop: 12})}>{title}</div>
          {rows.map((r, i) => <div key={i} style={mono(21, G, {marginTop: i ? 12 : 26})}>{r}</div>)}
          <div style={{display: 'inline-flex', marginTop: 34, padding: '14px 26px', borderRadius: 18, background: G, color: I, ...mono(26, I, {letterSpacing: 0,
            textTransform: 'none'})}}>{cta}</div>
        </div>
      </div>
      {/* the two notches of the perforation */}
      {[110 - 30, 1080 - 110 - 30].map((x) => <div key={x} style={{position: 'absolute', left: x, top: TOP + CUT - 30, width: 60, height: 60, borderRadius: 30, background: bg}} />)}
    </AbsoluteFill>
  );
};

// ── Rules: a short numbered list, type only
type RulesProps = {bg: string; title: string; items: string[]; foot: string};
const Rules: React.FC<RulesProps> = ({bg, title, items, foot}) => (
  <AbsoluteFill style={{background: bg}}>
    <Wordmark color={G} />
    <div style={{position: 'absolute', left: 100, right: 100, top: 520}}>
      <div style={display(96, G)}>{title}</div>
      {items.map((it, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 30, marginTop: i ? 52 : 90, paddingTop: i ? 52 : 0, borderTop: i ? `2px solid rgba(27,47,28,0.25)` : 'none'}}>
          <div style={mono(30, I)}>{`0${i + 1}`}</div>
          <div style={italic(48, G)}>{it}</div>
        </div>
      ))}
      <div style={mono(18, G, {marginTop: 90})}>{foot}</div>
    </div>
  </AbsoluteFill>
);

// ── Porthole: a round window with a thick ivory ring
type PortholeProps = {bg: string; photo: string; fx?: number; fy?: number; title: string; sub: string};
const Porthole: React.FC<PortholeProps> = ({bg, photo, fx, fy, title, sub}) => {
  const D = 760, CY = 860;
  return (
    <AbsoluteFill style={{background: bg}}>
      <Wordmark color={I} />
      <div style={{position: 'absolute', left: 540 - D / 2 - 22, top: CY - D / 2 - 22, width: D + 44, height: D + 44, borderRadius: '50%', border: `14px solid ${I}`,
        boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: 540 - D / 2, top: CY - D / 2, width: D, height: D, borderRadius: '50%', overflow: 'hidden'}}><Img src={ph(photo)} style={cover(fx, fy)} /></div>
      <div style={{position: 'absolute', left: 80, right: 80, top: CY + D / 2 + 90, textAlign: 'center'}}>
        <div style={display(62, I)}>{title}</div>
        <div style={italic(36, I, {marginTop: 12})}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Programme: the evening of 12.11 as a timeline (room left at the bottom for Instagram's own countdown sticker)
type ProgProps = {bg: string; kicker: string; title: string; rows: [string, string][]; foot: string};
const Programme: React.FC<ProgProps> = ({bg, kicker, title, rows, foot}) => (
  <AbsoluteFill style={{background: bg}}>
    <Wordmark color={I} />
    <div style={{position: 'absolute', left: 100, right: 100, top: 430}}>
      <div style={mono(22, O)}>{kicker}</div>
      <div style={display(78, I, {marginTop: 16})}>{title}</div>
      {rows.map(([t, what], i) => (
        <div key={i} style={{display: 'flex', gap: 36, alignItems: 'baseline', marginTop: i ? 34 : 70, paddingTop: 34, borderTop: '2px solid rgba(248,246,245,0.22)'}}>
          <div style={mono(30, O, {minWidth: 120})}>{t}</div>
          <div style={italic(42, I)}>{what}</div>
        </div>
      ))}
      <div style={italic(34, I, {marginTop: 60, opacity: 0.85})}>{foot}</div>
    </div>
  </AbsoluteFill>
);

// ───────────────────────── the week
const sh = (clip: string, start: number, dur: number): Shot => ({clip, start, dur});
const shotFrames = (s: Shot) => Math.round(s.dur * FPS);
type Item = {id: string} & ({kind: 'postcard'; p: PostcardProps} | {kind: 'tall'; p: TallProps} | {kind: 'strip'; p: StripProps} | {kind: 'ticket'; p: TicketProps}
  | {kind: 'rules'; p: RulesProps} | {kind: 'porthole'; p: PortholeProps} | {kind: 'prog'; p: ProgProps} | {kind: 'full'; p: FullProps});

export const NEWWEEK: Item[] = [
  {id: 'N6-1mon-1p-postcard', kind: 'postcard', p: {bg: O, photo: '000', fy: 55, title: 'Greetings from Brera', sub: 'open tonight from 19:00', place: 'via fiori chiari 32 · milano'}},
  {id: 'N6-1mon-2p-slowly', kind: 'tall', p: {bg: G, photo: '436', fy: 45, kicker: 'monday', title: 'Monday, slowly', sub: 'a glass, a candle\nand nowhere else to be'}},
  {id: 'N6-2tue-1v-first-order', kind: 'full', p: {kicker: 'tuesday · 19:00', title: 'The first order', shots: [sh('d1_r7c8', 0.5, 4), sh('d1_r6c5', 1, 4), sh('d1_r8c14', 3, 4)]}},
  {id: 'N6-2tue-2p-neighbours', kind: 'full', p: {photo: 'n6/150.jpg', fx: 45, title: 'Meet the neighbours', sub: "they live in our aquarium\nand they're not on the menu"}},
  {id: 'N6-3wed-1p-three-frames', kind: 'strip', p: {bg: G, title: 'One evening, three frames', frames: [
    {photo: '098', fy: 30, label: 'the candles'}, {photo: '087', fy: 64, label: 'the first pour'}, {photo: '210', fy: 40, label: 'cin cin'}]}},
  {id: 'N6-3wed-2p-ticket', kind: 'ticket', p: {bg: O, photo: '401', fy: 40, kicker: 'reservation', title: 'Table for two',
    rows: ['wednesday · 20:30', 'via fiori chiari 32 · brera'], cta: 'book a table'}},
  {id: 'N6-4thu-1v-one-year', kind: 'full', p: {kicker: '12 november', title: 'One year of\nSea, Signora', sub: '19:00 dj & welcome drinks\n19:30 the tuna show',
    shots: [sh('c_r6c11', 3, 6), sh('c_r8c3', 3, 6)]}},
  {id: 'N6-4thu-2v-at-the-bar', kind: 'full', p: {kicker: 'at the bar', slides: [
    {photo: 'n6/282.jpg', fx: 55, title: 'Shaken', sub: ''}, {photo: 'n6/286.jpg', title: 'Garnished', sub: ''}, {photo: 'n6/290.jpg', fx: 40, title: 'Poured', sub: ''}]}},
  {id: 'N6-5fri-1p-friday-rules', kind: 'rules', p: {bg: O, title: 'Friday rules', items: ['book a table', 'start with the oysters', 'stay for one more glass'],
    foot: 'via fiori chiari 32 · from 19:00'}},
  {id: 'N6-5fri-2p-porthole', kind: 'porthole', p: {bg: G, photo: '042', fx: 50, title: 'Friday by the aquarium', sub: 'from 19:00'}},
  {id: 'N6-6sat-1v-saturday-night', kind: 'full', p: {kicker: 'saturday night', slides: [
    {photo: 'n6/153.jpg', fx: 55, title: 'At Sea, Signora', sub: ''}, {photo: 'n6/404.jpg', title: 'At Sea, Signora', sub: ''}, {photo: 'n6/413.jpg', title: 'At Sea, Signora', sub: ''}]}},
  {id: 'N6-6sat-2p-cin-cin', kind: 'full', p: {photo: 'n6/211.jpg', fx: 50, title: 'Cin cin', sub: 'to the weekend', cta: 'book a table'}},
  {id: 'N6-7sun-1p-programme', kind: 'prog', p: {bg: G, kicker: '12.11 · our first birthday', title: 'The evening', rows: [
    ['19:00', 'aperitivo, welcome bites\n& drinks, dj'], ['19:30', 'the tuna show'], ['22:00', 'the cake']], foot: 'welcome and cake on us'}},
  {id: 'N6-7sun-2p-see-you', kind: 'postcard', p: {bg: G, photo: '003', fx: 50, title: 'See you next week', sub: 'sunday 12:30—15:30 | 19:00—00:00', place: 'via fiori chiari 32 · brera'}},
];

const frames = (it: Item) => {
  if (it.kind !== 'full') return 1;
  if (it.p.slides) return it.p.slides.length * Math.round((it.p.slideSec ?? 3.6) * FPS);
  return it.p.shots ? it.p.shots.reduce((s, x) => s + shotFrames(x), 0) : 1;
};
const render = (it: Item) => {
  switch (it.kind) {
    case 'postcard': return <Postcard {...it.p} />;
    case 'tall': return <Tall {...it.p} />;
    case 'strip': return <Strip {...it.p} />;
    case 'ticket': return <Ticket {...it.p} />;
    case 'rules': return <Rules {...it.p} />;
    case 'porthole': return <Porthole {...it.p} />;
    case 'prog': return <Programme {...it.p} />;
    case 'full': return <Full {...it.p} />;
  }
};
export const NEWWEEK_COMPONENTS = NEWWEEK.map((it) => ({id: it.id, frames: frames(it), component: () => { setStill(frames(it) === 1); return render(it); }}));
