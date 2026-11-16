import type {Block, Overlay, Scene, Story} from './types';

// Week 16–22.11 v2 — 30 new stories (client 16.11: «I don't like it, I need 30 new stories»). A regular content plan, no
// birthday recap, no candle; nothing from the previous version of the week (week8.ts) is reused.
// Material: the chef cooking the new menu (folder 1Uv4yte…: akami, polpo, tagliolini, scallop with black garlic,
// the whole table, the chef tasting), Blackout Night 29.10 pro photos (guests, bar, aquarium, fire, the team),
// Pixieset (the entrance, the menu card, guests, tuna tartare, spaghetti al tonno, a cocktail), «Newspaper» portraits,
// panettone #51 #58 #86, and from the birthday night only the room and seated guests.
// Formats rotate: hero dish, step series, POV, giant word, list, problem/solution, hours, address, team, quote.
// Four or five a day (the client posts 2–3 and picks). Link chips on three days: Tue, Thu, Sat. Headlines avoid «?» (no glyph in Skanaus).

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w10/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w10/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 220): Block => ({t: 'giant', text, size});
const gap = (px: number): Block => ({t: 'gap', px});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];
const WIN = {top: 640, bottom: 520, side: 64};
const WE = '12:30—15:30 | 19:00—00:00';

export const week9: Story[] = [
  // ───────────────────────── Mon 16.11
  {
    id: 'W9-1mon-1v-the-kitchen-wakes-up', day: 'Mon 16.11', rubric: 'Кухня · часы', music: silent,
    scenes: [v('nm0632', 4.6, 5), v('nm0672', 0.3, 5)],
    overlay: top(kick('monday'), H('The kitchen wakes up'), sub('19:00—00:00')),
    caption: 'Monday: the kitchen wakes up at 19:00.',
    hashtags: tags('#openkitchen', '#monday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-1mon-2p-find-us', day: 'Mon 16.11', rubric: 'Адрес · вход', music: silent,
    scenes: [ph('p0195', 7, {fy: 55})],
    overlay: top(kick('find us'), H('In the heart of Brera'), sub('via fiori chiari, 32')),
    caption: 'Find us in the heart of Brera: Via Fiori Chiari, 32.',
    hashtags: tags('#brera', '#viafiorichiari', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-1mon-3p-the-host', day: 'Mon 16.11', rubric: 'Команда · основатель', music: silent,
    scenes: [ph('npAntonio3', 7, {fy: 30})],
    overlay: bottom(kick('meet the team'), H('Antonio Fresa'), sub('founder · the one with the ideas')),
    caption: 'Meet the team: Antonio Fresa, our founder. The one with the ideas.',
    hashtags: tags('#founder', '#team', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-1mon-4p-pour', day: 'Mon 16.11', rubric: 'Вино · фото', music: silent,
    scenes: [ph('bo127', 7, {window: WIN, fx: 40, fy: 50})],
    overlay: top(H('We pour,\nyou stay', 70)),
    caption: 'We pour, you stay. Wine by the glass every night.',
    hashtags: tags('#wine', '#hospitality', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Tue 17.11
  {
    id: 'W9-2tue-1v-akami-steps', day: 'Tue 17.11', rubric: 'Серия «шаги» · Akami', music: silent,
    scenes: [
      v('nm0636', 2.0, 3.3, {overlay: top(kick('step one'), H('Lay'))}),
      v('nm0636', 15.5, 3.3, {overlay: top(kick('step two'), H('Dress'))}),
      v('nm0646', 15.0, 3.6, {overlay: top(kick('step three'), H('Akami'))}),
    ],
    caption: 'Lay, dress, serve: Akami, culatello e porcini.',
    hashtags: tags('#akami', '#tuna', '#chef', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-2tue-2p-pov-menu', day: 'Tue 17.11', rubric: 'POV · меню', music: silent,
    scenes: [ph('p0290', 7, {fy: 50})],
    overlay: top(kick('pov'), H('You said\n"just a look"', 66)),
    caption: 'POV: you said "just a look at the menu".',
    hashtags: tags('#pov', '#menu', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-2tue-3p-tartare', day: 'Tue 17.11', rubric: 'Блюдо-герой + кнопка', music: silent,
    scenes: [ph('p0347', 7, {fy: 55, shift: 300})],
    overlay: top(kick('raw bar'), H('Tuna tartare'), sub('cut to order')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Tuna tartare, cut to order at our raw bar.',
    hashtags: tags('#tartare', '#tuna', '#rawbar', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-2tue-4v-full-room', day: 'Tue 17.11', rubric: 'Атмосфера · зал', music: silent,
    scenes: [v('2626', 3.4, 5), v('2620', 5.8, 5)],
    overlay: top(H('Nothing beats\na full room', 70)),
    caption: 'Nothing beats a full room.',
    hashtags: tags('#fullhouse', '#tuesday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Wed 18.11
  {
    id: 'W9-3wed-1v-capesante', day: 'Wed 18.11', rubric: 'Новое блюдо · сборка', music: silent,
    scenes: [v('nm0701', 3.8, 3.6), v('nm0703', 0.9, 3.2), v('nm0708', 0.8, 3.4)],
    overlay: top(kick('on the menu'), H('Capesante'), sub('aglio nero e funghi')),
    caption: 'Capesante, aglio nero e funghi: on the menu at Sea, Signora.',
    hashtags: tags('#scallops', '#capesante', '#chef', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-3wed-2p-midweek-cure', day: 'Wed 18.11', rubric: 'Гости · цитата', music: silent,
    scenes: [ph('bo205', 7, {window: WIN, fy: 45})],
    overlay: bottom(H('The midweek cure'), sub('dinner, wine, good company')),
    caption: 'The midweek cure: dinner, wine and good company.',
    hashtags: tags('#midweek', '#dinner', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-3wed-3p-panettone-basket', day: 'Wed 18.11', rubric: 'Панеттоне · подарок', music: silent,
    scenes: [ph('pan51', 7, {fy: 50})],
    overlay: top(kick('panettone season'), H('Wrapped & ready'), sub('ask our staff')),
    caption: 'Panettone season: wrapped and ready. Ask our staff.',
    hashtags: tags('#panettone', '#gift', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-3wed-4v-your-problem', day: 'Wed 18.11', rubric: 'Your problem / Our solution', music: silent,
    scenes: [],
    chat: [
      {problem: 'it\'s only wednesday', solution: 'w10/bo422.jpg'},
      {problem: 'i want pasta', solution: 'w10/p0338.jpg'},
      {problem: 'i need a view', solution: 'w10/bo229.jpg'},
    ],
    caption: "Only Wednesday, craving pasta, need a view: we have solutions.",
    hashtags: tags('#brera', '#milano', '#milanofood'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Thu 19.11
  {
    id: 'W9-4thu-1v-tagliolini', day: 'Thu 19.11', rubric: 'Новое блюдо · от плиты до стола', music: silent,
    scenes: [v('nm0676', 8.5, 4), v('nm0686', 0.8, 3), v('nm0681', 6.5, 3.2)],
    overlay: top(kick('from the pan'), H('Tagliolini'), sub('calamari e finferli')),
    caption: 'From the pan to the table: tagliolini, calamari e finferli.',
    hashtags: tags('#pasta', '#tagliolini', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-4thu-2p-bartender', day: 'Thu 19.11', rubric: 'Бар · процесс', music: silent,
    scenes: [ph('bo285', 7, {fy: 45})],
    overlay: top(kick('the bar'), H('Garnish is\nnot optional', 70)),
    caption: 'At our bar, the garnish is not optional.',
    hashtags: tags('#cocktails', '#bar', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-4thu-3p-cin-cin', day: 'Thu 19.11', rubric: 'Коктейли · огромное слово + кнопка', music: silent,
    scenes: [ph('bo462', 7, {fy: 55})],
    overlay: top(giant('Cin cin'), sub('thursday, from 19:00')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Cin cin. Thursday, from 19:00.',
    hashtags: tags('#cincin', '#cocktails', '#thursday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-4thu-4p-sous-chef', day: 'Thu 19.11', rubric: 'Команда · кухня', music: silent,
    scenes: [ph('npFedericosouschef2', 7, {fy: 35, shift: 280})],
    overlay: top(kick('meet the team'), H('Federico'), sub('sous chef · plating, one leaf at a time')),
    caption: 'Meet the team: Federico, our sous chef. Plating, one leaf at a time.',
    hashtags: tags('#souschef', '#team', '#kitchen'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-4thu-5v-the-bar-crowd', day: 'Thu 19.11', rubric: 'Атмосфера · бар', music: silent,
    scenes: [v('2633', 0.5, 4.8), v('2659', 0.4, 4.6)],
    overlay: top(H('Thursday is the\nnew Friday', 70)),
    caption: 'Thursday is the new Friday.',
    hashtags: tags('#thursday', '#aperitivo', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Fri 20.11
  {
    id: 'W9-5fri-1v-the-table', day: 'Fri 20.11', rubric: 'Стол · всё меню', music: silent,
    scenes: [v('nm0741', 0.2, 7.8)],
    overlay: top(kick('friday'), H('Order everything'), sub('share the rest')),
    caption: 'Friday rule: order everything, share the rest.',
    hashtags: tags('#friday', '#sharing', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-5fri-2p-fire', day: 'Fri 20.11', rubric: 'Огонь · огромное слово', music: silent,
    scenes: [ph('bo92', 7, {window: WIN, fy: 50})],
    overlay: top(giant('Brace'), sub('our grill is on')),
    caption: 'Brace: our grill is on.',
    hashtags: tags('#grill', '#fire', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-5fri-3p-friday-face', day: 'Fri 20.11', rubric: 'Гости · эмоция', music: silent,
    scenes: [ph('bo365', 7, {fy: 45})],
    overlay: top(H('Friday face'), sub('it suits you')),
    caption: 'Friday face. It suits you.',
    hashtags: tags('#friday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-5fri-4p-spaghetti', day: 'Fri 20.11', rubric: 'Блюдо-герой', music: silent,
    scenes: [ph('p0338', 7, {fy: 55, shift: 300})],
    overlay: top(kick('simple, done right'), H('Spaghetti\n& red tuna', 70)),
    caption: 'Simple, done right: spaghetti with red tuna.',
    hashtags: tags('#spaghetti', '#tuna', '#pasta', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sat 21.11
  {
    id: 'W9-6sat-1v-polpo-close', day: 'Sat 21.11', rubric: 'Блюдо · крупно', music: silent,
    scenes: [v('nm0662', 31.8, 4.5), v('nm0712', 2.0, 5.5)],
    overlay: top(kick('weekend plate'), H('Polpo'), sub('zucca, nocciole e scorzanera')),
    caption: 'Weekend plate: polpo, zucca, nocciole e scorzanera.',
    hashtags: tags('#polpo', '#octopus', '#weekend', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-6sat-2p-two-services', day: 'Sat 21.11', rubric: 'Часы · выходные + кнопка', music: silent,
    scenes: [ph('bo228', 7, {window: WIN, fy: 50})],
    overlay: top({t: 'wordmark'}, gap(16), sub('saturday & sunday'), sub(WE)),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Saturday and Sunday: 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#weekend', '#brera', '#milano'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9-6sat-3p-menu-card', day: 'Sat 21.11', rubric: 'Детали · сервировка', music: silent,
    scenes: [ph('p0213', 7, {fy: 50})],
    overlay: top(H('Your table\nis set', 70), sub('see you tonight')),
    caption: 'Your table is set. See you tonight.',
    hashtags: tags('#tablesetting', '#details', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-6sat-4p-red', day: 'Sat 21.11', rubric: 'Гости · бокал', music: silent,
    scenes: [ph('bo415', 7, {fy: 40})],
    overlay: bottom(H('Saturday,\nin red', 70)),
    caption: 'Saturday, in red.',
    hashtags: tags('#cocktails', '#saturday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-6sat-5v-chef-tastes', day: 'Sat 21.11', rubric: 'Шеф пробует', music: silent,
    scenes: [v('nm0744', 22.0, 5.5), v('nm0744', 40.0, 4.5)],
    overlay: top(kick('quality control'), H('The chef tastes\neverything', 70)),
    caption: 'Quality control: the chef tastes everything first.',
    hashtags: tags('#chef', '#behindthescenes', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Sun 22.11
  {
    id: 'W9-7sun-1v-sunday-service', day: 'Sun 22.11', rubric: 'Атмосфера · часы', music: silent,
    scenes: [v('2690', 8.9, 5), v('2680', 6.8, 5)],
    overlay: top(kick('sunday'), H('Two services today'), sub(WE)),
    caption: 'Sunday, two services: 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#sunday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-7sun-2p-panettone-pour', day: 'Sun 22.11', rubric: 'Панеттоне · крем', music: silent,
    scenes: [ph('pan86', 7, {fy: 55})],
    overlay: top(kick('panettone season'), H('Sunday pour'), sub('warm crema, no regrets')),
    caption: 'Sunday pour: panettone with warm crema, no regrets.',
    hashtags: tags('#panettone', '#sunday', '#dessert', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-7sun-3p-aquarium', day: 'Sun 22.11', rubric: 'Аквариум · окно', music: silent,
    scenes: [ph('bo158', 7, {fy: 50})],
    overlay: top(H('Our quietest\nregulars', 70), sub('they never leave the aquarium')),
    caption: 'Our quietest regulars: they never leave the aquarium.',
    hashtags: tags('#aquarium', '#sunday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9-7sun-4p-chef', day: 'Sun 22.11', rubric: 'Команда · шеф', music: silent,
    scenes: [ph('npchefRoberto2', 7, {fy: 40, shift: 280})],
    overlay: top(kick('meet the team'), H('Chef Roberto Godi'), sub('the last touch is always his')),
    caption: 'Meet the team: chef Roberto Godi. The last touch is always his.',
    hashtags: tags('#chef', '#team', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
];
