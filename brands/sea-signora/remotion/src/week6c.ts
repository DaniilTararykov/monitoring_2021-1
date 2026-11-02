import type {Block, Overlay, Scene, Story} from './types';

// Week 02–08.11, version «as before» (client 02.11): the account's own story style — full-frame photo or video,
// ivory text in the top third on the soft night gradient, Skanaus + mono, orange link chips — and real variety:
// every story a different format (hours, giant word, Your problem / Our solution, text changing over one shot,
// window, list, quote, montage, address, slow-motion, bar still, announcement), each source used once.
// Footage: the new Drive folder 1T-udQ3… (IMG_9199–9239), never used; stills: Blackout Night shoot, never used.
// Birthday 12.11 twice (Thu list, Sun announcement). Link chips on Fri, Sat, Sun. Silent videos, 10–13 s.

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `nf/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `nf/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const center = (...blocks: Block[]): Overlay => ({position: 'center', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 170): Block => ({t: 'giant', text, size});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week6c: Story[] = [
  // ───────────────────────── Mon 02.11
  {
    id: 'N7-1mon-1v-we-are-open', day: 'Mon 02.11', rubric: 'Часы работы', music: silent,
    scenes: [v('9222', 0.5, 12)],
    overlay: top({t: 'wordmark'}, {t: 'gap', px: 26}, {t: 'hours', mode: 'split'}),
    caption: 'A new week in Brera. Monday to Friday from 19:00, weekends also from 12:30.',
    hashtags: tags('#brera', '#milanorestaurants', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'N7-1mon-2v-fusillone', day: 'Mon 02.11', rubric: 'Блюдо-герой', music: silent,
    scenes: [v('9200', 0.2, 6.8, {shift: 240}), v('9201', 0.3, 5.5, {shift: 240})],
    overlay: top(kick('first courses'), H('Fusillone\nwith seafood', 66)),
    caption: 'Fusillone with seafood, from our first courses.',
    hashtags: tags('#pasta', '#seafood', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Tue 03.11
  {
    id: 'N7-2tue-1v-full', day: 'Tue 03.11', rubric: 'Огромное слово · полный зал', music: silent,
    scenes: [v('9223', 0.2, 10.6, {rate: 0.85})],
    overlay: top(giant('Full'), sub('even on a tuesday')),
    caption: 'Full, even on a Tuesday.',
    hashtags: tags('#fullhouse', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'N7-2tue-2v-your-problem', day: 'Tue 03.11', rubric: 'Your problem / Our solution', music: silent,
    scenes: [],
    chat: [
      {problem: "it's only tuesday", solution: 'nf/343.jpg'},
      {problem: 'i miss the sea', solution: 'nf/156.jpg'},
      {problem: 'i need a date spot', solution: 'nf/019.jpg'},
    ],
    caption: "It's only Tuesday, you miss the sea and you need a date spot? We have solutions.",
    hashtags: tags('#tuesday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Wed 04.11
  {
    id: 'N7-3wed-1v-plateau', day: 'Wed 04.11', rubric: 'Текст меняется на одном плане · raw bar', music: silent,
    scenes: [
      v('9218', 0.2, 3.4, {rate: 0.7, shift: 320, overlay: top(kick('raw bar plateau'), H('Oysters'), sub('gillardeau · perlina del delta'))}),
      v('9218', 2.6, 3.4, {rate: 0.7, shift: 320, overlay: top(kick('raw bar plateau'), H('Langoustines'))}),
      v('9218', 5.0, 3.4, {rate: 0.7, shift: 320, overlay: top(kick('raw bar plateau'), H('Red prawns'), sub('from mazara'))}),
    ],
    caption: 'Oysters, langoustines, red prawns from Mazara: our raw bar plateaux, Sea Signorina and Signora Royale.',
    hashtags: tags('#rawbar', '#oysters', '#plateau', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'N7-3wed-2v-open-kitchen', day: 'Wed 04.11', rubric: 'Кадр в окне · кухня', music: silent,
    scenes: [v('9232', 6, 12, {window: {top: 470, bottom: 400, side: 64}})],
    overlay: top(H('Open kitchen'), sub('nothing to hide, everything to show')),
    caption: 'Open kitchen: nothing to hide, everything to show.',
    hashtags: tags('#openkitchen', '#chef', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Thu 05.11
  {
    id: 'N7-4thu-1v-birthday-list', day: 'Thu 05.11', rubric: 'Список · ДР 12.11', music: silent,
    scenes: [v('9219', 0.2, 12)],
    overlay: top(kick('12 november'), H('One year of\nSea, Signora', 66), {t: 'gap', px: 10},
      {t: 'list', items: ['19:00 aperitivo & dj', '19:30 tuna show', '22:00 the cake']}),
    caption: '12 November: one year of Sea, Signora. Aperitivo and DJ from 19:00, the Tuna Show at 19:30, the cake at 22:00.',
    hashtags: tags('#birthday', '#oneyear', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'N7-4thu-2v-candles-on', day: 'Thu 05.11', rubric: 'Атмосфера · цитата снизу', music: silent,
    scenes: [v('9214', 0.4, 10)],
    overlay: bottom(H('Candles on,\nphones down', 70)),
    caption: 'Candles on, phones down.',
    hashtags: tags('#candlelight', '#dinner', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Fri 06.11
  {
    id: 'N7-5fri-1v-this-is', day: 'Fri 06.11', rubric: 'Нарезка «This is Sea, Signora»', music: silent, transition: 'fade',
    scenes: [v('9212', 0.5, 1.6), v('9226', 1, 1.6), v('9221', 0.4, 1.6), v('9224', 1, 1.6), v('9228', 0.6, 1.6), v('9236', 2, 1.6), v('9213', 0.3, 1.6)],
    overlay: center({t: 'note', text: 'this is'}, {t: 'wordmark', size: 110}),
    caption: 'This is Sea, Signora.',
    hashtags: tags('#brera', '#milano', '#milanorestaurants'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'N7-5fri-2v-find-us', day: 'Fri 06.11', rubric: 'Адрес', music: silent,
    scenes: [v('9220', 1, 11)],
    overlay: top(H('Find us in the\nheart of Brera', 66), sub('via fiori chiari, 32')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Find us in the heart of Brera, Via Fiori Chiari 32.',
    hashtags: tags('#brera', '#viafiorichiari', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Sat 07.11
  {
    id: 'N7-6sat-1v-aquarium-to-ice', day: 'Sat 07.11', rubric: 'Слоу-мо · аквариум и лёд', music: silent,
    scenes: [v('9215s', 0.2, 5.6, {rate: 0.8}), v('9217s', 0.2, 4.8, {rate: 0.8})],
    overlay: top(H('From the aquarium'), sub('to the ice, to your table')),
    caption: 'From the aquarium to the ice, to your table.',
    hashtags: tags('#seafood', '#aquarium', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'N7-6sat-2p-the-bar', day: 'Sat 07.11', rubric: 'Бар · статика', music: silent,
    scenes: [ph('285', 6, {fy: 40})],
    overlay: top(H('Saturday starts\nat the bar', 66), sub('ask for our cocktail menu')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Saturday starts at the bar. Ask for our cocktail menu.',
    hashtags: tags('#cocktails', '#bar', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sun 08.11
  {
    id: 'N7-7sun-1v-turns-one', day: 'Sun 08.11', rubric: 'Анонс · ДР 12.11', music: silent,
    scenes: [v('9231', 0.2, 12)],
    overlay: top({t: 'wordmark', size: 110}, H('turns one', 70), {t: 'rule'}, sub('12 november · from 19:00'), sub('welcome drinks and the cake on us')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Sea, Signora turns one. 12 November from 19:00: welcome drinks and the cake are on us.',
    hashtags: tags('#birthday', '#oneyear', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'N7-7sun-2v-sunday-kitchen', day: 'Sun 08.11', rubric: 'Кухня · воскресенье', music: silent,
    scenes: [v('9238', 3.5, 6.6), v('9234', 6, 4)],
    overlay: top(kick('sunday'), H('Two services'), sub('12:30—15:30 | 19:00—00:00')),
    caption: 'Sunday, two services: 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#sunday', '#openkitchen', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
];
