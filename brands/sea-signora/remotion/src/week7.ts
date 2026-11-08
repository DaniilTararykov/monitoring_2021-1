import type {Block, Overlay, Scene, Story} from './types';

// Week 09–15.11 (client 08.11). The account's own style (as week6c): full-frame photo/video, ivory text on the soft
// night gradient, Skanaus + mono, orange labels and link chips. Every story a different format.
//  · Mon–Tue: the birthday (Thu 12.11) pushed hard, link chip both days.
//  · Panettone (Shooting 2, Christmas set) Wed, Fri, Sun. Bistecca: the Tomahawk (client's photos + chef carving) Thu, Sat.
//  · Lifestyle: LIFE clips from the Dim sum night (folder 19XQ0c6…, never used; the clips with burnt-in text skipped),
//    Shooting 9 photos (never used).
// Link chips: Mon, Tue (reserve), Fri (book a table). Silent videos, 10–13 s.

const S = 30;
const v = (name: string, start: number, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.mp4`, start, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w8/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const center = (...blocks: Block[]): Overlay => ({position: 'center', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text, color: 'orange'});
const giant = (text: string, size = 220): Block => ({t: 'giant', text, size});
const gap = (px: number): Block => ({t: 'gap', px});
const silent = 'none';
const tags = (...t: string[]) => ['#seasignora', ...t];

export const week7: Story[] = [
  // ───────────────────────── Mon 09.11 · birthday
  {
    id: 'W7-1mon-1v-one', day: 'Mon 09.11', rubric: 'ДР · огромное слово + кнопка', music: silent,
    scenes: [v('2054', 0.3, 6), v('2078', 0.5, 6)],
    overlay: top(kick('this thursday'), H('Sea, Signora\nturns one', 70), sub('12 november · from 19:00')),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'This Thursday, Sea, Signora turns one. 12 November from 19:00: come celebrate with us.',
    hashtags: tags('#birthday', '#oneyear', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7-1mon-2p-whats-on', day: 'Mon 09.11', rubric: 'ДР · список программы на фото', music: silent,
    scenes: [ph('sh145', 7, {fy: 45})],
    overlay: bottom(kick('12.11 · one year'), H("What's on"), gap(8),
      {t: 'list', items: ['19:00 aperitivo, welcome drinks & dj', '19:30 the tuna show', '22:00 the cake']}),
    caption: "12 November, what's on: aperitivo, welcome drinks and DJ from 19:00, the Tuna Show at 19:30, the cake at 22:00.",
    hashtags: tags('#birthday', '#tunashow', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Tue 10.11 · birthday
  {
    id: 'W7-2tue-1v-the-evening', day: 'Tue 10.11', rubric: 'ДР · текст меняется на одном плане + кнопка', music: silent,
    scenes: [
      v('2042', 0.2, 4, {overlay: top(kick('thursday 12.11'), {t: 'giant', text: '19:00', size: 170, raw: true}, sub('welcome drinks & dj'))}),
      v('2042', 4.2, 4, {overlay: top(kick('thursday 12.11'), {t: 'giant', text: '19:30', size: 170, raw: true}, sub('the tuna show'))}),
      v('2042', 10.5, 4, {overlay: top(kick('thursday 12.11'), {t: 'giant', text: '22:00', size: 170, raw: true}, sub('the cake'))}),
    ],
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Thursday 12.11: welcome drinks and DJ at 19:00, the Tuna Show at 19:30, the cake at 22:00. Welcome and cake are on us.',
    hashtags: tags('#birthday', '#oneyear', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7-2tue-2p-see-you-thursday', day: 'Tue 10.11', rubric: 'ДР · цитата снизу на фото', music: silent,
    scenes: [ph('sh44', 7, {fy: 40})],
    overlay: bottom(H('See you\nThursday', 80), sub('one year of sea, signora · 12.11')),
    caption: 'See you Thursday. One year of Sea, Signora, 12 November.',
    hashtags: tags('#birthday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Wed 11.11
  {
    id: 'W7-3wed-1p-panettone-season', day: 'Wed 11.11', rubric: 'Панеттоне · сезон', music: silent,
    scenes: [ph('pan58', 7, {fy: 55})],
    overlay: top(H("It's panettone\nseason", 70), sub('at sea, signora')),
    caption: "It's panettone season at Sea, Signora.",
    hashtags: tags('#panettone', '#christmas', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7-3wed-2v-by-hand', day: 'Wed 11.11', rubric: 'Кухня · лайфстайл', music: silent,
    scenes: [v('2073', 0.5, 12)],
    overlay: top(H('By hand'), sub('every fold, every plate')),
    caption: 'By hand: every fold, every plate.',
    hashtags: tags('#openkitchen', '#chef', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Thu 12.11
  {
    id: 'W7-4thu-1v-tomahawk-carve', day: 'Thu 12.11', rubric: 'Бистекка · окно', music: silent,
    scenes: [v('carve', 2, 11, {window: {top: 470, bottom: 400, side: 64}, fy: 92})],
    overlay: top(kick('our grill'), H('The Tomahawk'), sub('dry-aged 45 days · osetra caviar')),
    caption: 'The Tomahawk: Scotch beef dry-aged 45 days, Osetra black caviar and pomegranate demi-glace.',
    hashtags: tags('#tomahawk', '#steak', '#caviar', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7-4thu-2v-full-house', day: 'Thu 12.11', rubric: 'Атмосфера · аквариум', music: silent,
    scenes: [v('2070', 0.3, 5.8), v('2065', 9, 6)],
    overlay: bottom(H('Full house'), sub('and the night is young')),
    caption: 'Full house, and the night is young.',
    hashtags: tags('#fullhouse', '#aquarium', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Fri 13.11
  {
    id: 'W7-5fri-1v-panettone-steps', day: 'Fri 13.11', rubric: 'Панеттоне · серия «шаги»', music: silent,
    scenes: [
      ph('pan71', 3.5, {overlay: top(kick('step one'), H('Slice'))}),
      ph('pan84', 3.5, {overlay: top(kick('step two'), H('Pour'))}),
      ph('pan93', 4, {overlay: top(kick('step three'), H("Don't share"))}),
    ],
    caption: "Slice, pour, don't share. Panettone season at Sea, Signora.",
    hashtags: tags('#panettone', '#dessert', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7-5fri-2p-plateau', day: 'Fri 13.11', rubric: 'Raw bar · руки + кнопка', music: silent,
    scenes: [ph('sh162', 7, {fy: 50})],
    overlay: top(kick('friday'), H('One plateau,\nmany hands', 66), sub('oysters · langoustines · red prawns')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Friday: one plateau, many hands. Oysters, langoustines and red prawns from our raw bar.',
    hashtags: tags('#rawbar', '#oysters', '#plateau', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sat 14.11
  {
    id: 'W7-6sat-1p-weekend-plans', day: 'Sat 14.11', rubric: 'Бистекка · фото', music: silent,
    scenes: [ph('steak2', 7, {fy: 60})],
    overlay: top(kick('weekend plans'), H('Steak, caviar,\npotatoes', 66)),
    caption: 'Weekend plans: steak, caviar, potatoes. The Tomahawk is on our grill menu.',
    hashtags: tags('#tomahawk', '#steak', '#weekend', '#brera'), ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W7-6sat-2v-saturday', day: 'Sat 14.11', rubric: 'Лайфстайл · гости', music: silent,
    scenes: [v('2067', 3, 7), v('2056', 0.3, 3.5)],
    overlay: center({t: 'note', text: 'saturday at'}, {t: 'wordmark', size: 110}),
    caption: 'Saturday at Sea, Signora.',
    hashtags: tags('#saturday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Sun 15.11
  {
    id: 'W7-7sun-1p-panettone-sunday', day: 'Sun 15.11', rubric: 'Панеттоне · подарок', music: silent,
    scenes: [ph('pan51', 7, {fy: 70})],
    overlay: top(H('Sunday,\nsomething sweet', 70), sub('panettone at sea, signora')),
    caption: 'Sunday, something sweet: panettone at Sea, Signora.',
    hashtags: tags('#panettone', '#sunday', '#brera'), ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W7-7sun-2v-two-services', day: 'Sun 15.11', rubric: 'Часы · воскресенье', music: silent,
    scenes: [v('2068', 0.3, 10.5, {rate: 0.8})],
    overlay: top({t: 'wordmark'}, gap(20), sub('sunday'), sub('12:30—15:30 | 19:00—00:00')),
    caption: 'Open today: 12:30–15:30 and 19:00–00:00.',
    hashtags: tags('#sunday', '#brera', '#milano'), ctaVariants: ['reserve', 'book a table'],
  },
];
