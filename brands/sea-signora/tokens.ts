// Sea, Signora — design tokens for Remotion stories (9:16, 1080×1920, 30 fps).
// Colors: sampled from published story frames, cross-checked against the official
// brandbook (Branding/SS_colors rgb.pdf). See BRAND.md for the reasoning.

export const colors = {
  // Base
  night: '#0B0B0B', // top/bottom gradient fades in every story (frames: #020202–#0D0B0C)
  ivory: '#F8F6F5', // all on-screen text (frames)
  // Accents — Instagram link-sticker / UI chips
  orange: '#E57533', // "reserve" chip in frames; brand Pantone 158 = #EF7818
  olive: '#9E9E6A', // "make a reservation" chip in frames; brand Pantone 5845 = #B1AB6E
  star: '#FCCE09', // review stars ★★★★★ in frames; brand mustard Pantone 605 = #E2C424
  marble: '#1B2F1C', // green marble tables in the photos; brand Pantone 5605
} as const;

// Full official brand palette (brandbook p.8 / SS_colors rgb.pdf) — for rare accents only.
export const brandPalette = {
  orange158: '#EF7818',
  mustard605: '#E2C424',
  green5605: '#1B2F1C',
  navy5463: '#1D1D1B',
  olive5845: '#B1AB6E',
  warmGray1: '#DDDDD4',
  sand454: '#CEC4AF',
  black7: '#48453D',
} as const;

export const fonts = {
  // Logotype font. Headlines, always UPPERCASE except the wordmark "Sea, Signora".
  // Latin only — no Cyrillic glyphs.
  display: 'Skanaus',
  // Subtitles / details / hours / addresses / reviews. Uppercase for taglines,
  // sentence/lowercase allowed for short notes ("warm, loud, alive").
  mono: 'JetBrains Mono',
  // Long-form serif (menus, italic accents). Rare in stories.
  serif: 'Spectral',
} as const;

export const fontFiles = [
  {family: fonts.display, file: 'fonts/Skanaus-Regular.otf', weight: '400', style: 'normal'},
  {family: fonts.mono, file: 'fonts/JetBrainsMono-Regular.ttf', weight: '400', style: 'normal'},
  {family: fonts.mono, file: 'fonts/JetBrainsMono-Medium.ttf', weight: '500', style: 'normal'},
  {family: fonts.mono, file: 'fonts/JetBrainsMono-Bold.ttf', weight: '700', style: 'normal'},
  {family: fonts.serif, file: 'fonts/Spectral-Regular.otf', weight: '400', style: 'normal'},
  {family: fonts.serif, file: 'fonts/Spectral-Italic.otf', weight: '400', style: 'italic'},
] as const;

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Instagram story safe zone: nothing important in the top 250 px / bottom 340 px.
export const safe = {
  top: 250,
  bottom: 340,
  side: 64,
} as const;

// Type scale, px at 1080×1920 (measured from frames: headline ≈ 6.5–7% of width).
export const type = {
  wordmark: {size: 112, letterSpacing: -1, lineHeight: 1.0}, // "Sea, Signora"
  headline: {size: 74, letterSpacing: 0, lineHeight: 1.04}, // STEP ONE / WE ARE OPEN
  headlineSmall: {size: 58, letterSpacing: 0, lineHeight: 1.08}, // long dish names
  sub: {size: 34, letterSpacing: 1.5, lineHeight: 1.3}, // mono subtitle under headline
  caption: {size: 30, letterSpacing: 1, lineHeight: 1.35}, // mono caption / hours
  small: {size: 24, letterSpacing: 0.6, lineHeight: 1.4}, // review body, uppercase mono
  chip: {size: 32, letterSpacing: 0, lineHeight: 1}, // link-sticker chip
} as const;

// Darkening behind text: vertical fade from night to transparent.
export const scrim = {
  topHeight: 760, // px from top
  bottomHeight: 820,
  opacity: 0.88,
} as const;

export const motion = {
  textFadeFrames: 12, // 0.4 s soft fade-in, no bounce
  textStaggerFrames: 8, // next line starts ~0.27 s later
  textRisePx: 14, // tiny upward drift while fading in
  kenBurnsScale: 0.06, // 1.00 → 1.06 over a story
  crossfadeFrames: 10, // between photos inside one story
  endFadeFrames: 12, // fade to night at the very end
} as const;

export const durations = {
  // Published stories run 6–17 s, median ≈ 10.5 s.
  short: 7 * 30,
  default: 10 * 30,
  long: 14 * 30,
} as const;

export const contacts = {
  address: 'Via Fiori Chiari, 32',
  district: 'Brera, Milano',
  hoursWeek: 'Monday-Friday\n19:00-00:00',
  hoursWeekend: 'Saturday-Sunday\n12:30-15:30\n19:00-00:00',
  hoursCompact: 'MON-FRI 19:00-00:00\nSAT-SUN 12:30-15:30 | 19:00-00:00',
  phone: '+39 345 2831086',
  instagram: '@seasignora.milano',
  site: 'seasignorarest.com',
} as const;

// Link-sticker labels actually used in published stories.
export const ctaLabels = [
  'reserve',
  'book your table',
  'book a table',
  'make a reservation',
  'secure your table',
  'secure your spot',
  'experience Sea, Signora',
] as const;
