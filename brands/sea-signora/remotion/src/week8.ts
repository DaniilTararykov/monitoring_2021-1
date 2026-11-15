import type {Block, Overlay, Scene, Story} from './types';

// Week 16–22.11 (client 15.11: «from the latest folders»). The account's own style (as week7): full-frame video or photo,
// ivory Skanaus + mono on the night gradient, orange kickers. Two stories a day: video, then photo.
// Material never used in stories before: the birthday night (12.11, folder 1Eshu8dH…, steady windows picked by measured
// camera shift), Blackout pro photos #024 (Holy Shell candle), #113 (Akami), #411 (cocktail), panettone #91 / #56,
// the Tomahawk platter, Shooting 9 #44. Landscape photos sit in a window, never stretched.
// The birthday is a recap now (no programme, no times). Link chips: Tue (book a table), Thu (reserve), Sat (the candle).

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w9/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w9/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 230): Block => ({t: 'giant', text, size});
const gap = (px: number): Block => ({t: 'gap', px});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];
const WIN = {top: 640, bottom: 520, side: 64};

export const week8: Story[] = [
  // ───────────────────────── Mon 16.11
  {
    id: 'W8-1mon-1v-grazie', day: 'Mon 16.11', rubric: 'ДР · спасибо (рекап)', music: silent,
    scenes: [v('2719', 33.3, 3.4, {fy: 35}), v('2690', 8.3, 3.6), v('2698', 4.7, 4)],
    overlay: top(kick('one year'), H('Grazie'), sub('to everyone who celebrated with us')),
    caption: 'Grazie to everyone who celebrated our first year with us. Here is to many more.',
    hashtags: tags('#oneyear', '#grazie', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-1mon-2p-monday-table', day: 'Mon 16.11', rubric: 'Атмосфера · стол', music: silent,
    scenes: [ph('sh44', 7, {fy: 60})],
    overlay: top(H('Back to the table'), sub('monday, from 19:00')),
    caption: 'Back to the table: Monday, from 19:00.',
    hashtags: tags('#monday', '#brera', '#milanofood'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Tue 17.11
  {
    id: 'W8-2tue-1v-tuna-show', day: 'Tue 17.11', rubric: 'ДР · тунец (рекап)', music: silent,
    scenes: [v('2640', 29.6, 3.6), v('2612', 0.2, 3.2), v('2705', 9.0, 3.4)],
    overlay: top(kick('last thursday'), H('The tuna show'), sub('one bluefin, a whole room watching')),
    caption: 'Last Thursday: one bluefin, a whole room watching, and the tuna on every table.',
    hashtags: tags('#tuna', '#bluefin', '#tunashow', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W8-2tue-2p-akami', day: 'Tue 17.11', rubric: 'Блюдо-герой · окно + кнопка', music: silent,
    scenes: [ph('bo113', 7, {window: WIN, fx: 50, fy: 55})],
    overlay: top(kick('on the menu'), H('Akami'), sub('culatello e porcini')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Akami, culatello e porcini: on the menu at Sea, Signora.',
    hashtags: tags('#tuna', '#akami', '#newmenu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Wed 18.11
  {
    id: 'W8-3wed-1v-open-kitchen', day: 'Wed 18.11', rubric: 'Кухня · часы', music: silent,
    scenes: [v('2666', 15.05, 3.9), v('2665', 1.3, 6.2)],
    overlay: top(H('Open kitchen'), gap(6), {t: 'list', items: ['monday—friday 19:00—00:00', 'saturday—sunday 12:30—15:30 | 19:00—00:00'], size: 28}),
    caption: 'Open kitchen. Monday to Friday 19:00–00:00, Saturday and Sunday 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#openkitchen', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-3wed-2p-panettone-dressed', day: 'Wed 18.11', rubric: 'Панеттоне · десерт', music: silent,
    scenes: [ph('pan91', 7, {fy: 62})],
    overlay: top(kick('panettone season'), H('Dressed for dessert'), sub('cherries & crema')),
    caption: 'Panettone, dressed for dessert: cherries and crema. Panettone season at Sea, Signora.',
    hashtags: tags('#panettone', '#dessert', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Thu 19.11
  {
    id: 'W8-4thu-1v-at-the-bar', day: 'Thu 19.11', rubric: 'Бар · вечер + кнопка', music: silent,
    scenes: [v('2618', 1.2, 3.6), v('2673', 2.3, 3.2), v('2668', 2.4, 4)],
    overlay: top(kick('thursday'), H('Meet me at the bar'), sub('from 19:00')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Thursday: meet me at the bar, from 19:00.',
    hashtags: tags('#bar', '#cocktails', '#aperitivo', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-4thu-2p-one-more', day: 'Thu 19.11', rubric: 'Коктейль · фото', music: silent,
    scenes: [ph('bo411', 7, {fy: 45})],
    overlay: bottom(H('One more?'), sub('cocktails with a story')),
    caption: 'One more? Our cocktails come with a story.',
    hashtags: tags('#cocktails', '#bar', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Fri 20.11
  {
    id: 'W8-5fri-1v-the-host', day: 'Fri 20.11', rubric: 'Люди · Антонио', music: silent,
    scenes: [v('2674', 3.2, 4.5, {shift: 170}), v('2588', 4.6, 5.6)],
    overlay: top(kick('friday night'), H('The host'), sub('antonio fresa, our founder')),
    caption: 'Friday night, and the host is in: Antonio Fresa, our founder.',
    hashtags: tags('#hospitality', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-5fri-2p-tomahawk', day: 'Fri 20.11', rubric: 'Бистекка · фото', music: silent,
    scenes: [ph('steak1', 7, {fy: 60})],
    overlay: bottom(kick('for two'), H("Share it.\nOr don't.", 70), sub('the tomahawk')),
    caption: "The Tomahawk, for two. Share it. Or don't.",
    hashtags: tags('#tomahawk', '#steak', '#weekend', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sat 21.11
  {
    id: 'W8-6sat-1v-saturday', day: 'Sat 21.11', rubric: 'Атмосфера · зал + часы', music: silent,
    scenes: [v('2643', 3.1, 5), v('2700', 1.3, 5)],
    overlay: top(kick('saturday'), H('Busy & we love it'), sub('12:30—15:30 | 19:00—00:00')),
    caption: 'Saturday: busy and we love it. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#saturday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-6sat-2p-holy-shell', day: 'Sat 21.11', rubric: 'Свеча · окно + кнопка', music: silent,
    scenes: [ph('bo024', 7, {window: WIN, fx: 40, fy: 55})],
    overlay: top(kick('holy shell'), H('Gift the sea'), sub('our candle by the candle cluub')),
    cta: {label: 'shop the candle', color: 'orange'},
    caption: 'Gift the sea: Holy Shell, our limited-edition candle by The Candle Cluub.',
    hashtags: tags('#candle', '#holyshell', '#thecandlecluub', '#gift'), ctaVariants: ['shop the candle', 'get yours'],
  },

  // ───────────────────────── Sun 22.11
  {
    id: 'W8-7sun-1v-sunday-plans', day: 'Sun 22.11', rubric: 'Гости · воскресенье + часы', music: silent,
    scenes: [v('2623', 0.1, 5), v('2647', 6.0, 5)],
    overlay: top(kick('sunday'), H('Sunday plans'), sub('12:30—15:30 | 19:00—00:00')),
    caption: 'Sunday plans: see you at Sea, Signora. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#sunday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-7sun-2p-golden', day: 'Sun 22.11', rubric: 'Панеттоне · огромное слово', music: silent,
    scenes: [ph('pan56', 7)],
    overlay: top(kick('panettone season'), giant('Golden'), sub('at sea, signora')),
    caption: 'Golden. Panettone season at Sea, Signora.',
    hashtags: tags('#panettone', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
];
