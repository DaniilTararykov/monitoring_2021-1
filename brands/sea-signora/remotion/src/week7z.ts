import type {Block, Overlay, Scene, Story} from './types';

// Week 09–15.11 — new concepts the account has not had yet (client 08.11): guess the dish, before & after, POV,
// hands only, tonight's forecast (+ «choose your fighter», a custom still in Fighter.tsx).
// Material not used before: Blackout #476 (gelato) · Interior #24, #10 · Shooting 9 #43 · chef clips · Dim sum IMG_2059.

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const center = (...blocks: Block[]): Overlay => ({position: 'center', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 190): Block => ({t: 'giant', text, size, raw: true});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week7z: Story[] = [
  {
    id: 'W7Z-01v-guess-the-dish', day: 'pool', rubric: 'Угадай блюдо · крупно → раскрытие', music: silent,
    scenes: [
      ph('bn476', 4.5, {fx: 52, fy: 22, scale: 3.2, overlay: top(kick('zoom in'), H('Guess the dish'), sub('answer in 3, 2, 1'))}),
      ph('bn476', 5.5, {fy: 55, overlay: top(kick('new on the menu'), H('Gelato'), sub("nocciola salata e foglia d'ostrica"))}),
    ],
    caption: "Guess the dish? Gelato alla nocciola salata e foglia d'ostrica, new on the menu.",
    hashtags: tags('#dessert', '#gelato', '#newmenu'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7Z-02v-before-after', day: 'pool', rubric: 'До и после · 18:59 → 21:00', music: silent,
    scenes: [
      ph('int24', 4, {fy: 45, overlay: top(giant('18:59'), sub('before'))}),
      v('2059', 0.5, 7.5, {overlay: top(giant('21:00'), sub('after'))}),
    ],
    caption: 'Before and after. 18:59, then 21:00.',
    hashtags: tags('#fullhouse', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Z-03p-pov', day: 'pool', rubric: 'POV · мем-формат', music: silent,
    scenes: [ph('sh43', 7, {fy: 50})],
    overlay: top(kick('pov'), H('You said\n"just one glass"', 66)),
    caption: 'POV: you said "just one glass".',
    hashtags: tags('#pov', '#wine', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Z-04v-hands-only', day: 'pool', rubric: 'Только руки · нарезка', music: silent,
    scenes: [v('r0637', 4, 2.2), v('r0750', 2, 2.2), v('r0755', 6, 2.2), v('r0661', 2.5, 2), v('r0698', 4.5, 2)],
    overlay: center(H('Hands only', 96), sub('no shortcuts')),
    caption: 'Hands only, no shortcuts.',
    hashtags: tags('#handmade', '#chef', '#openkitchen'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Z-05p-forecast', day: 'pool', rubric: 'Прогноз на вечер · игра', music: silent,
    scenes: [ph('int10', 7, {window: {top: 820, bottom: 420, side: 64}})],
    overlay: top(kick("tonight's forecast"), H('Brera, tonight'), {t: 'gap', px: 8},
      {t: 'list', items: ['candlelight · 100%', 'oysters · scattered all evening', 'cin cin · heavy after 21:00']}),
    caption: "Tonight's forecast: 100% candlelight, oysters scattered all evening, heavy cin cin after 21:00.",
    hashtags: tags('#tonight', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
];
