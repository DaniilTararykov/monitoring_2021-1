// Data model for a Sea, Signora story. One story = one 9:16 video.

export type Block =
  | {t: 'wordmark'; text?: string; size?: number} // "Sea, Signora" in the logotype font, mixed case
  | {t: 'headline'; text: string; size?: number} // Skanaus, always uppercase
  | {t: 'sub'; text: string} // JetBrains Mono, uppercase, letter-spaced
  | {t: 'note'; text: string} // JetBrains Mono, as typed (lowercase notes like "review")
  | {t: 'stars'}
  | {t: 'review'; text: string; author?: string}
  | {t: 'hours'; mode?: 'split' | 'compact' | 'weekend'}
  | {t: 'list'; items: string[]}
  | {t: 'rule'} // thin orange divider under a headline
  | {t: 'gap'; px: number}
  | {t: 'giant'; text: string; size?: number; color?: 'ivory' | 'orange' | 'olive'; raw?: boolean} // bold: one huge word (raw = keep ':' in times like 19:00)
  | {t: 'kicker'; text: string; color?: 'orange' | 'night'}; // tiny mono label above a giant/headline (e.g. "N°1", "ACT II"); orange = teaser for the next story/day

export type Overlay = {
  position: 'top' | 'bottom' | 'center';
  y?: number; // explicit top offset in px (overrides position anchor)
  blocks: Block[];
  align?: 'center' | 'left';
  // Frame the overlay starts appearing (relative to its scene / story). Default 4.
  delay?: number;
  // 'reveal' = soft line-by-line fade-up (brand default for built stories); 'static' = on from frame 0.
  anim?: 'reveal' | 'static';
};

export type Scene = {
  src: string; // photo in public/photos, or video in public/videos (.mp4)
  frames: number;
  start?: number; // video: seconds into the clip
  rate?: number; // video: playback rate (0.5 = slow motion, needs 60 fps proxy)
  window?: {top: number; bottom: number; side: number}; // cinematic inset frame on night background
  fx?: number; // focus point, % of width (object-position x)
  fy?: number; // focus point, % of height
  zoom?: 'in' | 'out' | 'none'; // photos are static by default; Ken Burns only in 2–3 stories per pack
  rot?: number; // degrees, + = clockwise: levels the horizon (the cover scale for it is added automatically)
  scale?: number; // static crop-in (1.15 = 15% tighter) around fx/fy for a cleaner composition
  shift?: number; // px: push the photo down to leave a dark band for text on top
  overlay?: Overlay; // text that belongs only to this scene
};

export type Cta = {
  label: string;
  color?: 'orange' | 'olive';
  y?: number; // px from the bottom edge of the frame, default 400 (above the 340 px safe zone)
};

export type ChatPair = {problem: string; solution: string}; // solution = photo file

export type Story = {
  id: string; // e.g. "01-mon-we-are-open"
  day: string; // e.g. "Mon 26.10"
  rubric: string;
  music: string; // file name (no extension) in public/music; 'none' = silent video (client adds music in Instagram)
  musicFrom?: number; // seconds into the track
  scenes: Scene[];
  transition?: 'cut' | 'fade'; // between scenes; default hard cut
  overlay?: Overlay; // persistent over all scenes
  cta?: Cta;
  chat?: ChatPair[]; // "Your problem / Our solution" template (olive background, no photo scenes)
  // Copy for the post (not rendered): caption, hashtags, CTA variants.
  caption: string;
  hashtags: string[];
  ctaVariants: string[];
};
