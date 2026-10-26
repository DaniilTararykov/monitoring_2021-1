import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11 «Vocabolario» (client 26.10: no visual noise, no black backgrounds — white, green or orange only).
// Each story is one Italian word from Sea, Signora and one line that says what is in the frame. One flat background,
// the wordmark on top, one cut-out shape with the photo or the video (the shapes alternate and follow the subject:
// a round painting or plate in a circle, a standing chef or a pour in a tall pill, a shirt in an oval…), two lines
// of type. Photos: photographer's Shooting 7 & 8. Videos: atmosphere clips not used before. Silent; links Wed, Fri, Sat.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605},
  green: {bg: brandPalette.green5605, ink: colors.ivory},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605},
};

type Shape = 'arch' | 'circle' | 'pill' | 'rect' | 'oval';
const CY = 820; // every shape is centred on x 540 / y 820
const SHAPES: Record<Shape, {w: number; h: number; radius: string}> = {
  arch: {w: 780, h: 980, radius: '390px 390px 0 0'},
  circle: {w: 800, h: 800, radius: '50%'},
  pill: {w: 600, h: 980, radius: '300px'},
  rect: {w: 760, h: 960, radius: '0'},
  oval: {w: 720, h: 980, radius: '50%'},
};

type Entry = {
  id: string; bg: Bg; shape: Shape; word: string; def: string;
  photo?: string; video?: string; pos?: string; rate?: number; start?: number; frames: number; cta?: {label: string; color: 'orange' | 'olive'};
  zoom?: {s: number; x: number; y: number}; // video: scale s and the source point (px of 1080×1920) put in the middle of the shape
};

const Media: React.FC<{e: Entry; w: number; h: number}> = ({e, w, h}) => {
  if (e.photo) {
    return <Img src={staticFile(`photos/w5/${e.photo}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: e.pos ?? '50% 50%'}} />;
  }
  const src = staticFile(`videos/w5/${e.video}.mp4`);
  const common = {src, muted: true, playbackRate: e.rate ?? 1, startFrom: e.start ?? 0};
  if (e.zoom) {
    const {s, x, y} = e.zoom;
    return <OffthreadVideo {...common} style={{position: 'absolute', width: 1080 * s, height: 1920 * s, left: w / 2 - x * s, top: h / 2 - y * s, maxWidth: 'none'}} />;
  }
  return <OffthreadVideo {...common} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: e.pos ?? '50% 50%'}} />;
};

const EntryView: React.FC<{e: Entry}> = ({e}) => {
  const c = BG[e.bg];
  const sh = SHAPES[e.shape];
  const bottom = CY + sh.h / 2;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 256, textAlign: 'center', fontFamily: fonts.display, fontSize: 36, letterSpacing: 1, color: c.ink}}>
        Sea, Signora
      </div>
      <div style={{position: 'absolute', left: 540 - sh.w / 2, top: CY - sh.h / 2, width: sh.w, height: sh.h, overflow: 'hidden', borderRadius: sh.radius}}>
        <Media e={e} w={sh.w} h={sh.h} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1366, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 66, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1}}>{e.word}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 21, letterSpacing: 3, textTransform: 'uppercase', marginTop: 22}}>{e.def}</div>
      </div>
      {e.cta ? <Chip cta={{...e.cta, y: 1920 - bottom + 40}} /> : null}
    </AbsoluteFill>
  );
};

const s = (sec: number) => Math.round(sec * 30);
const ENTRIES: Entry[] = [
  // Mon 02.11 — the round painting of the lady with an octopus; raw scallops
  {id: 'W5-1mon-1v-signora', bg: 'green', shape: 'circle', word: 'Signora', def: 'the lady on our wall sees every table',
    video: 'muse', zoom: {s: 1.5, x: 764, y: 728}, frames: 189},
  {id: 'W5-1mon-2p-mare', bg: 'white', shape: 'arch', word: 'Mare', def: 'every plate begins at sea', photo: 's8_048', frames: 1},
  // Tue 03.11 — the chef at the open-kitchen range; red prawns in the cook's hands
  {id: 'W5-2tue-1v-fuoco', bg: 'orange', shape: 'pill', word: 'Fuoco', def: 'the open kitchen lights up at 19:00',
    video: 'kitchen-performance', zoom: {s: 0.9, x: 430, y: 1200}, frames: s(7)},
  {id: 'W5-2tue-2p-mani', bg: 'white', shape: 'rect', word: 'Mani', def: 'the finest tool in our kitchen', photo: 's8_043', pos: '50% 55%', frames: 1},
  // Wed 04.11 — the signature spaghetti with caviar; a waiter setting plates down by the aquarium
  {id: 'W5-3wed-1p-caviale', bg: 'green', shape: 'circle', word: 'Caviale', def: 'osetra on spaghetti with anchovy and butter', photo: 's8_120', frames: 1},
  {id: 'W5-3wed-2v-servito', bg: 'white', shape: 'arch', word: 'Servito', def: 'the moment the plate lands',
    video: 'served', pos: '45% 60%', frames: s(6.3), cta: {label: 'book a table', color: 'orange'}},
  // Thu 05.11 — sauce poured over dessert; the waiter's shirt with a red lobster
  {id: 'W5-4thu-1p-dolce', bg: 'orange', shape: 'pill', word: 'Dolce', def: 'a sweet ending poured slowly', photo: 's7_093', pos: '50% 35%', frames: 1},
  {id: 'W5-4thu-2v-aragosta', bg: 'white', shape: 'oval', word: 'Aragosta', def: 'on the menu and on our shirts',
    video: 'lobster-shirt', start: s(3.8), zoom: {s: 1.5, x: 240, y: 1100}, frames: s(4)},
  // Fri 06.11 — the mirror above the room, a guest reading the menu; Strong Breeze on the bar book
  {id: 'W5-5fri-1v-riflesso', bg: 'green', shape: 'rect', word: 'Riflesso', def: 'the room in the mirror on a friday night',
    video: 'mirror-menu', pos: '50% 35%', frames: s(6)},
  {id: 'W5-5fri-2p-aperitivo', bg: 'orange', shape: 'oval', word: 'Aperitivo', def: 'strong breeze from our bar book', photo: 's7_116', pos: '50% 55%', frames: 1,
    cta: {label: 'reserve', color: 'orange'}},
  // Sat 07.11 — the set table, dried flowers and the round flower mural; plates held through the red curtain
  {id: 'W5-6sat-1v-tavola', bg: 'white', shape: 'circle', word: 'Tavola', def: 'set for you at via fiori chiari 32',
    video: 'table-set', pos: '50% 40%', frames: s(7), cta: {label: 'make a reservation', color: 'olive'}},
  {id: 'W5-6sat-2p-sipario', bg: 'green', shape: 'arch', word: 'Sipario', def: 'the curtain rises every night at 19:00', photo: 's8_073', pos: '50% 55%', frames: 1},
  // Sun 08.11 — dried flowers and a seed head on green marble; the red dessert
  {id: 'W5-7sun-1v-domenica', bg: 'orange', shape: 'oval', word: 'Domenica', def: '12:30—15:30 & 19:00—00:00',
    video: 'natura-morta', rate: 0.6, frames: s(6)},
  {id: 'W5-7sun-2p-fine', bg: 'white', shape: 'rect', word: 'Fine', def: 'the end of the week not of dessert', photo: 's7_105', frames: 1},
];

export const VOCABOLARIO = ENTRIES.map((e) => ({id: e.id, frames: e.frames, component: () => <EntryView e={e} />}));
