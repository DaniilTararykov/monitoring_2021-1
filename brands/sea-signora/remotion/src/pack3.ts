import type {Story} from './types';

// Pack 3 (26.10) — after client notes: stabilized shots (vidstab), smaller headlines,
// no punctuation in headlines, light warm grade on every frame, CTA chips static.
// s_*.mp4 = stabilized segments (tools/stabilize.sh), each starts at 0.

const S = 30;

export const pack3: Story[] = [
  {
    id: 'R1-cicatelli',
    day: 'pack 3',
    rubric: 'Блюдо-герой · стабильные ракурсы',
    music: 'italo-arp',
    scenes: [
      {src: 's_8889.mp4', frames: 45},
      {src: 's_8888.mp4', frames: 45},
      {src: 's_8885.mp4', frames: 45},
      {src: 's_8878.mp4', frames: 45},
      {src: 's_8880.mp4', frames: 60},
    ],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Cicatelli'}, {t: 'sub', text: 'king crab & shellfish sauce'}]},
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Cicatelli from Puglia with king crab and shellfish sauce.',
    hashtags: ['#seasignora', '#kingcrab', '#pasta', '#brera', '#milanofood'],
    ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'R4-quiet-hands',
    day: 'pack 3',
    rubric: 'Кухня · кадр-окно',
    music: 'marble-minimal',
    scenes: [{src: 's_8893.mp4', frames: 9 * S, window: {top: 470, bottom: 400, side: 64}, fy: 50}],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Quiet hands'}, {t: 'sub', text: 'red tuna, plated by hand'}]},
    caption: 'Quiet hands, open kitchen. Red tuna, plated one slice at a time.',
    hashtags: ['#seasignora', '#openkitchen', '#finedining', '#brera'],
    ctaVariants: ['book a table', 'reserve'],
  },
  {
    id: 'R5-slow-silky',
    day: 'pack 3',
    rubric: 'Слово на кадр',
    music: 'noir-jazz',
    scenes: [
      {src: 's_8873.mp4', start: 0.3, rate: 0.6, frames: 3 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Slow'}]}},
      {src: 's_8873.mp4', start: 2.2, rate: 0.6, frames: 3 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'giant', text: 'Silky'}]}},
      {src: 's_8881.mp4', start: 0, frames: 4 * S, overlay: {position: 'top', anim: 'static', blocks: [{t: 'wordmark'}, {t: 'sub', text: 'cicatelli, king crab & shellfish sauce'}]}},
    ],
    cta: {label: 'book a table', color: 'orange'},
    caption: 'Slow. Silky. Sea, Signora.',
    hashtags: ['#seasignora', '#pasta', '#kingcrab', '#brera'],
    ctaVariants: ['book a table', 'secure your spot'],
  },
  {
    id: 'R6-google-review-sc',
    day: 'pack 3',
    rubric: 'Отзыв Google (1 в неделю)',
    music: 'aquarium-ambient',
    scenes: [
      {src: 's_8889.mp4', start: 0, frames: 105, window: {top: 470, bottom: 900, side: 64}, overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Sea Signora'}, {t: 'note', text: 'google review'}]}},
      {src: 's_8888.mp4', start: 0, frames: 100, window: {top: 470, bottom: 900, side: 64}, overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Sea Signora'}, {t: 'note', text: 'google review'}]}},
    ],
    overlay: {
      position: 'top',
      y: 1080,
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
    id: 'R8-first-pour',
    day: 'pack 3',
    rubric: 'Бар · новое',
    music: 'velvet-strings',
    scenes: [{src: 's_8904.mp4', start: 0, rate: 0.6, frames: 9 * S}],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'First pour'}, {t: 'sub', text: 'the evening starts at 19:00'}]},
    cta: {label: 'reserve', color: 'orange'},
    caption: 'First pour of the night. Doors open at 19:00.',
    hashtags: ['#seasignora', '#aperitivo', '#brera', '#milanonight'],
    ctaVariants: ['reserve', 'book a table'],
  },
  {
    id: 'R9-the-bar',
    day: 'pack 3',
    rubric: 'Бар · новое',
    music: 'brera-house',
    scenes: [
      {src: 'IMG_8908.mp4', start: 42.5, frames: 5 * S},
      {src: 'IMG_8909.mp4', start: 8, frames: 4 * S},
    ],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'The bar is open'}, {t: 'sub', text: 'signature cocktails from 19:00'}]},
    caption: 'Signature cocktails at the counter, every night from 19:00.',
    hashtags: ['#seasignora', '#cocktails', '#brera', '#milanobar'],
    ctaVariants: ['reserve', 'experience Sea, Signora'],
  },
  {
    id: 'R10-the-room',
    day: 'pack 3',
    rubric: 'Атмосфера зала · новое',
    music: 'noir-jazz',
    musicFrom: 6,
    scenes: [
      {src: 's_8938.mp4', start: 2, frames: 4 * S},
      {src: 'IMG_8934.mp4', start: 98.5, frames: 3 * S},
      {src: 's_8938.mp4', start: 30, frames: 3 * S},
    ],
    overlay: {position: 'top', anim: 'static', blocks: [{t: 'headline', text: 'Brera tonight'}, {t: 'sub', text: 'via fiori chiari 32'}]},
    cta: {label: 'secure your table', color: 'olive'},
    caption: 'Chandeliers on, tables set. Brera, tonight.',
    hashtags: ['#seasignora', '#brera', '#milanonight', '#milanorestaurants'],
    ctaVariants: ['secure your table', 'reserve'],
  },
];
