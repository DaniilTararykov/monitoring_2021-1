import type {Block, Overlay, Scene, Story} from './types';

// Week 16–22.11 — extra pool from folder 1KgFz8ZB… (client 16.11: «you can take from here too»): the autumn decor
// (dried hydrangeas, white pumpkins, the mushroom sculpture), the full room around the aquarium, the open kitchen,
// the whisky shelf, red prawns, risotto. Same style as week9; not tied to a day, picks to swap in. No «?» in headlines.

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w10/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w10/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 220): Block => ({t: 'giant', text, size});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week9x: Story[] = [
  {
    id: 'W9X-01v-autumn-dressed', day: 'extra', rubric: 'Декор · осень', music: silent,
    scenes: [v('kf0093', 4.2, 5), v('kf0094', 6.3, 5)],
    overlay: top(kick('november'), H('Dressed for autumn')),
    caption: 'November at Sea, Signora: dressed for autumn.',
    hashtags: tags('#autumn', '#decor', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-02v-look-closer', day: 'extra', rubric: 'Декор · детали', music: silent,
    scenes: [v('kf0078', 0.2, 5), v('kf0085', 9.9, 5)],
    overlay: top(H('Look closer'), sub('every corner has a story')),
    caption: 'Look closer: every corner has a story.',
    hashtags: tags('#details', '#interior', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-03v-blue-hour', day: 'extra', rubric: 'Атмосфера · аквариум', music: silent,
    scenes: [v('kf0103', 8.9, 5), v('kf0136', 4.1, 5)],
    overlay: top(H('The blue hour'), sub('every night, around the aquarium')),
    caption: 'The blue hour: every night, around the aquarium.',
    hashtags: tags('#aquarium', '#fullhouse', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-04v-open-late', day: 'extra', rubric: 'Кухня · часы', music: silent,
    scenes: [v('kf0113', 7.3, 5.5), v('kf0117', 2.5, 4.5)],
    overlay: top(kick('open kitchen'), H('Cooking until midnight'), sub('19:00—00:00, every day')),
    caption: 'Open kitchen, cooking until midnight. Every evening 19:00–00:00.',
    hashtags: tags('#openkitchen', '#latenight', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-05v-every-table', day: 'extra', rubric: 'Атмосфера · зал', music: silent,
    scenes: [v('kf0111', 19.6, 5), v('kf0110', 7.9, 5)],
    overlay: top(H('Warm, loud, alive'), sub('this is sea, signora')),
    caption: 'Warm, loud, alive: this is Sea, Signora.',
    hashtags: tags('#atmosphere', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-06v-something-stronger', day: 'extra', rubric: 'Бар · после ужина', music: silent,
    scenes: [v('kf0091', 0.2, 4.4, {rate: 0.8}), v('kf0135', 4.7, 5)],
    overlay: top(kick('after dinner'), H('Something stronger')),
    caption: 'After dinner, something stronger. Ask the bar.',
    hashtags: tags('#whisky', '#bar', '#digestivo', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W9X-07p-gambero-rosso', day: 'extra', rubric: 'Сырой бар · фото', music: silent,
    scenes: [ph('k0122', 7, {fy: 50})],
    overlay: top(kick('raw bar'), H('Gambero rosso'), sub('red prawns, served raw')),
    caption: 'Gambero rosso: red prawns, served raw at our raw bar.',
    hashtags: tags('#gamberorosso', '#redprawns', '#rawbar', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9X-08p-red-raw', day: 'extra', rubric: 'Сырой бар · огромное слово', music: silent,
    scenes: [ph('k0119', 7, {fy: 55})],
    overlay: top(giant('Crudo'), sub('as fresh as it gets')),
    caption: 'Crudo, as fresh as it gets.',
    hashtags: tags('#crudo', '#rawbar', '#seafood', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W9X-09p-risotto', day: 'extra', rubric: 'Блюдо · сверху', music: silent,
    scenes: [ph('k0129', 7, {fy: 60})],
    overlay: top(kick('from the kitchen'), H('Risotto,\nslowly', 70)),
    caption: 'From the kitchen: risotto, made slowly.',
    hashtags: tags('#risotto', '#italianfood', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

];
