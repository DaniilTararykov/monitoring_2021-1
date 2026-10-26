import type {Story} from './types';
import {stories} from './stories';

// Pack 2 (26.10): 7 simple aesthetic videos from the Drive video shoot
// + static photo stories (no Ken Burns except 2) as video and PNG.
// Rules: CTA chips never animate; reviews only from Google Maps (verbatim); no "lunch/brunch".

const S = 30;

export const videos7: Story[] = [
  {
    id: 'V1-obsessed',
    day: 'pack 2',
    rubric: 'Блюдо-герой · монтаж ракурсов',
    music: 'italo-arp',
    scenes: [
      {src: 'IMG_8883.mp4', start: 3, frames: 40},
      {src: 'IMG_8885.mp4', start: 10, frames: 40},
      {src: 'IMG_8889.mp4', start: 8, frames: 40},
      {src: 'IMG_8881.mp4', start: 6, frames: 40},
      {src: 'IMG_8876.mp4', start: 2, frames: 40},
      {src: 'IMG_8882.mp4', start: 12, frames: 50},
    ],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Obsessed.', size: 190}, {t: 'sub', text: 'cicatelli, king crab\n& shellfish sauce'}]},
    caption: 'One plate, every angle. Cicatelli from Puglia with king crab and shellfish sauce.',
    hashtags: ['#seasignora', '#kingcrab', '#pasta', '#brera', '#milanofood'],
    ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'V2-red',
    day: 'pack 2',
    rubric: 'Цвет / концепт',
    music: 'velvet-strings',
    scenes: [
      {src: 'IMG_8875.mp4', start: 0, rate: 0.5, frames: 4 * S},
      {src: 'IMG_8879.mp4', start: 0.5, frames: 4 * S},
    ],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Red.', size: 300}, {t: 'sub', text: 'the colour of our kitchen'}]},
    caption: 'Red is the colour of our kitchen.',
    hashtags: ['#seasignora', '#brera', '#milanofood', '#finedining'],
    ctaVariants: ['book a table', 'experience Sea, Signora'],
  },
  {
    id: 'V3-showtime',
    day: 'pack 2',
    rubric: 'Команда / закулисье',
    music: 'brera-house',
    scenes: [{src: 'IMG_8937.mp4', start: 40, frames: 9 * S}],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'kicker', text: 'before 19:00'}, {t: 'giant', text: 'Showtime', size: 210}, {t: 'sub', text: 'the team, before the doors open'}]},
    caption: 'Every night starts here: the team, five minutes before the doors open.',
    hashtags: ['#seasignora', '#behindthescenes', '#hospitality', '#brera'],
    ctaVariants: ['reserve', 'secure your table'],
  },
  {
    id: 'V4-quiet-hands',
    day: 'pack 2',
    rubric: 'Кухня · кадр-окно',
    music: 'marble-minimal',
    scenes: [{src: 'IMG_8893.mp4', start: 17, frames: 9 * S, window: {top: 560, bottom: 420, side: 70}, fy: 55}],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Quiet hands', size: 96}, {t: 'sub', text: 'red tuna, plated by hand'}]},
    caption: 'Quiet hands, open kitchen. Red tuna, plated one slice at a time.',
    hashtags: ['#seasignora', '#openkitchen', '#chefathome', '#finedining', '#brera'],
    ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'V5-slow-silky-signora',
    day: 'pack 2',
    rubric: 'Слово на кадр',
    music: 'noir-jazz',
    scenes: [
      {src: 'IMG_8873.mp4', start: 0.6, rate: 0.6, frames: 3 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Slow.', size: 260}]}},
      {src: 'IMG_8873.mp4', start: 2.4, rate: 0.6, frames: 3 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Silky.', size: 260}]}},
      {src: 'IMG_8881.mp4', start: 9, frames: 4 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Signora.', size: 220}, {t: 'sub', text: 'cicatelli, king crab & shellfish sauce'}]}},
    ],
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Slow. Silky. Signora.',
    hashtags: ['#seasignora', '#pasta', '#kingcrab', '#brera'],
    ctaVariants: ['book a table', 'secure your spot'],
  },
  {
    id: 'V6-google-review-sc',
    day: 'pack 2',
    rubric: 'Отзыв Google (1 в неделю)',
    music: 'aquarium-ambient',
    scenes: [
      {src: 'IMG_8879.mp4', start: 0, frames: 140, window: {top: 470, bottom: 860, side: 64}, overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Sea, Signora', size: 80}, {t: 'note', text: 'google review'}]}},
      {src: 'IMG_8884.mp4', start: 0, frames: 150, window: {top: 470, bottom: 860, side: 64}, overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Sea, Signora', size: 80}, {t: 'note', text: 'google review'}]}},
    ],
    overlay: {
      position: 'top',
      y: 1100,
      anim: 'static',
      blocks: [
        {t: 'stars'},
        {t: 'review', text: 'Exceptional restaurant with top quality seafood. Professional knowledgeable service within a beautifully designed atmosphere. Highly recommend, we will be back. Thank you.', author: 'S C'},
      ],
    },
    caption: 'Thank you for the kind words — see you soon.',
    hashtags: ['#seasignora', '#review', '#brera', '#milanorestaurants'],
    ctaVariants: ['make a reservation', 'book a table'],
  },
  {
    id: 'V7-open-tonight',
    day: 'pack 2',
    rubric: 'Часы работы',
    music: 'bossa-sea',
    scenes: [{src: 'IMG_8891.mp4', start: 3, frames: 8 * S}],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'wordmark'}, {t: 'gap', px: 10}, {t: 'hours', mode: 'compact'}]},
    cta: {label: 'reserve', color: 'orange'},
    caption: 'Mon–Fri 19:00–00:00 · Sat–Sun 12:30–15:30 and 19:00–00:00. Via Fiori Chiari, 32.',
    hashtags: ['#seasignora', '#brera', '#milano', '#seafoodmilano'],
    ctaVariants: ['reserve', 'book your table'],
  },
];

// Static photo stories: earlier pack re-cut without Ken Burns (except 2), no reviews,
// no lunch wording. Rendered both as mp4 (static picture + music) and PNG.
const keepMotion = new Set(['02-mon-cicatelli', '14-fri-friday-plan']);
const pick = [
  '01-mon-we-are-open', '02-mon-cicatelli', '03-mon-oysters-steps', '05-tue-burrata', '06-tue-wine',
  '08-wed-open-kitchen', '09-wed-nugget-bite', '10-wed-raw-bar-plateau', '11-thu-dimsum-save-the-date',
  '12-thu-todays-catch', '13-thu-scallop-crudo', '14-fri-friday-plan', '16-fri-weekends-hours',
  '17-sat-no-costume', '18-sat-tiramisu', '22-sun-risotto-oysters', '23-sun-tarte-tatin', '24-sun-espresso',
  '25-sun-dimsum-tomorrow',
];
export const statics: Story[] = stories
  .filter((s) => pick.includes(s.id))
  .map((s) => ({
    ...s,
    id: 'P-' + s.id.replace(/^\d+-[a-z]{3}-/, ''),
    day: 'pack 2',
    scenes: s.scenes.map((sc) => ({
      ...sc,
      zoom: keepMotion.has(s.id) ? sc.zoom ?? 'in' : 'none',
      overlay: sc.overlay ? {...sc.overlay, anim: 'static' as const} : undefined,
    })),
    overlay: s.overlay ? {...s.overlay, anim: 'static' as const} : undefined,
  }));

// V2 (no message) and V6 (horizontal clips) were rejected by the client; R6 in pack3 replaces V6.
export const pack2: Story[] = [...videos7.filter((s) => !['V2-red', 'V6-google-review-sc'].includes(s.id)), ...statics];
