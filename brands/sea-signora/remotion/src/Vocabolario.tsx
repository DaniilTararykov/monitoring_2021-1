import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11 «Vocabolario» (client 26.10: no visual noise, no black backgrounds — white, green or orange only).
// Each story is one entry of the Sea, Signora dictionary: an Italian word, its syllables and stress and one line that
// says what is in the frame. One flat background, one arch with the photo or the video, three lines of type.
// Photos: photographer's Shooting 7 & 8. Videos: atmosphere clips not used before. Silent; link chips Wed, Fri, Sat.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};

type Entry = {
  id: string; n: number; bg: Bg; word: string; ipa: string; pos: string; def: string;
  photo?: string; video?: string; pos2?: string; rate?: number; start?: number; frames: number; cta?: {label: string; color: 'orange' | 'olive'};
  zoom?: {s: number; x: number; y: number}; // video: scale s and the source point (px of 1080×1920) put in the middle of the arch
};

const AX = 150, AY = 330, AW = 780, AH = 980; // the arch

const Media: React.FC<{e: Entry}> = ({e}) => {
  if (e.photo) {
    return <Img src={staticFile(`photos/w5/${e.photo}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: e.pos2 ?? '50% 50%'}} />;
  }
  const src = staticFile(`videos/w5/${e.video}.mp4`);
  if (e.zoom) {
    const {s, x, y} = e.zoom;
    return <OffthreadVideo src={src} muted playbackRate={e.rate ?? 1} startFrom={e.start ?? 0}
      style={{position: 'absolute', width: 1080 * s, height: 1920 * s, left: AW / 2 - x * s, top: AH / 2 - y * s, maxWidth: 'none'}} />;
  }
  return <OffthreadVideo src={src} muted playbackRate={e.rate ?? 1} startFrom={e.start ?? 0}
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: e.pos2 ?? '50% 50%'}} />;
};

const EntryView: React.FC<{e: Entry}> = ({e}) => {
  const c = BG[e.bg];
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18,
        letterSpacing: 5, textTransform: 'uppercase', color: c.ink}}>
        vocabolario <span style={{color: c.accent}}>{String(e.n).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'absolute', left: AX, top: AY, width: AW, height: AH, overflow: 'hidden', borderRadius: `${AW / 2}px ${AW / 2}px 0 0`}}>
        <Media e={e} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: AY + AH + 44, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 64, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1}}>{e.word}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 30, marginTop: 14}}>
          {e.ipa} <span style={{color: c.accent}}>·</span> {e.pos}
        </div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 21, letterSpacing: 3, textTransform: 'uppercase', marginTop: 16}}>{e.def}</div>
      </div>
      {e.cta ? <Chip cta={{...e.cta, y: 1920 - AY - AH + 40}} /> : null}
    </AbsoluteFill>
  );
};

const s = (sec: number) => Math.round(sec * 30);
const ENTRIES: Entry[] = [
  // Mon 02.11 — the round painting of the lady with an octopus in the room; the raw scallops
  {id: 'W5-1mon-1v-signora', n: 1, bg: 'green', word: 'Signora', ipa: 'si·gnó·ra', pos: 'noun', def: 'the lady on our wall · she sees every table',
    video: 'muse', zoom: {s: 1.5, x: 764, y: 728}, frames: 189},
  {id: 'W5-1mon-2p-mare', n: 2, bg: 'white', word: 'Mare', ipa: 'mà·re', pos: 'noun', def: 'the sea · where every plate begins', photo: 's8_048', frames: 1},
  // Tue 03.11 — the chef at the open-kitchen range, pans on the fire; red prawns in the cook's hands
  {id: 'W5-2tue-1v-fuoco', n: 3, bg: 'orange', word: 'Fuoco', ipa: 'fuò·co', pos: 'noun', def: 'fire · the open kitchen from 19:00',
    video: 'kitchen-performance', pos2: '40% 70%', frames: s(7)},
  {id: 'W5-2tue-2p-mani', n: 4, bg: 'white', word: 'Mani', ipa: 'mà·ni', pos: 'noun', def: 'hands · the finest tool in our kitchen', photo: 's8_043', pos2: '50% 55%', frames: 1},
  // Wed 04.11 — the signature spaghetti with caviar; a waiter setting plates down by the aquarium
  {id: 'W5-3wed-1p-caviale', n: 5, bg: 'green', word: 'Caviale', ipa: 'ca·vià·le', pos: 'noun', def: 'osetra · on spaghetti with anchovy and butter', photo: 's8_120', frames: 1},
  {id: 'W5-3wed-2v-servito', n: 6, bg: 'white', word: 'Servito', ipa: 'ser·ví·to', pos: 'adjective', def: 'served · the moment the plate lands',
    video: 'served', pos2: '45% 60%', frames: s(7), cta: {label: 'book a table', color: 'orange'}},
  // Thu 05.11 — a slow pour over dessert; a waiter in a shirt printed with a red lobster
  {id: 'W5-4thu-1p-dolce', n: 7, bg: 'orange', word: 'Dolce', ipa: 'dól·ce', pos: 'noun', def: 'sweet · poured slowly', photo: 's7_093', pos2: '50% 35%', frames: 1},
  {id: 'W5-4thu-2v-aragosta', n: 8, bg: 'white', word: 'Aragosta', ipa: 'a·ra·gó·sta', pos: 'noun', def: 'lobster · on the menu and on our shirts',
    video: 'lobster-shirt', start: s(3.8), zoom: {s: 1.3, x: 300, y: 1100}, frames: s(4)},
  // Fri 06.11 — the mirror above the room, a guest reading the menu; Strong Breeze from the bar book
  {id: 'W5-5fri-1v-riflesso', n: 9, bg: 'green', word: 'Riflesso', ipa: 'ri·flès·so', pos: 'noun', def: 'reflection · the room in the mirror on a friday',
    video: 'mirror-menu', pos2: '50% 35%', frames: s(7.5)},
  {id: 'W5-5fri-2p-aperitivo', n: 10, bg: 'orange', word: 'Aperitivo', ipa: 'a·pe·ri·tí·vo', pos: 'noun', def: 'strong breeze · from our bar book', photo: 's7_116', pos2: '50% 55%', frames: 1,
    cta: {label: 'reserve', color: 'orange'}},
  // Sat 07.11 — the set table: dried flowers, the painted vase, the round flower mural; plates held through the red curtain
  {id: 'W5-6sat-1v-tavola', n: 11, bg: 'white', word: 'Tavola', ipa: 'tà·vo·la', pos: 'noun', def: 'table · set for you at via fiori chiari 32',
    video: 'table-set', pos2: '40% 60%', frames: s(7), cta: {label: 'make a reservation', color: 'olive'}},
  {id: 'W5-6sat-2p-sipario', n: 12, bg: 'green', word: 'Sipario', ipa: 'si·pà·rio', pos: 'noun', def: 'curtain · up every night at 19:00', photo: 's8_073', pos2: '50% 55%', frames: 1},
  // Sun 08.11 — dried flowers and a seed head on green marble; the red dessert
  {id: 'W5-7sun-1v-domenica', n: 13, bg: 'orange', word: 'Domenica', ipa: 'do·mé·ni·ca', pos: 'noun', def: 'sunday · 12:30—15:30 & 19:00—00:00',
    video: 'natura-morta', rate: 0.6, frames: s(6)},
  {id: 'W5-7sun-2p-fine', n: 14, bg: 'white', word: 'Fine', ipa: 'fí·ne', pos: 'noun', def: 'the end · of the week not of dessert', photo: 's7_105', pos2: '50% 50%', frames: 1},
];

export const VOCABOLARIO = ENTRIES.map((e) => ({id: e.id, frames: e.frames, component: () => <EntryView e={e} />}));
