import type {Block, Overlay, Scene, Story} from './types';

// Week 09–15.11 — third pool (client 08.11: «and something else»). Same account style; new formats for the week and
// only material not used yet: Shooting 9 (nugget box, raw bar, dishes, dessert, the chef), Interior & details (bar),
// the Holy Shell candle being lit (client's clip). Not tied to a day.

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 190): Block => ({t: 'giant', text, size});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week7y: Story[] = [
  {
    id: 'W7Y-01v-nugget-caviar', day: 'pool', rubric: 'Спецпроект · серия «шаги»', music: silent,
    scenes: [
      ph('sh124', 3.6, {fy: 50, overlay: top(kick('step one'), H('Open the box'))}),
      ph('sh133', 3.6, {fy: 50, overlay: top(kick('step two'), H('Caviar & sour cream'))}),
      ph('sh141', 4, {fy: 55, overlay: top(kick('step three'), H('One bite'))}),
    ],
    caption: 'Nugget, caviar and sour cream, in our signature box. Open, dip, one bite.',
    hashtags: tags('#caviar', '#nuggets', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7Y-02v-your-problem', day: 'pool', rubric: 'Your problem / Our solution', music: silent,
    scenes: [],
    chat: [
      {problem: "it's cold outside", solution: 'w8/sh111.jpg'},
      {problem: 'i need a treat', solution: 'w8/sh49.jpg'},
      {problem: 'pasta, please', solution: 'w8/sh21.jpg'},
    ],
    caption: "Cold outside, need a treat, want pasta? We have solutions.",
    hashtags: tags('#brera', '#milano', '#milanofood'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Y-03v-oyster-steps', day: 'pool', rubric: 'Raw bar · три кадра', music: silent,
    scenes: [
      ph('sh154', 3.6, {fy: 45, overlay: top(kick('raw bar'), H('Choose'))}),
      ph('sh160', 3.6, {fy: 40, overlay: top(kick('raw bar'), H('Dress'))}),
      ph('sh165', 4, {fy: 40, overlay: top(kick('raw bar'), H('Slurp'))}),
    ],
    caption: 'Choose, dress, slurp. Oysters of the day from our raw bar.',
    hashtags: tags('#oysters', '#rawbar', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7Y-04v-light-it', day: 'pool', rubric: 'Свеча · зажигаем + кнопка', music: silent,
    scenes: [v('light', 0.2, 10.5, {rate: 0.6, window: {top: 560, bottom: 680, side: 120}})],
    overlay: top(kick('holy shell'), H('Light it at home'), sub('a little piece of the sea, wherever you are')),
    cta: {label: 'shop the candle', color: 'orange', y: 470},
    caption: 'Light it at home: Holy Shell, our limited-edition candle by The Candle Cluub. A little piece of the sea, wherever you are.',
    hashtags: tags('#candle', '#holyshell', '#thecandlecluub'), ctaVariants: ['shop the candle', 'get yours'],
  },
  {
    id: 'W7Y-05p-save-room', day: 'pool', rubric: 'Десерт · цитата снизу', music: silent,
    scenes: [ph('sh175', 7, {fy: 40})],
    overlay: bottom(H('Save room'), sub('dessert is not optional')),
    caption: 'Save room. Dessert is not optional.',
    hashtags: tags('#dessert', '#chocolate', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Y-06p-pull-up-a-stool', day: 'pool', rubric: 'Бар · интерьер', music: silent,
    scenes: [ph('int31', 7, {fx: 55, fy: 50})],
    overlay: top(H('Pull up a stool'), sub('the bar opens at 19:00')),
    caption: 'Pull up a stool. The bar opens at 19:00.',
    hashtags: tags('#bar', '#cocktails', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Y-07p-from-the-kitchen', day: 'pool', rubric: 'Шеф · портрет', music: silent,
    scenes: [ph('sh186', 7, {fy: 35})],
    overlay: bottom(H('From the kitchen,\nwith a smile', 64)),
    caption: 'From the kitchen, with a smile.',
    hashtags: tags('#chef', '#kitchen', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7Y-08p-todays-catch', day: 'pool', rubric: 'Огромное слово · окно', music: silent,
    scenes: [ph('sh36', 7, {window: {top: 760, bottom: 540, side: 64}, fx: 45})],
    overlay: top(kick("today's catch"), giant('Fresh'), sub('straight to the ice')),
    caption: "Today's catch: fresh, straight to the ice.",
    hashtags: tags('#freshfish', '#seafood', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
];
