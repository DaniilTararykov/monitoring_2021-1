import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, grade, safe} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Renders a config saved from the «Монтажная» editor artifact (brands/sea-signora/editor).
// Same timing rule as the editor preview: shot i starts at beat i*beatsPerCut of the track,
// the last shot holds to the end of the track.
//   npx remotion render EditorReel out/x.mp4 --props=config.json

// rot (deg, + = clockwise) levels the horizon; zoom/fx/fy crop in; the cover scale for rot is added automatically.
// rate: playback speed (default config.rate ?? 1); n: this shot's length in beats (default beatsPerCut), e.g. a longer pre-cut clip played through.
export type EditorClip = {clip: string; start: number; fy?: number; fx?: number; rot?: number; zoom?: number; n?: number; rate?: number};
export type EditorConfig = {
  name: string; mode: 'split' | 'seq'; title: string; titleFont: 'display' | 'serif'; sub?: string; // sub: small mono line under the title
  music: string; beatsPerCut: number; secPerCut?: number; grade: boolean; shots: {a: EditorClip; b?: EditorClip}[];
  // final-render options (not set by the editor): explicit beat grid + audio file, no fades/drift, stronger grade
  beats?: number[]; audio?: string; rate?: number; fades?: boolean; drift?: number; gradeAmount?: number; film?: boolean;
  // optional ending: the last shot fades into the poster (fade 0 = straight cut), which holds `hold` s
  poster?: {src: string; fade: number; hold: number};
};

export const TRACKS: Record<string, {dur: number; beats: number[]}> = {
  'ref-two-recipes': {dur: 13.4, beats: [0.743, 1.37, 1.997, 2.647, 3.274, 3.924, 4.551, 5.178, 5.828, 6.455, 7.105, 7.755, 8.382, 9.009, 9.66, 10.286, 10.937, 11.564, 12.214]},
  'ref-art-of-hands': {dur: 18.4, beats: [0.093, 0.534, 0.952, 1.37, 1.788, 2.206, 2.624, 3.042, 3.46, 3.855, 4.249, 4.644, 5.039, 5.41, 5.805, 6.177, 6.548, 6.989, 7.407, 7.825, 8.22, 8.615, 9.033, 9.404, 9.822, 10.217, 10.612, 11.006, 11.424, 11.819, 12.214, 12.608, 13.003, 13.398, 13.816, 14.211, 14.605, 15.0, 15.395, 15.79, 16.184, 16.579, 16.974, 17.369]},
  'ref-kitchen-cinematic': {dur: 23.4, beats: [0.116, 0.766, 1.416, 1.997, 2.577, 3.158, 3.738, 4.296, 4.876, 5.433, 6.014, 6.571, 7.152, 7.709, 8.29, 8.87, 9.451, 10.008, 10.588, 11.146, 11.726, 12.283, 12.864, 13.444, 14.002, 14.582, 15.163, 15.72, 16.3, 16.858, 17.438, 17.995, 18.576, 19.156, 19.737, 20.294, 20.875, 21.432]},
};
const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const src = (id: string) => `videos/reel/${id}.mp4`;

// Every shot has the same length (N beats, or N seconds with music "none"); the track loops if shorter.
const noMusic = (c: EditorConfig) => !c.beats && !TRACKS[c.music];
const interval = (b: number[]) => (b[b.length - 1] - b[0]) / (b.length - 1);
export const cutAt = (c: EditorConfig, i: number) => {
  if (i <= 0) return 0;
  if (noMusic(c)) return i * (c.secPerCut || 2);
  const b = c.beats ?? TRACKS[c.music].beats;
  const k = c.shots.slice(0, i).reduce((sum, s) => sum + (s.a.n ?? c.beatsPerCut), 0) - 1;
  return k < b.length ? b[k] : b[b.length - 1] + (k - b.length + 1) * interval(b);
};
export const editorDuration = (c: EditorConfig) => fr(cutAt(c, c.shots.length) + (c.poster ? c.poster.hold + c.poster.fade : 0));

// Grade scaled from the brand tokens: amount 1 = tokens.grade, 1.3 = 30% stronger.
const gradeFilter = (a: number, film: boolean) =>
  a === 1 && !film ? grade.filter
    : `contrast(${1 + 0.08 * a}) brightness(${1 - 0.07 * a}) saturate(${1 - 0.1 * a}) sepia(${0.12 * a})${film ? ' url(#film)' : ''}`;

// Film look: gently lifted blacks, rolled-off highlights, warm highlights / slightly cool-olive shadows.
const FilmDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id="film" colorInterpolationFilters="sRGB">
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.035 0.2 0.47 0.76 0.97" />
        <feFuncG type="table" tableValues="0.04 0.21 0.47 0.74 0.95" />
        <feFuncB type="table" tableValues="0.05 0.21 0.45 0.7 0.9" />
      </feComponentTransfer>
    </filter>
  </svg>
);

const Shot: React.FC<{c: EditorClip; len: number; fy: boolean; graded: boolean; cfg: EditorConfig}> = ({c, len, fy, graded, cfg}) => {
  const f = useCurrentFrame();
  const py = fy || cfg.film ? c.fy ?? 50 : 50;
  const px = c.fx ?? 50;
  const rot = c.rot ?? 0;
  const r = (Math.abs(rot) * Math.PI) / 180;
  const cover = Math.cos(r) + (1920 / 1080) * Math.sin(r); // keeps the corners filled when rotated
  const drift = cfg.drift ?? 0.04;
  const scale = (c.zoom ?? 1) * cover * (1 + drift * (f / Math.max(1, len)));
  const a = cfg.gradeAmount ?? 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src(c.clip))} startFrom={fr(c.start)} playbackRate={c.rate ?? cfg.rate ?? 1} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${px}% ${py}%`,
          transform: `rotate(${rot}deg) scale(${scale})`, transformOrigin: `${px}% ${py}%`, filter: graded ? gradeFilter(a, !!cfg.film) : undefined}} />
      {graded ? <AbsoluteFill style={{background: `rgba(120, 60, 20, ${0.1 * a})`, mixBlendMode: 'soft-light'}} /> : null}
      {graded && cfg.film ? <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${Math.min(0.7, grade.vignette * a)}) 100%)`}} /> : null}
    </AbsoluteFill>
  );
};

export const EditorReel: React.FC<{config: EditorConfig}> = ({config}) => {
  const f = useCurrentFrame();
  const total = editorDuration(config);
  const starts = config.shots.map((_, i) => cutAt(config, i));
  const shotsEnd = fr(cutAt(config, config.shots.length));
  const p = config.poster;
  const posterO = !p ? 0 : p.fade > 0 ? interpolate(f, [shotsEnd, shotsEnd + fr(p.fade)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : f >= shotsEnd ? 1 : 0;
  const split = config.mode === 'split';
  const titleStyle: React.CSSProperties = config.titleFont === 'serif'
    ? {fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 52}
    : {fontFamily: fonts.display, textTransform: 'uppercase', fontSize: split ? 54 : 58, letterSpacing: 1};
  const fade = config.fades === false ? 0 : interpolate(f, [0, 8, total - 14, total - 1], [1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.night}}>
      {config.film ? <FilmDefs /> : null}
      {starts.map((s, i) => {
        const from = fr(s);
        const to = i === starts.length - 1 ? (p ? shotsEnd + fr(p.fade) : total) : fr(starts[i + 1]);
        const sh = config.shots[i];
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
            {split ? (
              <>
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 958, overflow: 'hidden'}}><Shot c={sh.a} len={to - from} fy graded={config.grade} cfg={config} /></div>
                <div style={{position: 'absolute', left: 0, right: 0, top: 962, height: 958, overflow: 'hidden'}}><Shot c={sh.b ?? sh.a} len={to - from} fy graded={config.grade} cfg={config} /></div>
              </>
            ) : (
              <Shot c={sh.a} len={to - from} fy={false} graded={config.grade} cfg={config} />
            )}
          </Sequence>
        );
      })}
      {split ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 850, height: 220, background: 'linear-gradient(to bottom, rgba(11,11,11,0) 0%, rgba(11,11,11,0.5) 50%, rgba(11,11,11,0) 100%)'}} />
      ) : (
        config.fades === false
          // final cut: a small, soft shade just behind the title
          ? <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(to bottom, rgba(11,11,11,0.62) 0%, rgba(11,11,11,0.38) 45%, rgba(11,11,11,0) 100%)'}} />
          : <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: 'linear-gradient(to bottom, rgba(11,11,11,0.75) 0%, rgba(11,11,11,0.35) 55%, rgba(11,11,11,0) 100%)'}} />
      )}
      {config.title ? (
        <div style={{position: 'absolute', left: 40, right: 40, top: split ? 960 - 36 : safe.top + 30, textAlign: 'center', color: colors.ivory, textShadow: '0 1px 14px rgba(0,0,0,0.6)', ...titleStyle}}>
          {config.title}
          {config.sub ? <div style={{fontFamily: fonts.mono, fontStyle: 'normal', fontWeight: 500, fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', marginTop: 12, opacity: 0.92}}>{config.sub}</div> : null}
        </div>
      ) : null}
      {p ? (
        <AbsoluteFill style={{opacity: posterO}}>
          <Img src={staticFile(p.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: colors.night, opacity: fade}} />
      {config.audio ? <Audio src={staticFile(`music/${config.audio}`)} />
        : noMusic(config) ? null : <Audio src={staticFile(`music/${config.music}.mp3`)} loop />}
    </AbsoluteFill>
  );
};
