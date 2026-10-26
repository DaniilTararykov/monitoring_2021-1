import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 26.10–01.11 «Vocabolario» (client 26.10: no visual noise, no black backgrounds — white, green or orange only).
// Each story is one Italian word from Sea, Signora: the word, how it is read (stress) and its part of speech, and one
// line that says what is in the frame (never the translation again). Wordmark on top, one flat background, one
// cut-out shape with the photo or the video; the shapes alternate and follow the subject, and the subject sits in the
// middle of the shape (focus point + clamp so the media always covers the shape).
// Photos: photographer's Shooting 7 & 8 (+ the client's hands shot, the Tomahawk). Videos: stabilised, calm stretches.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};

type Shape = 'arch' | 'circle' | 'pill' | 'rect' | 'oval';
const CY = 800; // every shape is centred on x 540 / y 800
const SHAPES: Record<Shape, {w: number; h: number; radius: string}> = {
  arch: {w: 780, h: 960, radius: '390px 390px 0 0'},
  circle: {w: 800, h: 800, radius: '50%'},
  pill: {w: 600, h: 960, radius: '300px'},
  rect: {w: 760, h: 940, radius: '0'},
  oval: {w: 720, h: 960, radius: '50%'},
};

type Media = {photo?: string; video?: string; size: [number, number]; focus: [number, number]; zoom?: number; rate?: number; start?: number};
type Entry = {id: string; bg: Bg; shape: Shape; word: string; read: string; pos: string; def: string; m: Media; frames: number; cta?: {label: string; color: 'orange' | 'olive'}};

// the media covers the shape, scaled `zoom` × over cover, with the focus point as close to the centre as the edges allow
const place = (w: number, h: number, m: Media): React.CSSProperties => {
  const [iw, ih] = m.size;
  const k = Math.max(w / iw, h / ih) * (m.zoom ?? 1);
  const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
  return {position: 'absolute', width: iw * k, height: ih * k, maxWidth: 'none',
    left: clamp(w / 2 - m.focus[0] * k, w - iw * k), top: clamp(h / 2 - m.focus[1] * k, h - ih * k)};
};

const EntryView: React.FC<{e: Entry}> = ({e}) => {
  const c = BG[e.bg];
  const sh = SHAPES[e.shape];
  const style = place(sh.w, sh.h, e.m);
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 36, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 15, letterSpacing: 6, textTransform: 'uppercase', marginTop: 8, color: c.accent}}>vocabolario</div>
      </div>
      <div style={{position: 'absolute', left: 540 - sh.w / 2, top: CY - sh.h / 2 + 20, width: sh.w, height: sh.h, overflow: 'hidden', borderRadius: sh.radius}}>
        {e.m.photo
          ? <Img src={staticFile(`photos/w5/${e.m.photo}.jpg`)} style={style} />
          : <OffthreadVideo src={staticFile(`videos/w5/${e.m.video}.mp4`)} muted playbackRate={e.m.rate ?? 1} startFrom={e.m.start ?? 0} style={style} />}
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1330, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 66, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1}}>{e.word}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 30, marginTop: 12}}>
          {e.read} <span style={{color: c.accent}}>·</span> {e.pos}
        </div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 21, letterSpacing: 3, textTransform: 'uppercase', marginTop: 16}}>{e.def}</div>
      </div>
      {e.cta ? <Chip cta={{...e.cta, y: 1920 - (CY + sh.h / 2 + 20) + 40}} /> : null}
    </AbsoluteFill>
  );
};

const s = (sec: number) => Math.round(sec * 30);
const V: [number, number] = [1080, 1920];
const S8: [number, number] = [2200, 3298];
const S7: [number, number] = [1000, 1500];
const ENTRIES: Entry[] = [
  // Mon 26.10 — the round painting of the lady with an octopus; raw scallops
  {id: 'W5-1mon-1v-signora', bg: 'green', shape: 'circle', word: 'Signora', read: 'si·gnó·ra', pos: 'noun', def: 'the lady on our wall sees every table',
    m: {video: 'muse', size: V, focus: [764, 728], zoom: 2.0}, frames: 189},
  {id: 'W5-1mon-2p-mare', bg: 'white', shape: 'arch', word: 'Mare', read: 'mà·re', pos: 'noun', def: 'every plate begins at sea',
    m: {photo: 's8_048', size: S8, focus: [1100, 1650]}, frames: 1},
  // Tue 27.10 — the chef at the open-kitchen range; red prawns in the cook's hands
  {id: 'W5-2tue-1v-fuoco', bg: 'orange', shape: 'pill', word: 'Fuoco', read: 'fuò·co', pos: 'noun', def: 'the open kitchen lights up at 19:00',
    m: {video: 'kitchen-performance', size: V, focus: [430, 1150], zoom: 1.6}, frames: s(7)},
  {id: 'W5-2tue-2p-mani', bg: 'white', shape: 'rect', word: 'Mani', read: 'mà·ni', pos: 'noun', def: 'the finest tool in our kitchen',
    m: {photo: 'hands', size: [784, 1176], focus: [490, 740], zoom: 1.15}, frames: 1},
  // Wed 28.10 — the signature spaghetti with caviar; a waiter setting plates down by the aquarium
  {id: 'W5-3wed-1p-caviale', bg: 'green', shape: 'circle', word: 'Caviale', read: 'ca·vià·le', pos: 'noun', def: 'osetra on spaghetti with anchovy and butter',
    m: {photo: 's8_120', size: S8, focus: [1100, 1320]}, frames: 1},
  {id: 'W5-3wed-2v-servito', bg: 'white', shape: 'arch', word: 'Servito', read: 'ser·ví·to', pos: 'adjective', def: 'the moment the plate lands',
    m: {video: 'served', size: V, focus: [560, 1150], zoom: 1.2}, frames: s(6.3), cta: {label: 'book a table', color: 'orange'}},
  // Thu 29.10 — sauce poured over dessert; the waiter's lobster shirt; the new Tomahawk
  {id: 'W5-4thu-1p-dolce', bg: 'orange', shape: 'pill', word: 'Dolce', read: 'dól·ce', pos: 'noun', def: 'a sweet ending poured slowly',
    m: {photo: 's7_093', size: S7, focus: [475, 760]}, frames: 1},
  {id: 'W5-4thu-2v-aragosta', bg: 'white', shape: 'oval', word: 'Aragosta', read: 'a·ra·gó·sta', pos: 'noun', def: 'on the menu and on our shirts',
    m: {video: 'lobster-shirt', size: V, focus: [240, 1100], zoom: 2.25, start: s(3.8)}, frames: s(4)},
  {id: 'W5-4thu-3p-bistecca', bg: 'green', shape: 'circle', word: 'Bistecca', read: 'bi·stéc·ca', pos: 'noun', def: 'tomahawk dry-aged 45 days with osetra caviar',
    m: {photo: 'tomahawk', size: [960, 1280], focus: [520, 700]}, frames: 1},
  // Fri 30.10 — the mirror above the room, a guest reading the menu; Strong Breeze on the bar book
  {id: 'W5-5fri-1v-riflesso', bg: 'green', shape: 'rect', word: 'Riflesso', read: 'ri·flès·so', pos: 'noun', def: 'the room in the mirror on a friday night',
    m: {video: 'mirror-menu', size: V, focus: [540, 900], start: s(4.3), rate: 0.4}, frames: s(4.5)},
  {id: 'W5-5fri-2p-aperitivo', bg: 'orange', shape: 'oval', word: 'Aperitivo', read: 'a·pe·ri·tí·vo', pos: 'noun', def: 'strong breeze from our bar book',
    m: {photo: 's7_116', size: [1001, 1500], focus: [350, 760], zoom: 1.4}, frames: 1, cta: {label: 'reserve', color: 'orange'}},
  // Sat 31.10 — the set table, dried flowers and the round flower mural; plates held through the red curtain
  {id: 'W5-6sat-1v-tavola', bg: 'white', shape: 'circle', word: 'Tavola', read: 'tà·vo·la', pos: 'noun', def: 'set for you at via fiori chiari 32',
    m: {video: 'table-set', size: V, focus: [540, 900], start: s(3.5), rate: 0.55}, frames: s(6), cta: {label: 'make a reservation', color: 'olive'}},
  {id: 'W5-6sat-2p-sipario', bg: 'green', shape: 'arch', word: 'Sipario', read: 'si·pà·rio', pos: 'noun', def: 'the curtain rises every night at 19:00',
    m: {photo: 's8_073', size: S8, focus: [1045, 1650]}, frames: 1},
  // Sun 01.11 — dried flowers and a seed head on green marble; the red dessert
  {id: 'W5-7sun-1v-domenica', bg: 'orange', shape: 'oval', word: 'Domenica', read: 'do·mé·ni·ca', pos: 'noun', def: '12:30—15:30 & 19:00—00:00',
    m: {video: 'natura-morta', size: V, focus: [528, 800], zoom: 1.15, rate: 0.6}, frames: s(6)},
  {id: 'W5-7sun-2p-fine', bg: 'white', shape: 'rect', word: 'Fine', read: 'fí·ne', pos: 'noun', def: 'the end of the week not of dessert',
    m: {photo: 's7_105', size: [1200, 1500], focus: [600, 640], zoom: 1.15}, frames: 1},
  // events (client 26.10): the Dim Sum Milano collab — the dumplings from the client's own story, cropped below its
  // burned-in title; Blackout Night — candles, a plate and a glass from the event's photo set
  {id: 'W5-7sun-3p-dimsum-ravioli', bg: 'green', shape: 'circle', word: 'Ravioli', read: 'ra·vió·li', pos: 'noun', def: 'di gambero piccante · sea, signora × dim sum milano',
    m: {photo: 'dimsum-ravioli', size: [720, 1280], focus: [276, 852]}, frames: 1},
  {id: 'W5-4thu-4p-blackout-buio', bg: 'orange', shape: 'pill', word: 'Buio', read: 'bù·io', pos: 'noun', def: 'blackout night 29/10 · dinner by candlelight',
    m: {photo: 'blackout-candles', size: [2200, 3300], focus: [1210, 1650], zoom: 1.1}, frames: 1},
];

export const VOCABOLARIO = ENTRIES.map((e) => ({id: e.id, frames: e.frames, component: () => <EntryView e={e} />}));
