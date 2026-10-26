import type {Block, Overlay, Scene, Story} from './types';

// Week 26.10–01.11. Client notes (26.10): every day is one chapter of 4 stories that continue each
// other (video → still → video → still, published in this order); the last one teases tomorrow.
// Themes across the week: vibe, fresh produce, the open kitchen, the night (+ the one Blackout
// Night touch), hospitality & service, the weekend & creative, slow Sunday & the address.
// Only videos and static images (PNG). Videos are silent: the client adds music in Instagram.
// Link chips on 3 days only (Tue, Thu, Sat), never more than one a day.
// Sources: Drive folder 11hO5oumK3yZxVNRC8SDAn0LgqwPlxRzS, best vertical clips only.
// Videos: stabilized segments in public/videos/w4 (tools/stabilize.sh, start at 0).
// Photos: sharpest clean frame in public/photos/w4 (tools/best_still.py).
// Horizons checked on a grid; rot/scale where a frame needs levelling or a tighter crop.

const S = 30;
const v = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.mp4`, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const bottom = (...blocks: Block[]): Overlay => ({position: 'bottom', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text});
const giant = (text: string, size = 150): Block => ({t: 'giant', text, size});
// teaser for the next day, in brand orange, under the main text
const next = (text: string): Block[] => [{t: 'gap', px: 26}, {t: 'kicker', text: `tomorrow · ${text}`, color: 'orange'}];
const silent = 'none';

export const week4: Story[] = [
  // ───────────────────────── Mon 26.10 · the vibe
  {
    id: 'W4-1mon-1v-this-is-sea-signora', day: 'Mon 26.10', rubric: 'Атмосфера · открытие недели', music: silent,
    scenes: [v('aquarium-room', 8.5)],
    overlay: top(kick('this is'), {t: 'wordmark'}, sub('warm, loud, alive')),
    caption: 'This is Sea, Signora: warm, loud, alive. A new week starts by the aquarium.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanonight'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-1mon-2p-look-up', day: 'Mon 26.10', rubric: 'Атмосфера · статика', music: silent,
    scenes: [ph('lamp', 6)],
    overlay: bottom(H('Look up'), sub('the room is part of the dinner')),
    caption: 'Look up: the room is part of the dinner.',
    hashtags: ['#seasignora', '#interiordesign', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-1mon-3v-blue-hour', day: 'Mon 26.10', rubric: 'Атмосфера · график', music: silent,
    scenes: [v('room-9212', 7, {rate: 0.8})],
    overlay: top(H('Blue hour'), sub('every night from 19:00')),
    caption: 'Blue hour by the aquarium, every night from 19:00.',
    hashtags: ['#seasignora', '#aquarium', '#brera', '#milanonight'], ctaVariants: ['reserve', 'secure your table'],
  },
  {
    id: 'W4-1mon-4p-autumn-arrived', day: 'Mon 26.10', rubric: 'Сезон · статика · анонс завтра', music: silent,
    scenes: [ph('pumpkins-curtain', 6, {fy: 60})],
    overlay: top(H('Autumn arrived'), sub('red velvet & white pumpkins'), ...next('the raw bar')),
    caption: 'Autumn arrived at Sea, Signora: red velvet and white pumpkins. Tomorrow, the raw bar.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },

  // ───────────────────────── Tue 27.10 · fresh produce
  {
    id: 'W4-2tue-1v-from-the-aquarium', day: 'Tue 27.10', rubric: 'Свежие продукты · аквариум', music: silent,
    scenes: [v('lobster-live', 4.5), v('seafood-ice', 5)],
    overlay: top(H('From the aquarium'), sub('to the raw bar')),
    caption: 'From our aquarium to the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#lobster', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-2p-fresh-every-day', day: 'Tue 27.10', rubric: 'Свежие продукты · статика', music: silent,
    scenes: [ph('seafood-ice', 6, {fy: 60})],
    overlay: top(H('Fresh every day'), sub('langoustines & red prawns on ice')),
    caption: 'On ice, every day: langoustines and red prawns from the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#seafood', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-3v-built-to-share', day: 'Tue 27.10', rubric: 'Сырой бар · плато', music: silent,
    scenes: [v('plateau-hands', 4.2), v('plateau', 5.5)],
    overlay: top(H('Built to share'), sub('oysters, prawns & crudo')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Oysters, prawns and crudo on one plateau. Built to share, rarely shared.',
    hashtags: ['#seasignora', '#rawbar', '#oysters', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
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
    id: 'W4-3wed-1v-kitchen-wakes-up', day: 'Wed 28.10', rubric: 'Кухня · уровень', music: silent,
    scenes: [v('kitchen-wide', 5.5), v('kitchen-steam', 4.5)],
    overlay: top(kick('19:00'), H('The kitchen wakes up')),
    caption: '19:00 — the open kitchen wakes up.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4-3wed-2p-made-in-front-of-you', day: 'Wed 28.10', rubric: 'Кухня · статика', music: silent,
    scenes: [ph('kitchen-pan', 6)],
    overlay: top(H('Made in front of you'), sub('the open kitchen')),
    caption: 'Made in front of you, in the open kitchen.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-3wed-3v-main-and-grill', day: 'Wed 28.10', rubric: 'Кухня · гриль', music: silent,
    scenes: [v('grill', 4.5, {fy: 60}), v('plating', 2.5)],
    overlay: top(H('Main & grill'), sub('straight from the open kitchen')),
    caption: 'Main & grill, straight from the open kitchen.',
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
    id: 'W4-4thu-2p-the-kind-of-night', day: 'Thu 29.10', rubric: 'Вечер · статика', music: silent,
    scenes: [ph('candles-red', 6)],
    overlay: top(H("The kind of night\nyou don't want to end", 58)),
    caption: "The kind of night you don't want to end.",
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['reserve', 'secure your table'],
  },
  {
    id: 'W4-4thu-3v-full-room', day: 'Thu 29.10', rubric: 'Вечер · полный зал', music: silent,
    scenes: [v('room-chandelier', 5), v('room-aquarium2', 4.5)],
    overlay: top(H('Nothing beats a full room')),
    caption: 'Full room, aquarium glow. Nothing beats it.',
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['secure your table', 'reserve'],
  },
  {
    id: 'W4-4thu-4p-busy-and-we-love-it', day: 'Thu 29.10', rubric: 'Вечер · статика · анонс завтра', music: silent,
    scenes: [ph('laughing', 6)],
    overlay: top(H('Busy & we love it'), ...next('hospitality')),
    caption: 'Busy, and we love it. Tomorrow, hospitality.',
    hashtags: ['#seasignora', '#milanonight', '#brera', '#hospitality'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Fri 30.10 · hospitality & service
  {
    id: 'W4-5fri-1v-hospitality', day: 'Fri 30.10', rubric: 'Ценности · сервис', music: silent,
    scenes: [v('service', 4.5), v('service-apron', 4.8)],
    overlay: top(H('Hospitality is\nour favorite course', 60)),
    caption: 'Hospitality is our favorite course.',
    hashtags: ['#seasignora', '#hospitality', '#service', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-5fri-2p-the-wine-wall', day: 'Fri 30.10', rubric: 'Сервис · вино · статика', music: silent,
    scenes: [ph('wine', 6, {scale: 1.35, fy: 25})],
    overlay: top(H('The wine wall'), sub('red, white & everything in between')),
    caption: 'The wine wall: red, white and everything in between.',
    hashtags: ['#seasignora', '#wine', '#brera', '#milano'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-5fri-3v-pour-decisions', day: 'Fri 30.10', rubric: 'Бар · креатив', music: silent,
    scenes: [v('bottles', 4.5), v('wine', 5, {scale: 1.3, fy: 25})],
    overlay: top(H('Pour decisions'), sub('ask us what to open tonight')),
    caption: 'Pour decisions welcome. Ask us what to open tonight.',
    hashtags: ['#seasignora', '#wine', '#bar', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-5fri-4p-regulars-and-first-timers', day: 'Fri 30.10', rubric: 'Ценности · статика · анонс завтра', music: silent,
    scenes: [ph('room-9239', 6)],
    overlay: top(H('Regulars & first-timers'), sub('every table is set for you'), ...next('the weekend')),
    caption: 'Regulars and first-timers: every table is set for you. Tomorrow, the weekend.',
    hashtags: ['#seasignora', '#hospitality', '#brera', '#milano'], ctaVariants: ['reserve', 'book a table'],
  },

  // ───────────────────────── Sat 31.10 · the weekend & creative
  {
    id: 'W4-6sat-1v-weekends', day: 'Sat 31.10', rubric: 'График выходных', music: silent,
    scenes: [v('pumpkins-curtain', 4.3, {fy: 60}), v('pumpkins-card', 4.5)],
    overlay: top(kick('weekends'), {t: 'hours', mode: 'weekend'}),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Weekends at Sea, Signora: 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#weekend', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-6sat-2p-autumn-slowly', day: 'Sat 31.10', rubric: 'Сезон · статика', music: silent,
    scenes: [ph('pumpkins-gold', 6, {scale: 1.25, fy: 75})],
    overlay: top(giant('Autumn', 140), sub('saturday, slowly')),
    caption: 'Autumn, Saturday, slowly.',
    hashtags: ['#seasignora', '#autumn', '#weekend', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
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
    scenes: [v('decor-octopus', 5.5, {fy: 40}), v('decor-table', 4.5)],
    overlay: top(H('Slow Sunday'), sub('12:30–15:30 & 19:00–00:00')),
    caption: 'Slow Sunday in Brera. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#sunday', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-7sun-2p-find-us', day: 'Sun 01.11', rubric: 'Адрес · статика', music: silent,
    scenes: [ph('room-aquarium2', 6)],
    overlay: top(H('Find us in Brera'), sub('via fiori chiari 32')),
    caption: 'Find us in the heart of Brera: Via Fiori Chiari, 32.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanorestaurants'], ctaVariants: ['book a table', 'make a reservation'],
  },
  {
    id: 'W4-7sun-3v-autumn-details', day: 'Sun 01.11', rubric: 'Сезон · детали', music: silent,
    scenes: [v('decor-macro', 3.5), v('hydrangea', 3.5), v('pumpkins-bar', 3.5)],
    overlay: top(H('Autumn details')),
    caption: 'The autumn details all around the room.',
    hashtags: ['#seasignora', '#autumn', '#interiordesign', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-7sun-4p-same-time-next-week', day: 'Sun 01.11', rubric: 'Финал недели · статика', music: silent,
    scenes: [ph('hydrangea', 6)],
    overlay: top(H('Same time next week'), sub('sea, signora · brera')),
    caption: 'That was the week at Sea, Signora. Same time next week.',
    hashtags: ['#seasignora', '#brera', '#milano', '#autumn'], ctaVariants: ['book a table', 'reserve'],
  },
];
