import type {Block, Overlay, Scene, Story} from './types';

// Week 09–15.11 — extra pool of creatives (client 08.11: «more variants, other creatives; the new dishes from the
// Blackout pro photos and the videos where the chef cooks them, by the candle shoot; more concepts; opening hours»).
// Same account style as week7. New dishes = the Blackout Night menu: Akami · Scampo · Tagliolini · Polpo ·
// Gelato alla nocciola salata e foglia d'ostrica. Chef videos: the «two recipes» shoot (videos/reel, 60 fps).
// Not tied to a day: the client picks. Link chips only where they make sense (candle, review, hours).

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 200): Block => ({t: 'giant', text, size, raw: true});
const gap = (px: number): Block => ({t: 'gap', px});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];
const NEW = 'new on the menu';

export const week7x: Story[] = [
  // ───────── new dishes, cooked by the chef
  {
    id: 'W7X-01v-polpo-built', day: 'pool', rubric: 'Новое блюдо · текст меняется по ходу сборки', music: silent,
    scenes: [
      v('r0654', 0.6, 4, {overlay: top(kick(NEW), H('Zucca'))}),
      v('r0657', 1, 4, {overlay: top(kick(NEW), H('Polpo'))}),
      v('r0663', 1.5, 4, {overlay: top(kick(NEW), H('Nocciole\ne scorzanera', 66))}),
    ],
    caption: 'New on the menu: Polpo, zucca, nocciole e scorzanera.',
    hashtags: tags('#polpo', '#newmenu', '#chef', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7X-02v-tagliolini-pan', day: 'pool', rubric: 'Новое блюдо · из сковороды', music: silent,
    scenes: [v('r0677', 0.5, 6), v('r0682', 0.3, 5.5)],
    overlay: top(kick(NEW), H('Tagliolini'), sub('calamari e finferli')),
    caption: 'Straight from the pan: Tagliolini, calamari e finferli. New on the menu.',
    hashtags: tags('#pasta', '#newmenu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7X-03v-akami-window', day: 'pool', rubric: 'Новое блюдо · окно', music: silent,
    scenes: [v('r0633', 0.3, 5.5, {window: {top: 470, bottom: 400, side: 64}}), v('r0635', 4.5, 6, {window: {top: 470, bottom: 400, side: 64}})],
    overlay: top(kick(NEW), H('Akami'), sub('culatello e porcini')),
    caption: 'New on the menu: Akami, culatello e porcini.',
    hashtags: tags('#tuna', '#newmenu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7X-04v-scampo', day: 'pool', rubric: 'Новое блюдо · цитата снизу', music: silent,
    scenes: [v('r0699', 0.3, 5.5), v('r0705', 1, 6)],
    overlay: top(kick(NEW), H('Scampo'), sub('lardo di colonnata, royale di foie gras'), sub('e trombette dei morti')),
    caption: 'New on the menu: Scampo, lardo di Colonnata, royale di foie gras e trombette dei morti.',
    hashtags: tags('#scampi', '#newmenu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7X-05p-gelato', day: 'pool', rubric: 'Новое блюдо · десерт, огромное слово', music: silent,
    scenes: [ph('bn484', 7, {fy: 55})],
    overlay: top(kick('to finish'), H('Gelato', 110), sub("nocciola salata e foglia d'ostrica")),
    caption: "To finish: Gelato alla nocciola salata e foglia d'ostrica. New on the menu.",
    hashtags: tags('#gelato', '#dessert', '#newmenu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7X-06p-new-menu-list', day: 'pool', rubric: 'Список · новое меню', music: silent,
    scenes: [ph('bn268', 7, {fy: 60, shift: 300})],
    overlay: top(H('On the menu'), {t: 'rule'}, {t: 'list', items: ['akami', 'scampo', 'tagliolini', 'polpo', 'gelato alla nocciola salata']}),
    caption: "On the menu: Akami, Scampo, Tagliolini, Polpo and Gelato alla nocciola salata e foglia d'ostrica.",
    hashtags: tags('#newmenu', '#brera', '#milanofood'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────── the candle
  {
    id: 'W7X-07v-hand-poured', day: 'pool', rubric: 'Свеча · процесс + кнопка', music: silent,
    scenes: [v('r0767', 3, 5), v('r0772', 0.3, 3.5), v('r0777', 0.5, 3.5)],
    overlay: top(kick('the candle cluub × sea, signora'), H('Hand-poured'), sub('holy shell · marine and earthy')),
    cta: {label: 'shop the candle', color: 'orange'},
    caption: 'Hand-poured: Holy Shell, our limited-edition candle by The Candle Cluub. Link in the sticker.',
    hashtags: tags('#candle', '#holyshell', '#thecandlecluub'), ctaVariants: ['shop the candle', 'get yours'],
  },

  // ───────── opening hours, three ways
  {
    id: 'W7X-08v-hours-week', day: 'pool', rubric: 'График · неделя списком', music: silent,
    scenes: [v('2049', 1, 12)],
    overlay: top({t: 'wordmark'}, gap(18),
      sub('mon—fri · 19:00—00:00'), sub('sat—sun · 12:30—15:30 | 19:00—00:00')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Monday to Friday 19:00–00:00. Saturday and Sunday 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#brera', '#milano', '#milanorestaurants'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7X-09v-doors-open', day: 'pool', rubric: 'График · огромное время', music: silent,
    scenes: [v('2063', 0.5, 8.5)],
    overlay: top(kick('every night'), giant('19:00'), sub('doors open in brera')),
    caption: 'Every night, doors open at 19:00.',
    hashtags: tags('#brera', '#dinner', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7X-10v-weekends-twice', day: 'pool', rubric: 'График · выходные, текст меняется', music: silent,
    scenes: [
      v('2047', 0.5, 5, {overlay: top(kick('weekends'), giant('12:30', 170), sub('until 15:30'))}),
      v('2068', 0.5, 6, {overlay: top(kick('weekends'), giant('19:00', 170), sub('until midnight'))}),
    ],
    caption: 'Weekends, twice: from 12:30 to 15:30 and from 19:00 to midnight.',
    hashtags: tags('#weekend', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────── people
  {
    id: 'W7X-11p-google-review', day: 'pool', rubric: 'Отзыв Google', music: silent,
    scenes: [ph('sh143', 9, {fy: 30, overlay: {position: 'bottom', anim: 'static', blocks: [{t: 'stars'}, {t: 'review',
      text: 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.',
      author: 'S C'}]}})],
    overlay: top(H('Sea, Signora', 80), {t: 'note', text: 'google review'}),
    caption: 'Thank you for the kind words. See you soon.',
    hashtags: tags('#review', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7X-12p-chef-approved', day: 'pool', rubric: 'Шеф · юмор', music: silent,
    scenes: [ph('sh170', 7, {fy: 35})],
    overlay: bottom(H('Chef approved'), sub('quality control, every night')),
    caption: 'Chef approved. Quality control, every night.',
    hashtags: tags('#chef', '#kitchen', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
];
