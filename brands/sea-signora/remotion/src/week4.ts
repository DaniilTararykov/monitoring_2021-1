import type {Block, Overlay, Scene, Story} from './types';

// Week 26.10–01.11. Client notes (26.10):
// - every day is one chapter of 4 stories that continue each other (video → still → video → still,
//   published in this order); the last one teases tomorrow;
// - more variety, nothing repeated: every clip / photo source is used ONCE in the week, one shot per
//   video, and the formats change (window frame, type-only card, giant word, list, text that changes
//   inside one shot, Your problem / Our solution, Google review card, big-number address card);
// - only videos and static images (PNG); videos are silent (music is added in Instagram);
// - link chips on 3 days only (Tue, Thu, Sat), never more than one a day.
// Sources: Drive folder 11hO5oumK3yZxVNRC8SDAn0LgqwPlxRzS, best vertical clips only.
// Videos: stabilized segments in public/videos/w4 (tools/stabilize.sh, start at 0).
// Photos: sharpest clean frame in public/photos/w4 (tools/best_still.py); night.jpg = plain night card.

const S = 30;
const v = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.mp4`, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const at = (y: number, ...blocks: Block[]): Overlay => ({position: 'top', y, anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text});
const giant = (text: string, size = 150, raw = false): Block => ({t: 'giant', text, size, raw});
const gap = (px: number): Block => ({t: 'gap', px});
// teaser for the next day under the main text: brand orange on photos, night on the olive card
const next = (text: string, color: 'orange' | 'night' = 'orange'): Block[] => [gap(26), {t: 'kicker', text: `tomorrow · ${text}`, color}];
const silent = 'none';

export const week4: Story[] = [
  // ───────────────────────── Mon 26.10 · the vibe
  {
    id: 'W4-1mon-1v-this-is-sea-signora', day: 'Mon 26.10', rubric: 'Атмосфера · кадр в окне', music: silent,
    scenes: [v('aquarium-room', 8, {window: {top: 560, bottom: 430, side: 80}})],
    overlay: top(kick('this is'), {t: 'wordmark'}, sub('warm, loud, alive')),
    caption: 'This is Sea, Signora: warm, loud, alive.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanonight'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-1mon-2p-doors-open', day: 'Mon 26.10', rubric: 'График · текстовая карточка', music: silent,
    scenes: [ph('night', 6)],
    overlay: at(620, kick('doors open at'), giant('19:00', 150, true), gap(46), {t: 'hours', mode: 'compact'}),
    caption: 'Doors open at 19:00. Mon–Fri 19:00–00:00, Sat–Sun 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#brera', '#milano', '#seafoodmilano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-1mon-3v-look-up', day: 'Mon 26.10', rubric: 'Атмосфера · огромное слово', music: silent,
    scenes: [v('lamp-room', 6.2, {rate: 0.58})],
    overlay: bottom(giant('Look up', 130), sub('the room is part of the dinner')),
    caption: 'Look up: the room is part of the dinner.',
    hashtags: ['#seasignora', '#interiordesign', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-1mon-4p-autumn-arrived', day: 'Mon 26.10', rubric: 'Сезон · статика · анонс завтра', music: silent,
    scenes: [ph('pumpkins-curtain2', 6, {fy: 40})],
    overlay: top(H('Autumn arrived'), sub('red velvet & white pumpkins'), ...next('the raw bar')),
    caption: 'Autumn arrived at Sea, Signora: red velvet and white pumpkins. Tomorrow, the raw bar.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },

  // ───────────────────────── Tue 27.10 · fresh produce
  {
    id: 'W4-2tue-1v-from-the-aquarium', day: 'Tue 27.10', rubric: 'Свежие продукты · текст снизу', music: silent,
    scenes: [v('lobster-live', 6.5, {rate: 0.7})],
    overlay: bottom(kick('from the aquarium'), H('To the raw bar')),
    caption: 'From our aquarium to the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#lobster', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-2p-on-ice', day: 'Tue 27.10', rubric: 'Свежие продукты · список', music: silent,
    scenes: [ph('seafood-ice2', 6, {shift: 640})],
    overlay: top(H('On ice'), gap(24), {t: 'list', items: ['gillardeau oysters', 'red prawns from mazara', 'carabineros', 'langoustines']}),
    caption: 'On ice: Gillardeau oysters, red prawns from Mazara, carabineros, langoustines.',
    hashtags: ['#seasignora', '#rawbar', '#oysters', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-3v-built-to-share', day: 'Tue 27.10', rubric: 'Сырой бар · плато', music: silent,
    scenes: [v('plateau-hands', 6.3, {rate: 0.7})],
    overlay: top(H('Built to share'), sub('oysters, prawns & crudo')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Oysters, prawns and crudo on one plateau. Built to share, rarely shared.',
    hashtags: ['#seasignora', '#rawbar', '#plateau', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-4p-red-and-blue', day: 'Tue 27.10', rubric: 'Сырой бар · статика · анонс завтра', music: silent,
    scenes: [ph('prawns-lobster', 6, {shift: 300})], // photo pushed down: a night band keeps the orange teaser readable
    overlay: top(H('Red & blue'), sub('red prawns · blue lobster'), ...next('the open kitchen')),
    caption: 'Red prawns and blue lobster: the raw bar in two colours. Tomorrow, the open kitchen.',
    hashtags: ['#seasignora', '#rawbar', '#lobster', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Wed 28.10 · the open kitchen
  {
    id: 'W4-3wed-1v-kitchen-wakes-up', day: 'Wed 28.10', rubric: 'Кухня · текст меняется в одном плане', music: silent,
    scenes: [
      v('kitchen-wide', 3, {start: 0, overlay: top(giant('19:00', 150, true))}),
      v('kitchen-wide', 3, {start: 3, overlay: top(H('The kitchen wakes up'))}),
    ],
    caption: '19:00 — the open kitchen wakes up.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4-3wed-2p-made-in-front-of-you', day: 'Wed 28.10', rubric: 'Кухня · кадр в окне', music: silent,
    scenes: [ph('kitchen-pan', 6, {window: {top: 470, bottom: 470, side: 70}, overlay: bottom(sub('the open kitchen · every night'))})],
    overlay: top(H('Made in front of you')),
    caption: 'Made in front of you, in the open kitchen, every night.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-3wed-3v-fire', day: 'Wed 28.10', rubric: 'Кухня · огромное слово', music: silent,
    scenes: [v('grill', 6.4, {rate: 0.7, fy: 60})],
    overlay: bottom(giant('Fire'), sub('main & grill')),
    caption: 'Fire. Main & grill, straight from the open kitchen.',
    hashtags: ['#seasignora', '#grill', '#openkitchen', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-3wed-4p-last-touch', day: 'Wed 28.10', rubric: 'Кухня · статика · анонс завтра', music: silent,
    scenes: [ph('plating', 6)],
    overlay: top(H('Last touch from the chef'), ...next('after dark')),
    caption: 'Last touch from the chef. Tomorrow, after dark.',
    hashtags: ['#seasignora', '#chef', '#openkitchen', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Thu 29.10 · after dark (the only Blackout Night touch of the week)
  {
    id: 'W4-4thu-1v-blackout-tonight', day: 'Thu 29.10', rubric: 'Вечер · единственное касание события', music: silent,
    // framed in a window so the link chip sits on night, not on the candle label
    scenes: [
      v('candles-red', 5.5, {window: {top: 470, bottom: 520, side: 64}}),
      {src: 'reel/candle-light.mp4', start: 2.6, frames: 4 * S, window: {top: 470, bottom: 520, side: 64}, fy: 30},
    ],
    overlay: top(kick('tonight from 19:00'), H('Blackout Night'), sub('by candlelight · the candle cluub')),
    cta: {label: 'secure your spot', color: 'orange'},
    caption: 'Tonight the lights go down: Blackout Night by candlelight with the candle cluub, from 19:00.',
    hashtags: ['#seasignora', '#blackoutnight', '#brera', '#milanonight'], ctaVariants: ['secure your spot', 'reserve'],
  },
  {
    id: 'W4-4thu-2p-busy-and-we-love-it', day: 'Thu 29.10', rubric: 'Вечер · статика', music: silent,
    scenes: [ph('laughing', 6)],
    overlay: top(H('Busy & we love it')),
    caption: 'Busy, and we love it.',
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['reserve', 'secure your table'],
  },
  {
    id: 'W4-4thu-3v-full-room', day: 'Thu 29.10', rubric: 'Вечер · полный зал · текст снизу', music: silent,
    scenes: [v('room-chandelier', 7.5)],
    overlay: bottom(H('Nothing beats a full room')),
    caption: 'Full room, chandeliers on, aquarium glow. Nothing beats it.',
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['secure your table', 'reserve'],
  },
  {
    id: 'W4-4thu-4p-the-kind-of-night', day: 'Thu 29.10', rubric: 'Вечер · текстовая карточка · анонс завтра', music: silent,
    scenes: [ph('night', 6)],
    overlay: at(760, H("The kind of night\nyou don't want to end", 66), gap(30), {t: 'rule'}, ...next('hospitality')),
    caption: "The kind of night you don't want to end. Tomorrow, hospitality.",
    hashtags: ['#seasignora', '#milanonight', '#brera', '#hospitality'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Fri 30.10 · hospitality & service
  {
    id: 'W4-5fri-1v-hospitality', day: 'Fri 30.10', rubric: 'Ценности · сервис', music: silent,
    scenes: [v('service-apron', 6.2, {rate: 0.8})],
    overlay: top(H('Hospitality is\nour favorite course', 60)),
    caption: 'Hospitality is our favorite course.',
    hashtags: ['#seasignora', '#hospitality', '#service', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-5fri-2p-google-review', day: 'Fri 30.10', rubric: 'Отзыв Google (1 в неделю) · карточка', music: silent,
    scenes: [ph('room-9239', 6, {window: {top: 500, bottom: 900, side: 64}, overlay: top({t: 'wordmark'}, {t: 'note', text: 'google review'})})],
    overlay: at(1080, {t: 'stars'}, {
      t: 'review',
      text: 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.',
      author: 'S C',
    }),
    caption: 'Thank you for the kind words — see you soon.',
    hashtags: ['#seasignora', '#review', '#brera', '#milanorestaurants'], ctaVariants: ['make a reservation', 'book a table'],
  },
  {
    id: 'W4-5fri-3v-set-for-you', day: 'Fri 30.10', rubric: 'Ценности · сервис · текст снизу', music: silent,
    scenes: [v('service', 6.1, {rate: 0.75})],
    overlay: bottom(H('Set for you'), sub('every table, every night')),
    caption: 'Every table, every night: set for you.',
    hashtags: ['#seasignora', '#hospitality', '#service', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4-5fri-4p-your-problem', day: 'Fri 30.10', rubric: 'Your problem / Our solution · анонс завтра', music: silent,
    scenes: [],
    chat: [
      {problem: "it's friday", solution: 'w4/bottles.jpg'},
      {problem: "can't pick one dish", solution: 'w4/plateau.jpg'},
    ],
    overlay: at(1240, ...next('the weekend', 'night')),
    caption: "It's Friday and you can't pick one dish? We have solutions.",
    hashtags: ['#seasignora', '#fridaynight', '#brera', '#milano'], ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Sat 31.10 · the weekend & creative
  {
    id: 'W4-6sat-1v-weekends', day: 'Sat 31.10', rubric: 'График выходных', music: silent,
    scenes: [v('pumpkins-curtain', 6.3, {rate: 0.7, fy: 60})],
    overlay: top(H('Weekends'), gap(10), {t: 'hours', mode: 'weekend'}),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Weekends at Sea, Signora: 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#weekend', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-6sat-2p-the-wine-wall', day: 'Sat 31.10', rubric: 'Бар · вино · статика', music: silent,
    scenes: [ph('wine', 6, {scale: 1.35, fy: 25})],
    overlay: top(H('The wine wall'), sub('red, white & everything in between')),
    caption: 'The wine wall: red, white and everything in between.',
    hashtags: ['#seasignora', '#wine', '#brera', '#milano'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-6sat-3v-mirror', day: 'Sat 31.10', rubric: 'Креатив · зеркало', music: silent,
    scenes: [v('mirror', 7, {rot: 9, scale: 1.5, fx: 54, fy: 54})], // the mirror hangs at an angle: level the reflection
    overlay: top(H('Mirror mirror'), sub('the best table is the one you booked')),
    caption: 'Mirror, mirror: the best table is the one you booked.',
    hashtags: ['#seasignora', '#brera', '#milanonight', '#interiordesign'], ctaVariants: ['secure your table', 'book a table'],
  },
  {
    id: 'W4-6sat-4p-look-closer', day: 'Sat 31.10', rubric: 'Креатив · статика · анонс завтра', music: silent,
    scenes: [ph('decor-octopus', 6, {fy: 40})],
    overlay: bottom(H('Look closer'), sub('every corner has a story'), ...next('slow sunday')),
    caption: 'Look closer: every corner of the room has a story. Tomorrow, slow Sunday.',
    hashtags: ['#seasignora', '#interiordesign', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },

  // ───────────────────────── Sun 01.11 · slow Sunday & the address
  {
    id: 'W4-7sun-1v-slow-sunday', day: 'Sun 01.11', rubric: 'Воскресенье · график', music: silent,
    scenes: [v('hydrangea', 6.8, {rate: 0.8})],
    overlay: top(H('Slow Sunday'), sub('12:30–15:30 & 19:00–00:00')),
    caption: 'Slow Sunday in Brera. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#sunday', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-7sun-2p-address', day: 'Sun 01.11', rubric: 'Адрес · большая цифра', music: silent,
    scenes: [ph('room-9212', 6, {window: {top: 860, bottom: 420, side: 140}})],
    overlay: top(kick('find us at'), giant('32'), H('Via Fiori Chiari'), sub('brera · milano')),
    caption: 'Find us in the heart of Brera: Via Fiori Chiari, 32.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanorestaurants'], ctaVariants: ['book a table', 'make a reservation'],
  },
  {
    id: 'W4-7sun-3v-autumn-edition', day: 'Sun 01.11', rubric: 'Сезон · вордмарк', music: silent,
    scenes: [v('pumpkins-card', 6)],
    overlay: top(kick('autumn edition'), {t: 'wordmark'}),
    caption: 'Sea, Signora, autumn edition.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-7sun-4p-same-time-next-week', day: 'Sun 01.11', rubric: 'Финал недели · статика', music: silent,
    scenes: [ph('pumpkins-gold', 6, {scale: 1.25, fy: 75})],
    overlay: top(H('Same time next week'), sub('sea, signora · brera')),
    caption: 'That was the week at Sea, Signora. Same time next week.',
    hashtags: ['#seasignora', '#brera', '#milano', '#autumn'], ctaVariants: ['book a table', 'reserve'],
  },
];
