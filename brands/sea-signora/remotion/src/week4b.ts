import type {Block, Overlay, Scene, Story} from './types';

// Week 26.10–01.11, version 4 (client, 26.10): 2 stories a day, every concept new (nothing from the
// earlier packs repeats), built only from footage that was not used before. Each day = video → still;
// the still teases tomorrow, so the 14 stories read as one chain:
//   the chef will see you now → mise en place → front row → admit one → the hardest decision →
//   order both → dress code: candlelight → in the dark taste gets louder → seen from the bar →
//   velvet hour → bring everyone → eight arms → sunday ritual → to be continued.
// Silent videos (music is added in Instagram), link chips on 3 days only (Tue, Thu, Sat).
// Videos: stabilized segments in public/videos/w4; stills: sharpest clean frame in public/photos/w4.

const S = 30;
const v = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.mp4`, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const center = (...blocks: Block[]): Overlay => ({position: 'center', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text});
const giant = (text: string, size = 150): Block => ({t: 'giant', text, size});
const gap = (px: number): Block => ({t: 'gap', px});
const next = (text: string): Block[] => [gap(26), {t: 'kicker', text: `tomorrow · ${text}`, color: 'orange'}];
const silent = 'none';

export const week4b: Story[] = [
  // ───────────────────────── Mon 26.10
  {
    id: 'W4B-1mon-1v-the-chef-will-see-you-now', day: 'Mon 26.10', rubric: 'Шеф · новый концепт', music: silent,
    scenes: [v('chef-walk', 5.4, {rate: 0.5})],
    overlay: top(kick('monday · from 19:00'), H('The chef will\nsee you now', 66)),
    caption: 'The chef will see you now. Every night from 19:00.',
    hashtags: ['#seasignora', '#chef', '#openkitchen', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4B-1mon-2p-mise-en-place', day: 'Mon 26.10', rubric: 'Сервис · до прихода гостей', music: silent,
    scenes: [ph('mise-en-place', 6)],
    overlay: bottom(H('Mise en place'), sub('your table, before you arrive'), ...next('front row')),
    caption: 'Mise en place: your table, set before you arrive. Tomorrow, front row.',
    hashtags: ['#seasignora', '#miseenplace', '#hospitality', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Tue 27.10
  {
    id: 'W4B-2tue-1v-front-row', day: 'Tue 27.10', rubric: 'Открытая кухня · театр', music: silent,
    scenes: [v('front-row', 6)],
    overlay: top(H('Front row'), sub('the open kitchen is the show')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Front row seats: the open kitchen is the show.',
    hashtags: ['#seasignora', '#openkitchen', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4B-2tue-2p-admit-one', day: 'Tue 27.10', rubric: 'Креатив · билет', music: silent,
    scenes: [ph('pass', 6)],
    overlay: center(kick('admit one'), H('Open kitchen'), {t: 'rule'}, sub('row a · from 19:00'), ...next('the hardest decision')),
    caption: 'Admit one: open kitchen, row A, from 19:00. Tomorrow, the hardest decision.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Wed 28.10
  {
    id: 'W4B-3wed-1v-the-hardest-decision', day: 'Wed 28.10', rubric: 'Гости · меню', music: silent,
    scenes: [v('menu-decision', 6)],
    overlay: bottom(H('The hardest decision'), sub('of the night · take your time')),
    caption: 'The hardest decision of the night. Take your time.',
    hashtags: ['#seasignora', '#menu', '#brera', '#milanofood'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4B-3wed-2p-order-both', day: 'Wed 28.10', rubric: 'Юмор · совет шефа', music: silent,
    scenes: [ph('order-both', 6)],
    overlay: top(kick("chef's advice"), giant('Order both', 118), ...next('lights down')),
    caption: "Chef's advice: order both. Tomorrow, the lights go down.",
    hashtags: ['#seasignora', '#chef', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Thu 29.10 (the Blackout Night touch)
  {
    id: 'W4B-4thu-1v-dress-code-candlelight', day: 'Thu 29.10', rubric: 'Blackout Night · единственное касание', music: silent,
    scenes: [v('candle-dinner', 6)],
    overlay: top(kick('tonight · blackout night'), H('Dress code'), sub('candlelight')),
    cta: {label: 'secure your spot', color: 'orange'},
    caption: 'Tonight, Blackout Night. Dress code: candlelight. From 19:00.',
    hashtags: ['#seasignora', '#blackoutnight', '#brera', '#milanonight'], ctaVariants: ['secure your spot', 'reserve'],
  },
  {
    id: 'W4B-4thu-2p-taste-gets-louder', day: 'Thu 29.10', rubric: 'Вечер · сенсорный концепт', music: silent,
    scenes: [ph('long-candle-table', 6)],
    overlay: center(H('In the dark\ntaste gets louder', 66), ...next('seen from the bar')),
    caption: 'In the dark, taste gets louder. Tomorrow, the view from the bar.',
    hashtags: ['#seasignora', '#candlelight', '#brera', '#milanonight'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Fri 30.10
  {
    id: 'W4B-5fri-1v-seen-from-the-bar', day: 'Fri 30.10', rubric: 'Бар · подсмотрено', music: silent,
    scenes: [v('seen-from-bar', 5.6)],
    overlay: top(H('Seen from the bar'), sub('friday, between the bottles')),
    caption: 'Friday, seen from the bar.',
    hashtags: ['#seasignora', '#bar', '#fridaynight', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4B-5fri-2p-velvet-hour', day: 'Fri 30.10', rubric: 'Атмосфера · красный бархат', music: silent,
    scenes: [ph('red-chandelier', 6)],
    overlay: bottom(giant('Velvet hour', 118), sub('chandeliers on · from 19:00'), ...next('bring everyone')),
    caption: 'Velvet hour: chandeliers on, from 19:00. Tomorrow, bring everyone.',
    hashtags: ['#seasignora', '#brera', '#milanonight', '#interiordesign'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Sat 31.10
  {
    id: 'W4B-6sat-1v-bring-everyone', day: 'Sat 31.10', rubric: 'Компании и события', music: silent,
    scenes: [v('long-table', 6)],
    overlay: top(H('Bring everyone'), sub('long tables & private dinners up to 150')),
    cta: {label: 'make a reservation', color: 'olive'},
    caption: 'Bring everyone: long tables and private dinners for up to 150 guests.',
    hashtags: ['#seasignora', '#privatedining', '#events', '#brera'], ctaVariants: ['make a reservation', 'book a table'],
  },
  {
    id: 'W4B-6sat-2p-eight-arms', day: 'Sat 31.10', rubric: 'Интерьер · юмор', music: silent,
    scenes: [ph('octopus-art', 6, {scale: 1.25, fx: 85})], // crop out the restroom sign on the left
    overlay: bottom(kick('our art director'), H('Has eight arms'), ...next('sunday ritual')),
    caption: 'Our art director has eight arms. Tomorrow, the Sunday ritual.',
    hashtags: ['#seasignora', '#interiordesign', '#art', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },

  // ───────────────────────── Sun 01.11
  {
    id: 'W4B-7sun-1v-sunday-ritual', day: 'Sun 01.11', rubric: 'Воскресенье · график', music: silent,
    scenes: [v('sunday-ritual', 7)],
    overlay: top(H('Sunday ritual'), sub('12:30–15:30 & 19:00–00:00')),
    caption: 'The Sunday ritual: 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#sunday', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4B-7sun-2p-to-be-continued', day: 'Sun 01.11', rubric: 'Финал недели', music: silent,
    scenes: [ph('room-lamp', 6)],
    overlay: top(H('To be continued'), sub('sea, signora · brera')),
    caption: 'This week at Sea, Signora — to be continued.',
    hashtags: ['#seasignora', '#brera', '#milano', '#autumn'], ctaVariants: ['book a table', 'reserve'],
  },
];
