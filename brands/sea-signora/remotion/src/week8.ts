import type {Block, Overlay, Scene, Story} from './types';

// Week 16–22.11 — a regular content-plan week, NOT about the birthday (client 16.11). From the birthday night only
// seated guests, the room and the kitchen (steady windows by measured camera shift). Material from the latest folders,
// never used in stories: Blackout Night 29.10 pro photos (flambé, guests, cocktails, aquarium), the team portraits from
// «Newspaper» (chef Roberto, sous chef Federico, Antonio), the Holy Shell candle being packed (TCC), panettone #91 / #56,
// the Tomahawk, Shooting 9 #44, Akami #113. Account style (as week7): ivory Skanaus + mono, orange kickers.
// Three a day (video first). Link chips on three days only: Thu (reserve), Fri (book a table), Sun (the candle).

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
const HOURS_WE = '12:30—15:30 | 19:00—00:00';

export const week8: Story[] = [
  // ───────────────────────── Mon 16.11 · the week starts
  {
    id: 'W8-1mon-1v-open-kitchen', day: 'Mon 16.11', rubric: 'Кухня · часы недели', music: silent,
    scenes: [v('nm0671', 15.7, 5), v('nm0681', 6.5, 5.2)],
    overlay: top(H('Open kitchen'), gap(6), {t: 'list', items: ['monday—friday 19:00—00:00', `saturday—sunday ${HOURS_WE}`], size: 28}),
    caption: 'Open kitchen. Monday to Friday 19:00–00:00, Saturday and Sunday 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#openkitchen', '#pasta', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  {
    id: 'W8-1mon-2p-chef', day: 'Mon 16.11', rubric: 'Команда · шеф', music: silent,
    scenes: [ph('npchefRoberto', 7, {fy: 40})],
    overlay: bottom(kick('meet the team'), H('Chef Roberto Godi'), sub('the head of our kitchen')),
    caption: 'Meet the team: chef Roberto Godi, the head of our kitchen.',
    hashtags: tags('#chef', '#team', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-1mon-3p-from-the-rain', day: 'Mon 16.11', rubric: 'Адрес · вход', music: silent,
    scenes: [ph('p0194', 7, {fy: 55})],
    overlay: top(H('Come in\nfrom the rain', 70), sub('via fiori chiari, 32 · from 19:00')),
    caption: 'Come in from the rain: Via Fiori Chiari 32, Brera, from 19:00.',
    hashtags: tags('#brera', '#milano', '#viafiorichiari'), ctaVariants: ['reserve', 'book a table'],
  },


  // ───────────────────────── Tue 17.11 · the table
  {
    id: 'W8-2tue-1v-akami', day: 'Tue 17.11', rubric: 'Блюдо-герой · видео', music: silent,
    scenes: [v('nm0638', 0.9, 4.5, {shift: 140}), v('nm0639', 3.0, 5.5, {shift: 140})],
    overlay: top(kick('on the menu'), H('Akami'), sub('culatello e porcini')),
    caption: 'Akami, culatello e porcini: on the menu at Sea, Signora.',
    hashtags: tags('#tuna', '#akami', '#chef', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  {
    id: 'W8-2tue-2p-tonights-choice', day: 'Tue 17.11', rubric: 'Гости · меню', music: silent,
    scenes: [ph('p0289', 7, {fy: 55})],
    overlay: top(H("Tonight's choice"), sub('the hardest decision of the day')),
    caption: "Tonight's choice: the hardest decision of the day.",
    hashtags: tags('#menu', '#dinner', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  {
    id: 'W8-2tue-3v-your-problem', day: 'Tue 17.11', rubric: 'Your problem / Our solution', music: silent,
    scenes: [],
    chat: [
      {problem: "it's cold outside", solution: 'w9/p0205.jpg'},
      {problem: 'my friends never agree', solution: 'w9/p0322.jpg'},
      {problem: 'i need a little drama', solution: 'w9/bo350.jpg'},
    ],
    caption: 'Cold outside, indecisive friends, a need for drama: we have solutions.',
    hashtags: tags('#brera', '#milano', '#milanofood'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Wed 18.11 · midweek
  {
    id: 'W8-3wed-1v-polpo', day: 'Wed 18.11', rubric: 'Блюдо-герой · сборка', music: silent,
    scenes: [v('nm0656', 4.3, 5), v('nm0660', 1.0, 5)],
    overlay: top(kick('on the menu'), H('Polpo'), sub('zucca, nocciole e scorzanera')),
    caption: 'Polpo, zucca, nocciole e scorzanera: on the menu at Sea, Signora.',
    hashtags: tags('#polpo', '#octopus', '#chef', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  {
    id: 'W8-3wed-2p-panettone-dressed', day: 'Wed 18.11', rubric: 'Панеттоне · десерт', music: silent,
    scenes: [ph('pan91', 7, {fy: 62})],
    overlay: top(kick('panettone season'), H('Dressed for dessert'), sub('cherries & crema')),
    caption: 'Panettone, dressed for dessert: cherries and crema. Panettone season at Sea, Signora.',
    hashtags: tags('#panettone', '#dessert', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-3wed-3p-sous-chef', day: 'Wed 18.11', rubric: 'Команда · су-шеф', music: silent,
    scenes: [ph('npFedericosouschef', 7, {fy: 30, shift: 300})],
    overlay: top(kick('meet the team'), H('Federico'), sub('sous chef, sharp knives only')),
    caption: 'Meet the team: Federico, our sous chef. Sharp knives only.',
    hashtags: tags('#souschef', '#team', '#kitchen'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Thu 19.11 · the bar
  {
    id: 'W8-4thu-1v-at-the-bar', day: 'Thu 19.11', rubric: 'Бар · вечер + кнопка', music: silent,
    scenes: [v('2618', 0.6, 5.2), v('2668', 2.4, 5)],
    overlay: top(kick('thursday'), H('Meet me at the bar'), sub('from 19:00')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Thursday: meet me at the bar, from 19:00.',
    hashtags: tags('#bar', '#cocktails', '#aperitivo', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-4thu-2p-something-red', day: 'Thu 19.11', rubric: 'Коктейль · фото', music: silent,
    scenes: [ph('bo347', 7, {fy: 45})],
    overlay: bottom(H('Something red'), sub('ask the bar')),
    caption: 'Something red? Ask the bar.',
    hashtags: tags('#cocktails', '#bar', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-4thu-3p-founder', day: 'Thu 19.11', rubric: 'Команда · основатель', music: silent,
    scenes: [ph('npAntonio2', 7, {fy: 35})],
    overlay: bottom(kick('meet the team'), H('Antonio Fresa'), sub('founder, host, first to say cin cin')),
    caption: 'Meet the team: Antonio Fresa, our founder. Host, and always the first to say cin cin.',
    hashtags: tags('#founder', '#hospitality', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Fri 20.11 · fire
  {
    id: 'W8-5fri-1v-friday', day: 'Fri 20.11', rubric: 'Атмосфера · пятница', music: silent,
    scenes: [v('2680', 6.8, 5), v('2687', 3.4, 5)],
    overlay: top(kick('friday'), H('Busy & we love it')),
    caption: 'Friday night: busy and we love it.',
    hashtags: tags('#friday', '#fullhouse', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-5fri-2p-fuoco', day: 'Fri 20.11', rubric: 'Фламбе · огромное слово', music: silent,
    scenes: [ph('bo387', 7, {fy: 50})],
    overlay: top(giant('Fuoco', 210), sub('flambé, at your table')),
    caption: 'Fuoco: flambé, right at your table.',
    hashtags: tags('#flambe', '#tableside', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W8-5fri-3p-tomahawk', day: 'Fri 20.11', rubric: 'Бистекка · фото + кнопка', music: silent,
    scenes: [ph('steak1', 7, {fy: 60})],
    overlay: top(kick('for two'), H("Share it.\nOr don't.", 70), sub('the tomahawk')),
    cta: {label: 'book a table', color: 'orange'},
    caption: "The Tomahawk, for two. Share it. Or don't.",
    hashtags: tags('#tomahawk', '#steak', '#weekend', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sat 21.11 · weekend
  {
    id: 'W8-6sat-1v-saturday', day: 'Sat 21.11', rubric: 'Атмосфера · часы выходных', music: silent,
    scenes: [v('2643', 3.1, 5), v('2700', 1.3, 5)],
    overlay: top(kick('saturday'), H('Two services today'), sub(HOURS_WE)),
    caption: 'Saturday, two services: 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#saturday', '#weekend', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-6sat-2p-good-company', day: 'Sat 21.11', rubric: 'Гости · окно', music: silent,
    scenes: [ph('bo199', 7, {window: WIN, fy: 50})],
    overlay: top(H('Good company'), sub('the best thing on the table')),
    caption: 'Good company: the best thing on the table.',
    hashtags: tags('#friends', '#saturday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-6sat-3p-king-crab', day: 'Sat 21.11', rubric: 'Продукт · шеф', music: silent,
    scenes: [ph('npchefRoberto3', 7, {fy: 30, shift: 300})],
    overlay: top(kick('king crab'), H('Hands on'), sub('cicatelli with king crab, on the menu')),
    caption: 'King crab, hands on. Puglian cicatelli with king crab, on the menu.',
    hashtags: tags('#kingcrab', '#pasta', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sun 22.11 · slow sunday
  {
    id: 'W8-7sun-1v-holy-shell', day: 'Sun 22.11', rubric: 'Свеча · заливка + кнопка', music: silent,
    scenes: [v('nm0759', 8.8, 4), v('nm0774', 0.2, 3.2), v('nm0778', 1.0, 3.3)],
    overlay: top(kick('holy shell'), H('Poured by hand'), sub('our candle by the candle cluub')),
    cta: {label: 'shop the candle', color: 'orange'},
    caption: 'Poured by hand: Holy Shell, our limited-edition candle by The Candle Cluub. A little piece of the sea, at home.',
    hashtags: tags('#candle', '#holyshell', '#thecandlecluub', '#gift'), ctaVariants: ['shop the candle', 'get yours'],
  },

  {
    id: 'W8-7sun-2p-golden', day: 'Sun 22.11', rubric: 'Панеттоне · огромное слово', music: silent,
    scenes: [ph('pan56', 7)],
    overlay: top(kick('panettone season'), giant('Golden'), sub('at sea, signora')),
    caption: 'Golden. Panettone season at Sea, Signora.',
    hashtags: tags('#panettone', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W8-7sun-3p-sunday-slow', day: 'Sun 22.11', rubric: 'Аквариум · часы', music: silent,
    scenes: [ph('bo157', 7, {fy: 50})],
    overlay: top(H('Sunday, slow'), sub(HOURS_WE)),
    caption: 'Sunday, slow. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#sunday', '#aquarium', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
];
