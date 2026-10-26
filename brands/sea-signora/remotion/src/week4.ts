import type {Block, Overlay, Scene, Story} from './types';

// Week 26.10–01.11 — a mix of themes (not an event week): every day 2 video stories (v),
// 2 static creatives (p, rendered as PNG) and 2 photo cuts made of static frames (n).
// Sources: Drive folder 11hO5oumK3yZxVNRC8SDAn0LgqwPlxRzS, best clips only, vertical only.
// Videos: stabilized segments in public/videos/w4 (tools/stabilize.sh, start at 0).
// Photos: sharpest frame of a clean moment in public/photos/w4 (tools/best_still.py).
// Horizons checked on a grid; rot/scale where a frame needs levelling or a tighter crop.

const S = 30;
const v = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.mp4`, frames: Math.round(sec * S), ...o});
const ph = (name: string, sec: number, o: Partial<Scene> = {}): Scene => ({src: `w4/${name}.jpg`, frames: Math.round(sec * S), ...o});
const top = (...blocks: Block[]): Overlay => ({position: 'top', anim: 'static', blocks});
const H = (text: string, size?: number): Block => ({t: 'headline', text, size});
const sub = (text: string): Block => ({t: 'sub', text});
const kick = (text: string): Block => ({t: 'kicker', text});
const giant = (text: string, size = 150, raw = false): Block => ({t: 'giant', text, size, raw});

export const week4: Story[] = [
  // ───────────────────────── Mon 26.10
  {
    id: 'W4-1mon-v1-we-are-open', day: 'Mon 26.10', rubric: 'Часы работы', music: 'brera-night',
    scenes: [v('aquarium-room', 8.5)],
    overlay: top({t: 'wordmark'}, {t: 'gap', px: 10}, {t: 'hours', mode: 'compact'}),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'A new week by the aquarium. Mon–Fri 19:00–00:00, weekends also 12:30–15:30.',
    hashtags: ['#seasignora', '#brera', '#milano', '#seafoodmilano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-1mon-v2-built-to-share', day: 'Mon 26.10', rubric: 'Сырой бар', music: 'italo-arp',
    scenes: [v('plateau-hands', 4.2), v('plateau', 5.5)],
    overlay: top(H('Built to share'), sub('oysters, prawns & crudo')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Oysters, prawns and crudo on one plateau. Built to share, rarely shared.',
    hashtags: ['#seasignora', '#rawbar', '#oysters', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-1mon-p1-fresh-every-day', day: 'Mon 26.10', rubric: 'Сырой бар · статика', music: 'aquarium-ambient',
    scenes: [ph('seafood-ice', 6, {fy: 60})],
    overlay: top(H('Fresh every day'), sub('langoustines & red prawns on ice')),
    caption: 'On ice, every day: langoustines and red prawns from the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#seafood', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-1mon-p2-autumn-arrived', day: 'Mon 26.10', rubric: 'Сезон · статика', music: 'slow-sunday',
    scenes: [ph('pumpkins-curtain', 6, {fy: 60})],
    overlay: top(H('Autumn arrived'), sub('red velvet & white pumpkins')),
    caption: 'Autumn arrived at Sea, Signora: red velvet and white pumpkins.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-1mon-n1-red-blue-gold', day: 'Mon 26.10', rubric: 'Нарезка · цвета зала', music: 'velvet-strings',
    scenes: [
      ph('pumpkins-curtain2', 2.2, {fy: 40, overlay: top(giant('Red'))}),
      ph('room-9212', 2.2, {overlay: top(giant('Blue'))}),
      ph('pumpkins-gold', 2.2, {scale: 1.25, fy: 75, overlay: top(giant('Gold'))}),
      ph('decor-octopus', 2.6, {overlay: top(kick('the colours of'), {t: 'wordmark'})}),
    ],
    caption: 'Red velvet, a blue aquarium, golden light. The colours of Sea, Signora.',
    hashtags: ['#seasignora', '#interiordesign', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'book a table'],
  },
  {
    id: 'W4-1mon-n2-open-kitchen', day: 'Mon 26.10', rubric: 'Нарезка · открытая кухня', music: 'brera-house',
    scenes: [
      ph('kitchen-wide', 2.3, {overlay: top(kick('the open kitchen'), giant('Heat', 140))}),
      ph('grill', 2.3, {fy: 60, overlay: top(kick('the open kitchen'), giant('Fire', 140))}),
      ph('plating', 2.6, {overlay: top(kick('the open kitchen'), giant('Last touch', 120))}),
    ],
    caption: 'Heat, fire, last touch. Everything happens in front of you.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Tue 27.10
  {
    id: 'W4-2tue-v1-kitchen-wakes-up', day: 'Tue 27.10', rubric: 'Кухня', music: 'brera-house',
    scenes: [v('kitchen-wide', 5.5), v('kitchen-steam', 4.5)],
    overlay: top(kick('19:00'), H('The kitchen wakes up')),
    caption: '19:00 — the open kitchen wakes up.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4-2tue-v2-autumn-in-brera', day: 'Tue 27.10', rubric: 'Сезон', music: 'slow-sunday',
    scenes: [v('pumpkins-curtain', 4.3, {fy: 60}), v('pumpkins-card', 4.5), v('pumpkins-gold', 3.5, {scale: 1.2, fy: 75})],
    overlay: top(H('Autumn in Brera'), sub('white pumpkins & dried hydrangeas')),
    caption: 'Autumn in Brera: white pumpkins, dried hydrangeas and the usual red velvet.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-2tue-p1-pour-decisions', day: 'Tue 27.10', rubric: 'Бар · статика', music: 'noir-jazz',
    scenes: [ph('bottles', 6, {fy: 45})],
    overlay: top(H('Pour decisions'), sub('the bar is open from 19:00')),
    caption: 'Pour decisions welcome. The bar is open every night from 19:00.',
    hashtags: ['#seasignora', '#cocktails', '#bar', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-2tue-p2-red-and-blue', day: 'Tue 27.10', rubric: 'Сырой бар · статика', music: 'aquarium-ambient',
    scenes: [ph('prawns-lobster', 6)],
    overlay: top(H('Red & blue'), sub('red prawns · blue lobster')),
    caption: 'Red prawns and blue lobster: the raw bar in two colours.',
    hashtags: ['#seasignora', '#rawbar', '#lobster', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-n1-step-one', day: 'Tue 27.10', rubric: 'Серия «шаги»', music: 'italo-arp',
    scenes: [
      ph('seafood-ice', 2.3, {fy: 55, overlay: top(kick('step one'), H('Crushed ice'))}),
      ph('prawns-lobster', 2.3, {overlay: top(kick('step two'), H('The catch'))}),
      ph('plateau', 2.6, {overlay: top(kick('step three'), H('F*cking delicious'))}),
    ],
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Step one, crushed ice. Step two, the catch. Step three, you know the rest.',
    hashtags: ['#seasignora', '#rawbar', '#plateau', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-2tue-n2-one-night', day: 'Tue 27.10', rubric: 'Нарезка · вечер по часам', music: 'noir-jazz',
    scenes: [
      ph('kitchen-wide', 2.3, {overlay: top(giant('19:00', 150, true), sub('the kitchen wakes up'))}),
      ph('room-9239', 2.3, {overlay: top(giant('21:00', 150, true), sub('every table is talking'))}),
      ph('candles-red', 2.6, {overlay: top(giant('23:30', 150, true), sub('nobody wants to leave'))}),
    ],
    caption: 'One night at Sea, Signora, in three times.',
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Wed 28.10
  {
    id: 'W4-3wed-v1-main-and-grill', day: 'Wed 28.10', rubric: 'Кухня · гриль', music: 'brera-house',
    scenes: [v('grill', 4.5, {fy: 60}), v('plating', 2.5)],
    overlay: top(H('Main & grill'), sub('straight from the open kitchen')),
    caption: 'Main & grill, straight from the open kitchen.',
    hashtags: ['#seasignora', '#grill', '#openkitchen', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-3wed-v2-mirror', day: 'Wed 28.10', rubric: 'Атмосфера · новое', music: 'velvet-strings',
    scenes: [v('mirror', 7, {rot: 9, scale: 1.5, fx: 54, fy: 54})], // the mirror hangs at an angle: level the reflection
    overlay: top(H('Mirror mirror'), sub('the best table is the one you booked')),
    cta: {label: 'secure your table', color: 'olive'},
    caption: 'Mirror, mirror: the best table is the one you booked.',
    hashtags: ['#seasignora', '#brera', '#milanonight', '#interiordesign'], ctaVariants: ['secure your table', 'book a table'],
  },
  {
    id: 'W4-3wed-p1-find-us', day: 'Wed 28.10', rubric: 'Адрес · статика', music: 'brera-night',
    scenes: [ph('room-9212', 6)],
    overlay: top(H('Find us in Brera'), sub('via fiori chiari 32')),
    cta: {label: 'book a table', color: 'olive'},
    caption: 'Find us in the heart of Brera: Via Fiori Chiari, 32.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanorestaurants'], ctaVariants: ['book a table', 'make a reservation'],
  },
  {
    id: 'W4-3wed-p2-look-closer', day: 'Wed 28.10', rubric: 'Интерьер · статика', music: 'velvet-strings',
    scenes: [ph('decor-octopus', 6, {fy: 40})],
    overlay: {position: 'bottom', anim: 'static', blocks: [H('Look closer'), sub('every corner has a story')]},
    caption: 'Look closer: every corner of the room has a story.',
    hashtags: ['#seasignora', '#interiordesign', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-3wed-n1-pour-sip-stay', day: 'Wed 28.10', rubric: 'Нарезка · бар', music: 'bossa-sea',
    scenes: [
      ph('bottles', 2.3, {fy: 45, overlay: top(giant('Pour'))}),
      ph('wine', 2.3, {scale: 1.35, fy: 25, overlay: {position: 'bottom', anim: 'static', blocks: [giant('Sip')]}}),
      ph('laughing', 2.6, {overlay: top(giant('Stay'))}),
    ],
    caption: 'Pour. Sip. Stay a little longer.',
    hashtags: ['#seasignora', '#wine', '#cocktails', '#brera'], ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'W4-3wed-n2-you-start', day: 'Wed 28.10', rubric: 'Серия · You start', music: 'warm-lounge',
    scenes: [
      ph('seafood-ice2', 2.3, {overlay: top(H('You start'))}),
      ph('room-aquarium3', 2.3, {overlay: top(H('You enjoy'))}),
      ph('plateau-hands', 2.6, {overlay: top(H('You want more'))}),
    ],
    caption: 'You start, you enjoy, you want more.',
    hashtags: ['#seasignora', '#rawbar', '#brera', '#milanofood'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Thu 29.10
  {
    id: 'W4-4thu-v1-blackout-tonight', day: 'Thu 29.10', rubric: 'Событие · единственное касание', music: 'noir-jazz',
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
    id: 'W4-4thu-v2-from-the-aquarium', day: 'Thu 29.10', rubric: 'Сырой бар · аквариум', music: 'aquarium-ambient',
    scenes: [v('lobster-live', 4.5), v('seafood-ice', 5)],
    overlay: top(H('From the aquarium'), sub('to the raw bar')),
    caption: 'From our aquarium to the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#lobster', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-4thu-p1-made-in-front-of-you', day: 'Thu 29.10', rubric: 'Кухня · статика', music: 'brera-house',
    scenes: [ph('kitchen-wide', 6)],
    overlay: top(H('Made in front of you'), sub('the open kitchen')),
    caption: 'Made in front of you, in the open kitchen.',
    hashtags: ['#seasignora', '#openkitchen', '#chef', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-4thu-p2-the-kind-of-night', day: 'Thu 29.10', rubric: 'Атмосфера · статика', music: 'noir-jazz',
    scenes: [ph('candles-red', 6)],
    overlay: top(H("The kind of night\nyou don't want to end", 58)),
    caption: "The kind of night you don't want to end.",
    hashtags: ['#seasignora', '#milanonight', '#brera', '#dinner'], ctaVariants: ['reserve', 'secure your table'],
  },
  {
    id: 'W4-4thu-n1-fire-and-ice', day: 'Thu 29.10', rubric: 'Нарезка · огонь и лёд', music: 'italo-arp',
    scenes: [
      ph('grill', 2.4, {fy: 60, overlay: top(giant('Fire'))}),
      ph('seafood-ice2', 2.4, {overlay: top(giant('Ice'))}),
      ph('prawns-lobster', 2.6, {overlay: top({t: 'wordmark'}, sub('main & grill · raw bar'))}),
    ],
    caption: 'Fire from the grill, ice from the raw bar.',
    hashtags: ['#seasignora', '#rawbar', '#grill', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-4thu-n2-autumn-details', day: 'Thu 29.10', rubric: 'Нарезка · сезон', music: 'slow-sunday',
    scenes: [ph('pumpkins-card', 2.1), ph('decor-macro', 2.1), ph('hydrangea', 2.1), ph('pumpkins-bar', 2.4)],
    overlay: top(H('Autumn details'), sub('now at sea, signora')),
    caption: 'Autumn details, now all around the room.',
    hashtags: ['#seasignora', '#autumn', '#interiordesign', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },

  // ───────────────────────── Fri 30.10
  {
    id: 'W4-5fri-v1-full-room', day: 'Fri 30.10', rubric: 'Атмосфера · полный зал', music: 'brera-house',
    scenes: [v('room-chandelier', 5), v('room-aquarium2', 4.5)],
    overlay: top(H('Nothing beats a full room')),
    cta: {label: 'secure your table', color: 'orange'},
    caption: 'Friday, full room, aquarium glow. Nothing beats it.',
    hashtags: ['#seasignora', '#fridaynight', '#brera', '#milanonight'], ctaVariants: ['secure your table', 'reserve'],
  },
  {
    id: 'W4-5fri-v2-red-and-blue', day: 'Fri 30.10', rubric: 'Сырой бар', music: 'aquarium-ambient',
    scenes: [v('prawns-lobster', 4.2), v('seafood-ice2', 3.2)],
    overlay: top(H('Red & blue'), sub('red prawns · blue lobster')),
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Red prawns, blue lobster, crushed ice. The raw bar opens at 19:00.',
    hashtags: ['#seasignora', '#rawbar', '#seafood', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-5fri-p1-the-plateau', day: 'Fri 30.10', rubric: 'Сырой бар · статика', music: 'italo-arp',
    scenes: [ph('plateau', 6, {fy: 60})],
    overlay: top(H('The plateau\neveryone needs to taste', 58)),
    caption: 'The plateau everyone needs to taste at least once.',
    hashtags: ['#seasignora', '#plateau', '#oysters', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-5fri-p2-sea-signora-autumn', day: 'Fri 30.10', rubric: 'Сезон · статика', music: 'slow-sunday',
    scenes: [ph('pumpkins-card', 6)],
    overlay: top(kick('autumn edition'), {t: 'wordmark'}),
    caption: 'Sea, Signora, autumn edition.',
    hashtags: ['#seasignora', '#autumn', '#brera', '#milano'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-5fri-n1-weekend-plan', day: 'Fri 30.10', rubric: 'Нарезка · часы выходных', music: 'bossa-sea',
    scenes: [
      ph('room-9212', 2.4, {overlay: top(kick('friday'), giant('19:00', 150, true), sub('until midnight'))}),
      ph('pumpkins-curtain', 2.4, {fy: 60, overlay: top(kick('saturday'), giant('12:30', 150, true), sub('& again from 19:00'))}),
      ph('decor-table', 2.6, {overlay: top(kick('sunday'), giant('12:30', 150, true), sub('& again from 19:00'))}),
    ],
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Weekend plan: Friday 19:00–00:00, Saturday and Sunday 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#weekend', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-5fri-n2-raw-bar', day: 'Fri 30.10', rubric: 'Нарезка · сырой бар', music: 'aquarium-ambient',
    scenes: [
      ph('seafood-ice', 2.3, {fy: 55, overlay: top(kick('raw bar'), H('Langoustines'))}),
      ph('prawns-lobster', 2.3, {overlay: top(kick('raw bar'), H('Red prawns'))}),
      ph('plateau', 2.6, {fy: 60, overlay: top(kick('raw bar'), H('Oysters'))}),
    ],
    caption: 'Langoustines, red prawns, oysters. On ice from 19:00.',
    hashtags: ['#seasignora', '#rawbar', '#oysters', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },

  // ───────────────────────── Sat 31.10
  {
    id: 'W4-6sat-v1-weekends', day: 'Sat 31.10', rubric: 'Часы выходных', music: 'bossa-sea',
    scenes: [v('room-9212', 5.5), v('aquarium-room', 4)],
    overlay: top(kick('weekends'), {t: 'hours', mode: 'weekend'}),
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Weekends at Sea, Signora: 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#weekend', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-6sat-v2-the-bar', day: 'Sat 31.10', rubric: 'Бар', music: 'noir-jazz',
    scenes: [v('bottles', 4.5), v('wine', 5, {scale: 1.3, fy: 25})],
    overlay: top(H('Pour decisions'), sub('ask us what to open tonight')),
    caption: 'Pour decisions, Saturday edition. Ask us what to open tonight.',
    hashtags: ['#seasignora', '#wine', '#bar', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-6sat-p1-golden', day: 'Sat 31.10', rubric: 'Сезон · статика', music: 'slow-sunday',
    scenes: [ph('pumpkins-gold', 6, {scale: 1.25, fy: 75})],
    overlay: top(giant('Autumn', 140), sub('saturday, slowly')),
    caption: 'Autumn, Saturday, slowly.',
    hashtags: ['#seasignora', '#autumn', '#weekend', '#brera'], ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'W4-6sat-p2-mirror', day: 'Sat 31.10', rubric: 'Атмосфера · статика', music: 'velvet-strings',
    scenes: [ph('mirror', 6, {rot: 9, scale: 1.5, fx: 54, fy: 54})],
    overlay: top(H('Brera tonight'), sub('via fiori chiari 32')),
    caption: 'Brera tonight, seen from the mirror.',
    hashtags: ['#seasignora', '#brera', '#milanonight', '#interiordesign'], ctaVariants: ['secure your table', 'reserve'],
  },
  {
    id: 'W4-6sat-n1-look', day: 'Sat 31.10', rubric: 'Нарезка · Look', music: 'velvet-strings',
    scenes: [
      ph('lamp', 2.3, {overlay: {position: 'bottom', anim: 'static', blocks: [H('Look up')]}}),
      ph('room-9239', 2.3, {overlay: top(H('Look around'))}),
      ph('prawns-lobster', 2.6, {overlay: top(H('Look closer'))}),
    ],
    caption: 'Look up, look around, look closer.',
    hashtags: ['#seasignora', '#brera', '#interiordesign', '#rawbar'], ctaVariants: ['experience Sea, Signora', 'book a table'],
  },
  {
    id: 'W4-6sat-n2-blue-hour', day: 'Sat 31.10', rubric: 'Нарезка · аквариум', music: 'aquarium-ambient',
    scenes: [ph('aquarium-room', 2.3), ph('room-aquarium2', 2.3), ph('room-aquarium3', 2.6)],
    overlay: top(H('Blue hour'), sub('every night from 19:00')),
    caption: 'Blue hour by the aquarium, every night from 19:00.',
    hashtags: ['#seasignora', '#aquarium', '#brera', '#milanonight'], ctaVariants: ['reserve', 'secure your table'],
  },

  // ───────────────────────── Sun 01.11
  {
    id: 'W4-7sun-v1-slow-sunday', day: 'Sun 01.11', rubric: 'Воскресенье · атмосфера', music: 'slow-sunday',
    scenes: [v('decor-octopus', 5.5, {fy: 40}), v('decor-table', 4.5)],
    overlay: top(H('Slow Sunday'), sub('12:30–15:30 & 19:00–00:00')),
    cta: {label: 'reserve', color: 'olive'},
    caption: 'Slow Sunday in Brera. Open 12:30–15:30 and 19:00–00:00.',
    hashtags: ['#seasignora', '#sunday', '#brera', '#milano'], ctaVariants: ['reserve', 'book your table'],
  },
  {
    id: 'W4-7sun-v2-autumn-details', day: 'Sun 01.11', rubric: 'Сезон', music: 'velvet-strings',
    scenes: [v('decor-macro', 3.5), v('hydrangea', 3.5), v('pumpkins-bar', 3.5)],
    overlay: top(H('Autumn details')),
    caption: 'The autumn details all around the room.',
    hashtags: ['#seasignora', '#autumn', '#interiordesign', '#brera'], ctaVariants: ['experience Sea, Signora', 'reserve'],
  },
  {
    id: 'W4-7sun-p1-sunday-on-ice', day: 'Sun 01.11', rubric: 'Сырой бар · статика', music: 'aquarium-ambient',
    scenes: [ph('seafood-ice2', 6)],
    overlay: top(H('Sunday on ice'), sub('the raw bar opens at 12:30')),
    caption: 'Sunday on ice: the raw bar opens at 12:30.',
    hashtags: ['#seasignora', '#rawbar', '#sunday', '#brera'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-7sun-p2-dried-and-red', day: 'Sun 01.11', rubric: 'Сезон · статика', music: 'slow-sunday',
    scenes: [ph('hydrangea', 6)],
    overlay: top(H('Slow down'), sub('sunday in brera · from 12:30')),
    caption: 'Slow down, it is Sunday in Brera. Open from 12:30.',
    hashtags: ['#seasignora', '#brera', '#milano', '#autumn'], ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'W4-7sun-n1-this-week', day: 'Sun 01.11', rubric: 'Нарезка · итоги недели', music: 'warm-lounge',
    scenes: [ph('plateau', 2), ph('kitchen-wide', 2), ph('room-9212', 2), ph('pumpkins-card', 2.4)],
    overlay: top(kick('this week at'), {t: 'wordmark'}),
    caption: 'This week at Sea, Signora: the plateau, the open kitchen, the aquarium and a lot of pumpkins.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanofood'], ctaVariants: ['book a table', 'experience Sea, Signora'],
  },
  {
    id: 'W4-7sun-n2-find-us', day: 'Sun 01.11', rubric: 'Нарезка · адрес', music: 'brera-night',
    scenes: [
      ph('room-9239', 2.3, {overlay: top(H('Brera'))}),
      ph('decor-octopus', 2.3, {fy: 40, overlay: top(H('Via Fiori Chiari 32'))}),
      ph('pumpkins-curtain2', 2.6, {fy: 40, overlay: top(H('See you tonight'))}),
    ],
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Brera, Via Fiori Chiari 32. See you tonight.',
    hashtags: ['#seasignora', '#brera', '#milano', '#milanorestaurants'], ctaVariants: ['book a table', 'reserve'],
  },
];
