import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';
import type {Cta} from './types';

loadBrandFonts();

// Week 16–22.11 v3 (client 16.11: «stories about the dishes, the atmosphere, the guests' vibe, the street; the review;
// Vocabolario was good — develop the themes, use the content»). Three kinds:
//  · Vocabolario, continued: 23 new Italian words (none repeated from week 26.10), each with live footage in a brand
//    shape on white / green / orange, reading, part of speech and one line of the brand's voice;
//  · Live: full-bleed lively footage (guests, kitchen, room) with a short, dry-humoured headline (the account's base);
//  · Review: the Google review, verbatim, ★★★★★ (client 16.11).
// Footage: steady windows picked by measured camera shift; no birthday recap, no candle.

const FPS = 30;
type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};
type Shape = 'arch' | 'circle' | 'pill' | 'rect' | 'oval';
const SHAPES: Record<Shape, {w: number; h: number; radius: string}> = {
  arch: {w: 780, h: 960, radius: '390px 390px 0 0'},
  circle: {w: 800, h: 800, radius: '50%'},
  pill: {w: 600, h: 960, radius: '300px'},
  rect: {w: 760, h: 940, radius: '0'},
  oval: {w: 720, h: 960, radius: '50%'},
};
const CY = 800;

type M = {src: string; at?: number; fx?: number; fy?: number; z?: number; rate?: number};
type Common = {id: string; day: string; sec: number; cta?: Cta; caption: string; hashtags: string[]};
export type Parola = Common & (
  | {k: 'word'; bg: Bg; shape: Shape; word: string; read: string; pos: string; def: string; m: M}
  | {k: 'live'; m: M[]; kicker?: string; title: string; sub?: string}
  | {k: 'review'; bg: Bg; m: M; text: string; by: string}
);

const isV = (m: M) => m.src.endsWith('.mp4');
const Media: React.FC<{m: M}> = ({m}) => {
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${m.fx ?? 50}% ${m.fy ?? 50}%`,
    transform: `scale(${m.z ?? 1})`, transformOrigin: `${m.fx ?? 50}% ${m.fy ?? 50}%`};
  return isV(m)
    ? <OffthreadVideo src={staticFile(`videos/${m.src}`)} startFrom={Math.round((m.at ?? 0) * FPS)} playbackRate={m.rate ?? 1} muted style={style} />
    : <Img src={staticFile(`photos/${m.src}`)} style={style} />;
};
const Head: React.FC<{ink: string; accent: string; label: string}> = ({ink, accent, label}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', color: ink}}>
    <div style={{fontFamily: fonts.display, fontSize: 36, letterSpacing: 1}}>Sea, Signora</div>
    <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 15, letterSpacing: 6, textTransform: 'uppercase', marginTop: 8, color: accent}}>{label}</div>
  </div>
);

export const ParolaView: React.FC<{p: Parola}> = ({p}) => {
  const frames = Math.round(p.sec * FPS);
  if (p.k === 'live') {
    const each = Math.floor(frames / p.m.length);
    return (
      <AbsoluteFill style={{background: '#0B0B0B'}}>
        {p.m.map((m, i) => (
          <Sequence key={i} from={i * each} durationInFrames={i === p.m.length - 1 ? frames - i * each : each}><Media m={m} /></Sequence>
        ))}
        <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.8) 0%, rgba(11,11,11,0) 36%)'}} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 270, textAlign: 'center', color: colors.ivory}}>
          {p.kicker ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: brandPalette.orange158}}>{p.kicker}</div> : null}
          <div style={{fontFamily: fonts.display, fontSize: p.title.length > 22 ? 64 : 80, textTransform: 'uppercase', lineHeight: 1.02, marginTop: 10, whiteSpace: 'pre-line'}}>{p.title}</div>
          {p.sub ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', marginTop: 14}}>{p.sub}</div> : null}
        </div>
        {p.cta ? <Chip cta={p.cta} /> : null}
      </AbsoluteFill>
    );
  }
  const c = BG[p.bg];
  if (p.k === 'review') {
    return (
      <AbsoluteFill style={{background: c.bg}}>
        <Head ink={c.ink} accent={c.accent} label="review" />
        <div style={{position: 'absolute', left: 190, top: 400, width: 700, height: 560, overflow: 'hidden', borderRadius: '350px 350px 0 0'}}><Media m={p.m} /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontSize: 46, letterSpacing: 10, color: colors.star}}>★★★★★</div>
        <div style={{position: 'absolute', left: 110, right: 110, top: 1100, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 25,
          letterSpacing: 1.5, lineHeight: 1.5, textTransform: 'uppercase', color: c.ink}}>{p.text}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 30, color: c.ink}}>{p.by}</div>
        {p.cta ? <Chip cta={p.cta} /> : null}
      </AbsoluteFill>
    );
  }
  const sh = SHAPES[p.shape];
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <Head ink={c.ink} accent={c.accent} label="vocabolario" />
      <div style={{position: 'absolute', left: 540 - sh.w / 2, top: CY - sh.h / 2 + 20, width: sh.w, height: sh.h, overflow: 'hidden', borderRadius: sh.radius}}>
        <Media m={p.m} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1330, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 66, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1}}>{p.word}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 30, marginTop: 12}}>{p.read} <span style={{color: c.accent}}>·</span> {p.pos}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 21, letterSpacing: 3, textTransform: 'uppercase', marginTop: 16}}>{p.def}</div>
      </div>
      {p.cta ? <Chip cta={{...p.cta, y: 1920 - (CY + sh.h / 2 + 20) + 40}} /> : null}
    </AbsoluteFill>
  );
};

export const parolaStill = (p: Parola) => p.k !== 'live' && !(p.k === 'word' ? isV(p.m) : isV(p.m));

// ───────────────────────────── the week
const v = (n: string, at: number, o: Partial<M> = {}): M => ({src: `w10/${n}.mp4`, at, ...o});
const ph = (n: string, o: Partial<M> = {}): M => ({src: `w10/${n}.jpg`, ...o});
const tags = (...t: string[]) => ['#seasignora', ...t];
const W = (id: string, day: string, bg: Bg, shape: Shape, word: string, read: string, pos: string, def: string, m: M, caption: string,
  hashtags: string[], cta?: Cta): Parola => ({k: 'word', id, day, sec: isV(m) ? 7 : 7, bg, shape, word, read, pos, def, m, caption, hashtags, cta});
const L = (id: string, day: string, m: M[], title: string, caption: string, hashtags: string[], o: {kicker?: string; sub?: string; cta?: Cta} = {}): Parola =>
  ({k: 'live', id, day, sec: 10, m, title, caption, hashtags, ...o});

export const PAROLE: Parola[] = [
  // ───── Lunedì 16.11
  W('P-1mon-1v-polpo', 'Mon 16.11', 'green', 'circle', 'Polpo', 'pòl·po', 'noun', 'built by hand, one tentacle at a time',
    v('nm0656', 4.3, {fy: 60}), 'Polpo: built by hand, one tentacle at a time. Zucca, nocciole e scorzanera.', tags('#polpo', '#vocabolario', '#brera')),
  W('P-1mon-2p-porta', 'Mon 16.11', 'white', 'arch', 'Porta', 'pòr·ta', 'noun', 'via fiori chiari 32, the one with the light on',
    ph('p0195', {fy: 45}), 'Porta: Via Fiori Chiari 32, the one with the light on.', tags('#brera', '#vocabolario', '#viafiorichiari')),
  L('P-1mon-3v-monday', 'Mon 16.11', [v('2626', 3.4), v('2620', 5.2)], 'Monday,\nnever heard of her',
    'Monday? Never heard of her. Open from 19:00.', tags('#monday', '#brera', '#milano'), {sub: 'open from 19:00'}),
  W('P-1mon-4v-chiacchiere', 'Mon 16.11', 'orange', 'oval', 'Chiacchiere', 'chiàc·chie·re', 'noun, plural', 'the sound of a full room',
    v('2633', 0.5, {rate: 0.7}), 'Chiacchiere: the sound of a full room.', tags('#vocabolario', '#atmosphere', '#brera')),

  // ───── Martedì 17.11
  W('P-2tue-1p-crudo', 'Tue 17.11', 'white', 'circle', 'Crudo', 'crù·do', 'adjective', 'red prawns, no fire needed',
    ph('k0122', {fy: 55}), 'Crudo: red prawns, no fire needed.', tags('#crudo', '#rawbar', '#vocabolario')),
  W('P-2tue-2v-padella', 'Tue 17.11', 'green', 'pill', 'Padella', 'pa·dèl·la', 'noun', 'tagliolini, calamari e finferli, straight from it',
    v('nm0676', 8.5, {fy: 55}), 'Padella: tagliolini, calamari e finferli, straight from the pan.', tags('#pasta', '#tagliolini', '#vocabolario')),
  {k: 'review', id: 'P-2tue-3p-review', day: 'Tue 17.11', sec: 7, bg: 'white', m: ph('p0213', {fy: 50}),
    text: 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.',
    by: '— a guest, on Google', caption: 'Thank you for the kind words. See you again soon.', hashtags: tags('#review', '#brera', '#milano')},
  L('P-2tue-4v-nobody-walks', 'Tue 17.11', [v('nm0671', 15.7), v('nm0632', 4.6)], 'In our kitchen,\nnobody walks',
    'In our kitchen, nobody walks.', tags('#openkitchen', '#chef', '#brera'), {kicker: 'open kitchen'}),

  // ───── Mercoledì 18.11
  W('P-3wed-1v-tonno', 'Wed 18.11', 'orange', 'rect', 'Tonno', 'tón·no', 'noun', 'akami, culatello e porcini',
    v('nm0636', 2.0, {fy: 60}), 'Tonno: akami, culatello e porcini.', tags('#tuna', '#akami', '#vocabolario')),
  W('P-3wed-2p-acquario', 'Wed 18.11', 'green', 'circle', 'Acquario', 'ac·quà·rio', 'noun', 'our quietest regulars live here',
    ph('bo151', {fx: 45, fy: 45}), 'Acquario: our quietest regulars live here.', tags('#aquarium', '#vocabolario', '#brera')),
  W('P-3wed-3p-pioggia', 'Wed 18.11', 'white', 'pill', 'Pioggia', 'piòg·gia', 'noun', 'the best excuse to stay for dessert',
    ph('p0194', {fy: 50}), 'Pioggia: the best excuse to stay for dessert.', tags('#rainyday', '#vocabolario', '#brera')),
  L('P-3wed-4v-long-tables', 'Wed 18.11', [v('2698', 4.1), v('2684', 0.2)], 'Long tables,\nlouder laughs',
    'Long tables, louder laughs.', tags('#friends', '#dinner', '#brera')),

  // ───── Giovedì 19.11
  W('P-4thu-1p-brindisi', 'Thu 19.11', 'orange', 'oval', 'Brindisi', 'brìn·di·si', 'noun', 'the moment before the first sip',
    ph('bo422', {fy: 45}), 'Brindisi: the moment before the first sip.', tags('#cincin', '#cocktails', '#vocabolario'), {label: 'reserve', color: 'white'}),
  W('P-4thu-2v-capesante', 'Thu 19.11', 'white', 'rect', 'Capesante', 'ca·pe·sàn·te', 'noun, plural', 'with black garlic and mushrooms',
    v('nm0701', 3.8, {fy: 55}), 'Capesante, aglio nero e funghi.', tags('#capesante', '#scallops', '#vocabolario')),
  W('P-4thu-3p-bancone', 'Thu 19.11', 'green', 'arch', 'Bancone', 'ban·có·ne', 'noun', 'where the cocktails get their story',
    ph('bo285', {fy: 45}), 'Bancone: where our cocktails get their story.', tags('#bar', '#cocktails', '#vocabolario')),
  L('P-4thu-4v-thursday', 'Thu 19.11', [v('kf0103', 8.9), v('kf0136', 4.1)], 'Thursday is just\nFriday in disguise',
    'Thursday is just Friday in disguise.', tags('#thursday', '#brera', '#milano')),

  // ───── Venerdì 20.11
  W('P-5fri-1v-sala', 'Fri 20.11', 'green', 'rect', 'Sala', 'sà·la', 'noun', 'friday night, full and loud',
    v('kf0111', 19.6), 'Sala: Friday night, full and loud.', tags('#friday', '#fullhouse', '#vocabolario')),
  W('P-5fri-2p-gambero', 'Fri 20.11', 'orange', 'circle', 'Gambero', 'gàm·be·ro', 'noun', 'rosso, raw, worth the fingers',
    ph('k0119', {fy: 55}), 'Gambero rosso: raw, and worth the fingers.', tags('#gamberorosso', '#rawbar', '#vocabolario')),
  L('P-5fri-3v-dress-code', 'Fri 20.11', [v('2690', 8.9), v('2680', 6.8)], 'Friday dress code:\nhungry',
    'Friday dress code: hungry.', tags('#friday', '#dinner', '#brera'), {cta: {label: 'book a table', color: 'orange'}}),
  W('P-5fri-4v-ancora', 'Fri 20.11', 'white', 'oval', 'Ancora', 'an·có·ra', 'adverb', 'what everyone says after the first bite',
    v('nm0744', 22.0, {fy: 45}), 'Ancora: what everyone says after the first bite.', tags('#chef', '#vocabolario', '#brera')),
  W('P-5fri-5p-ospite', 'Fri 20.11', 'green', 'arch', 'Ospite', 'òs·pi·te', 'noun', 'you, the most important person in the room',
    ph('p0287', {fy: 40}), 'Ospite: you, the most important person in the room.', tags('#hospitality', '#vocabolario', '#brera')),

  // ───── Sabato 21.11
  W('P-6sat-1v-autunno', 'Sat 21.11', 'orange', 'pill', 'Autunno', 'au·tùn·no', 'noun', 'dried hydrangeas and white pumpkins',
    v('kf0093', 3.0), 'Autunno: dried hydrangeas and white pumpkins at Sea, Signora.', tags('#autumn', '#decor', '#vocabolario')),
  W('P-6sat-2v-cucina', 'Sat 21.11', 'green', 'circle', 'Cucina', 'cu·cì·na', 'noun', 'open, loud, until midnight',
    v('nm0672', 0.3, {fy: 50}), 'Cucina: open, loud, until midnight.', tags('#openkitchen', '#vocabolario', '#brera')),
  L('P-6sat-3v-two-services', 'Sat 21.11', [v('kf0105', 11.0), v('kf0117', 2.5)], 'Two services,\nzero regrets',
    'Saturday: two services, zero regrets. 12:30–15:30 and 19:00–00:00.', tags('#saturday', '#weekend', '#brera'),
    {kicker: 'saturday', sub: '12:30—15:30 | 19:00—00:00', cta: {label: 'book a table', color: 'orange'}}),
  W('P-6sat-4p-panettone', 'Sat 21.11', 'white', 'arch', 'Panettone', 'pa·net·tó·ne', 'noun', 'with warm crema, the season is open',
    ph('pan86', {fy: 55}), 'Panettone with warm crema: the season is open.', tags('#panettone', '#christmas', '#vocabolario')),
  W('P-6sat-5p-tartare', 'Sat 21.11', 'green', 'rect', 'Tartare', 'tar·tà·re', 'noun', 'tuna, cut to order at the raw bar',
    ph('p0347', {fy: 55}), 'Tartare: tuna, cut to order at our raw bar.', tags('#tartare', '#rawbar', '#vocabolario')),

  // ───── Domenica 22.11
  W('P-7sun-1v-compagnia', 'Sun 22.11', 'orange', 'rect', 'Compagnia', 'com·pa·gnì·a', 'noun', 'the best thing on the table',
    v('2687', 3.0), 'Compagnia: the best thing on the table.', tags('#friends', '#vocabolario', '#brera')),
  L('P-7sun-2v-sunday-slow', 'Sun 22.11', [v('2700', 1.3), v('2659', 0.4)], 'Sunday, slow',
    'Sunday, slow. Open 12:30–15:30 and 19:00–00:00.', tags('#sunday', '#brera', '#milano'), {kicker: 'domenica', sub: '12:30—15:30 | 19:00—00:00'}),
  W('P-7sun-3v-scarpetta', 'Sun 22.11', 'white', 'circle', 'Scarpetta', 'scar·pét·ta', 'noun', 'the last of the sauce, with bread. allowed here.',
    v('nm0712', 2.0, {fy: 55}), 'Scarpetta: the last of the sauce, with bread. Allowed here.', tags('#scarpetta', '#vocabolario', '#brera')),
  W('P-7sun-4v-a-presto', 'Sun 22.11', 'green', 'arch', 'A presto', 'a prè·sto', 'phrase', 'see you next week',
    v('2643', 2.0), 'A presto: see you next week.', tags('#seeyousoon', '#vocabolario', '#brera')),
];
