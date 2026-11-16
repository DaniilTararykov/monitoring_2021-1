import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Birthday recap (12.11), client 15.11: re-edit of the client's own «best shots» cut (rc/b.mp4, clean, no watermark)
// to the song from their TikTok version (rc/song, delayed so the vocal enters right after Antonio's «mua!»).
// Rules from the client: recap not announcement (no times, no programme); Italian subtitles only, static — they just
// change, no animation; no colour grading (only straightening tilted shots); small reorders allowed.
// Two cuts in the Sea, Signora identity (Skanaus, JetBrains Mono, green 5605 / orange 158 / sand 454, the brand «1»):
//   A «Pagina»  — an editorial page: shots in a 4:5 frame on brand colour, mono running header and shot counter,
//                 diptychs, triptychs, a contact sheet built on the beat, full-bleed hits on the choruses;
//   B «Tagli»   — full-bleed cuts on the beat with hard punch-ins, one-word Skanaus cards, the footage inside
//                 a giant «1» strobing with the full frame on the chorus, split screens.
// Every change happens on a beat; text never animates (hard cuts only).

export const FPS = 60;
const SONG_DELAY = 1.79;          // song time 0 lands here
const M0 = 8.35;                  // montage starts (song beat 12 = the vocal), after «mua!»
const BEAT_S = 0.53505;           // song beat period (fit over 94 beats, 112.1 bpm)
export const RECAP_S = SONG_DELAY + 57.65;
const bf = (k: number) => Math.round((M0 + k * BEAT_S) * FPS); // frame of montage beat k
export const recapFrames = () => Math.round(RECAP_S * FPS);

// shots of the client's cut (scene detection), seconds
const CUTS = [0, 8.37, 9.57, 10.73, 11.90, 13.47, 14.60, 15.43, 16.50, 17.67, 19.17, 20.50, 22.07, 23.60, 25.17, 26.83, 28.50, 29.73,
  30.60, 31.90, 32.57, 33.37, 34.53, 36.40, 38.77, 40.27, 41.90, 43.10, 44.83, 46.47, 47.03, 48.57, 50.73, 51.87, 53.43, 54.93, 56.20, 57.70];
// straightening (deg, clockwise +), measured on verticals and checked by eye
const ROT: Record<number, number> = {3: -3, 9: -6, 12: 3, 16: -3, 17: 1.5, 26: 3, 30: 6, 34: 5};

// a shot of the client's cut (s = index, at = optional start) or, for collages, another moment of the evening that is
// not in the cut (clip = original proxy in bd/, at = start) — so nothing on the page repeats; fx/fy = framing (%)
type Shot = {s?: number; clip?: string; at?: number; fx?: number; fy?: number; z?: number};
const PAGE = {green: brandPalette.green5605, orange: brandPalette.orange158, sand: brandPalette.sand454};
type Seg =
  | {k: 'full'; n: number; v: Shot; punch?: boolean}
  | {k: 'frame'; n: number; v: Shot; bg: string}
  | {k: 'wide'; n: number; v: Shot; bg: string}
  | {k: 'port'; n: number; v: Shot; bg: string}
  | {k: 'duo'; n: number; vs: [Shot, Shot]; bg: string; dir?: 'v' | 'h'}
  | {k: 'tri'; n: number; vs: Shot[]; bg: string; build?: boolean}
  | {k: 'sheet'; n: number; vs: Shot[]; bg: string}
  | {k: 'word'; n: number; text: string; bg: string; ink?: string; size?: number; mark?: boolean}
  | {k: 'one'; n: number; v: Shot; bg: string}
  | {k: 'end'; n: number; v: Shot; bg: string; ink?: string};

// ───────────────────────────── A · Pagina
// Client 15.11 (2nd round): a take is shown once — framed OR full (S29/S30, S32/S33, S34/S36, S6/S7 are the same takes);
// no porthole on raw fish; the contact sheet uses only steady, static moments (measured camera shift, no zooms) that
// are not in the client's cut; no collage of the same people twice. clip 'CUT' = the client's cut at an absolute time.
const G = PAGE.green, O = PAGE.orange, SA = PAGE.sand;
const A: Seg[] = [
  // verse 1 — the welcome, green page
  {k: 'frame', n: 2, v: {s: 1}, bg: G}, {k: 'frame', n: 2, v: {s: 2}, bg: G}, {k: 'frame', n: 2, v: {s: 3}, bg: G},
  {k: 'wide', n: 3, v: {s: 4, fy: 38}, bg: G}, {k: 'port', n: 2, v: {s: 5}, bg: G},
  {k: 'frame', n: 2, v: {clip: 'CUT', at: 14.65}, bg: G}, {k: 'full', n: 1, v: {clip: 'CUT', at: 15.83}},
  {k: 'frame', n: 3, v: {s: 9}, bg: G}, {k: 'wide', n: 2, v: {s: 10, fy: 48}, bg: G}, {k: 'full', n: 2, v: {s: 11}},
  {k: 'wide', n: 2, v: {clip: 'IMG_2623', at: 0.1, fy: 45}, bg: G},
  // TONNO comes before any tuna is shown (client 15.11)
  {k: 'word', n: 2, text: 'Tonno', bg: O, ink: G},
  {k: 'full', n: 2, v: {s: 8}}, {k: 'wide', n: 2, v: {clip: 'IMG_2611', at: 0.3, fx: 60}, bg: O},
  {k: 'frame', n: 3, v: {s: 12}, bg: O},
  // chorus 1 — the tuna show, orange page
  {k: 'full', n: 3, v: {s: 13}}, {k: 'frame', n: 2, v: {s: 14}, bg: O}, {k: 'full', n: 2, v: {s: 15}}, {k: 'frame', n: 2, v: {s: 16}, bg: O},
  {k: 'full', n: 1, v: {s: 17}}, {k: 'frame', n: 3, v: {s: 18}, bg: O}, {k: 'full', n: 1, v: {s: 20}},
  // verse 2 — at the table, sand page: a contact sheet of steady moments (longest-held tiles = steadiest windows)
  {k: 'sheet', n: 10, vs: [
    {clip: 'IMG_2698', at: 3.6}, {clip: 'IMG_2643', at: 3.5}, {clip: 'IMG_2647', at: 6.0},
    {clip: 'IMG_2700', at: 1.3}, {clip: 'IMG_2665', at: 3.8}, {clip: 'IMG_2666', at: 15.4},
    {clip: 'IMG_2705', at: 9.0}, {clip: 'IMG_2690', at: 8.3}, {clip: 'IMG_2618', at: 4.0}], bg: SA},
  {k: 'wide', n: 2, v: {s: 21, fy: 58}, bg: SA}, {k: 'full', n: 2, v: {s: 22}}, {k: 'frame', n: 2, v: {s: 23}, bg: SA},
  {k: 'full', n: 3, v: {s: 24}}, {k: 'frame', n: 2, v: {s: 25}, bg: SA},
  {k: 'duo', n: 2, vs: [{s: 26, fy: 45}, {s: 27, fy: 72}], bg: SA, dir: 'h'},
  {k: 'full', n: 2, v: {s: 28}}, {k: 'frame', n: 3, v: {s: 30}, bg: SA},
  {k: 'word', n: 2, text: 'Torta', bg: G, ink: colors.ivory},
  // chorus 2 — the cake
  {k: 'full', n: 3, v: {s: 31}}, {k: 'frame', n: 2, v: {s: 33}, bg: G}, {k: 'full', n: 3, v: {s: 34}}, {k: 'full', n: 2, v: {s: 35}},
  {k: 'frame', n: 2, v: {clip: 'IMG_2717', at: 3.3}, bg: G},
  {k: 'end', n: 99, v: {clip: 'IMG_2588', at: 7.3}, bg: G},
];

// ───────────────────────────── B · Tagli
// Client 15.11 (2nd round): no collage of the same people, TONNO / TORTA before any tuna / cake is shown, the «1» only at the end, with just «Sea, Signora».
const B: Seg[] = [
  {k: 'word', n: 1, text: 'Un', bg: PAGE.green}, {k: 'word', n: 1, text: 'anno', bg: PAGE.orange, ink: PAGE.green},
  {k: 'full', n: 2, v: {s: 1}, punch: true}, {k: 'full', n: 2, v: {s: 2}, punch: true}, {k: 'full', n: 2, v: {s: 3}, punch: true},
  {k: 'full', n: 2, v: {s: 4}}, {k: 'full', n: 2, v: {s: 5}},
  {k: 'full', n: 2, v: {clip: 'CUT', at: 14.65}, punch: true}, {k: 'full', n: 1, v: {clip: 'CUT', at: 15.83}},
  {k: 'full', n: 2, v: {s: 9}}, {k: 'full', n: 2, v: {s: 10}, punch: true}, {k: 'full', n: 2, v: {s: 11}},
  {k: 'full', n: 1, v: {s: 17}}, {k: 'full', n: 2, v: {clip: 'IMG_2643', at: 3.5}},
  {k: 'word', n: 1, text: 'Sea,', bg: PAGE.green, mark: true}, {k: 'word', n: 1, text: 'Signora', bg: PAGE.green, mark: true},
  {k: 'word', n: 2, text: 'Tonno', bg: PAGE.orange, ink: PAGE.green},
  // the tuna show
  {k: 'full', n: 2, v: {s: 8}, punch: true}, {k: 'full', n: 1, v: {clip: 'IMG_2611', at: 0.4}}, {k: 'full', n: 2, v: {s: 12}, punch: true},
  {k: 'full', n: 3, v: {s: 13}}, {k: 'full', n: 3, v: {s: 14}, punch: true}, {k: 'full', n: 3, v: {s: 15}},
  {k: 'full', n: 2, v: {s: 16}},
  {k: 'full', n: 2, v: {s: 18}}, {k: 'full', n: 2, v: {s: 20}, punch: true},
  // the table
  {k: 'word', n: 1, text: 'Amici', bg: PAGE.orange, ink: PAGE.green},
  {k: 'full', n: 2, v: {s: 21}}, {k: 'full', n: 2, v: {s: 22}, punch: true}, {k: 'full', n: 3, v: {s: 23}}, {k: 'full', n: 2, v: {clip: 'IMG_2700', at: 2.2}}, {k: 'full', n: 3, v: {s: 24}, punch: true},
  {k: 'duo', n: 2, vs: [{s: 25, fy: 55}, {s: 26, fy: 38}], bg: PAGE.green, dir: 'h'}, {k: 'full', n: 3, v: {s: 27}},
  {k: 'full', n: 2, v: {s: 28}, punch: true}, {k: 'full', n: 2, v: {clip: 'IMG_2690', at: 8.3}}, {k: 'full', n: 3, v: {s: 30}},
  {k: 'duo', n: 2, vs: [{clip: 'IMG_2698', at: 4.7, fy: 50}, {clip: 'IMG_2705', at: 9.0, fy: 50}], bg: PAGE.green, dir: 'h'},
  {k: 'word', n: 1, text: 'Torta', bg: PAGE.green},
  // the cake
  {k: 'full', n: 3, v: {s: 31}}, {k: 'full', n: 2, v: {s: 33}, punch: true},
  {k: 'full', n: 3, v: {s: 34}}, {k: 'full', n: 2, v: {s: 35}}, {k: 'full', n: 2, v: {clip: 'IMG_2717', at: 3.3}},
  {k: 'end', n: 99, v: {s: 36}, bg: PAGE.orange, ink: PAGE.green},
];
export const RECAP = {A, B};

// Antonio's words, static Italian subtitles (clip time = output time)
const SUBS: [number, number, string][] = [
  [0.0, 1.62, 'E finalmente'], [1.62, 2.72, 'è passato un anno'], [2.72, 3.78, 'è il nostro\ncompleanno'],
  [3.78, 4.88, 'siamo qui da\nSea, Signora'], [4.88, 6.45, 'a Milano,\nvia Fiori Chiari'], [6.45, 7.7, 'auguri a tutti'], [7.7, 8.35, 'mua!'],
];

// ───────────────────────────── pieces
// never run past the shot's own cut: a shot shorter than its slot is slowed down a little instead (≥ 0.7×)
const rateOf = (v: Shot, sec: number) => {
  if (v.clip) return 1;
  const len = CUTS[v.s! + 1] - CUTS[v.s!] - 0.1;
  return sec > len ? Math.max(0.7, len / sec) : 1;
};
const startOf = (v: Shot, sec: number) => {
  if (v.clip) return v.at ?? 0;
  const a = CUTS[v.s!] + 0.05, b = CUTS[v.s! + 1] - 0.05;
  const span = sec * rateOf(v, sec);
  const t = v.at ?? (a + b) / 2 - span / 2;
  return Math.max(a, Math.min(t, b - span));
};

const Vid: React.FC<{v: Shot; sec: number; zoom?: number}> = ({v, sec, zoom = 1}) => {
  const r = v.s !== undefined ? ROT[v.s] ?? 0 : 0;
  const cover = Math.cos((Math.abs(r) * Math.PI) / 180) + (1920 / 1080) * Math.sin((Math.abs(r) * Math.PI) / 180);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(v.clip && v.clip !== 'CUT' ? `bd/${v.clip}.mp4` : 'rc/b.mp4')} startFrom={Math.round(startOf(v, sec) * FPS)} playbackRate={rateOf(v, sec)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${v.fx ?? 50}% ${v.fy ?? 50}%`,
          transform: `rotate(${r}deg) scale(${cover * zoom * (v.z ?? 1)})`, transformOrigin: `${v.fx ?? 50}% ${v.fy ?? 50}%`}} />
    </AbsoluteFill>
  );
};

// the page chrome of «Pagina»: running header + shot counter, mono, ink on the page colour
const Chrome: React.FC<{ink: string; no: number}> = ({ink, no}) => (
  <>
    <div style={{position: 'absolute', left: 80, right: 80, top: 262, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono,
      fontWeight: 500, fontSize: 24, letterSpacing: 6, color: ink, textTransform: 'uppercase'}}>
      <span>Sea, Signora</span><span>Milano</span>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1556, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono,
      fontWeight: 500, fontSize: 24, letterSpacing: 6, color: ink, textTransform: 'uppercase'}}>
      <span>Compleanno</span><span>Un anno</span>
    </div>
  </>
);
const inkOn = (bg: string) => (bg === PAGE.sand ? PAGE.green : bg === PAGE.orange ? PAGE.green : colors.ivory);

const BOX = {left: 80, top: 320, width: 920, height: 1200}; // the page's picture box (≈ 4:5 + a little)

const Framed: React.FC<{v: Shot; sec: number; box?: typeof BOX; line: string}> = ({v, sec, box = BOX, line}) => (
  <div style={{position: 'absolute', ...box, overflow: 'hidden', outline: `2px solid ${line}`, outlineOffset: 10}}>
    <Vid v={v} sec={sec} />
  </div>
);

const OneMask: React.FC<{id: string}> = ({id}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        <text x={540} y={1430} textAnchor="middle" fontFamily={fonts.display} fontSize={1500}
          transform="translate(540 960) scale(1.32 1) translate(-540 -960)">1</text>
      </clipPath>
    </defs>
  </svg>
);

const SegView: React.FC<{s: Seg; i: number; frames: number; no: number; pagina: boolean}> = ({s, i, frames, no, pagina}) => {
  const f = useCurrentFrame();
  const sec = frames / FPS;
  const beat = BEAT_S * FPS;
  switch (s.k) {
    case 'full': {
      const z = s.punch && f >= Math.round(beat) ? 1.12 : 1; // hard punch-in on the second beat
      return <Vid v={s.v} sec={sec} zoom={z} />;
    }
    case 'frame': {
      const ink = inkOn(s.bg);
      return <AbsoluteFill style={{background: s.bg}}><Framed v={s.v} sec={sec} line={ink} />{pagina ? <Chrome ink={ink} no={no} /> : null}</AbsoluteFill>;
    }
    case 'wide': {
      const ink = inkOn(s.bg);
      return <AbsoluteFill style={{background: s.bg}}><Framed v={s.v} sec={sec} box={{left: 80, top: 470, width: 920, height: 800}} line={ink} />{pagina ? <Chrome ink={ink} no={no} /> : null}</AbsoluteFill>;
    }
    case 'port': {
      const ink = inkOn(s.bg);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          <div style={{position: 'absolute', left: 120, top: 480, width: 840, height: 840, borderRadius: '50%', overflow: 'hidden',
            outline: `2px solid ${ink}`, outlineOffset: 10}}><Vid v={s.v} sec={sec} /></div>
          {pagina ? <Chrome ink={ink} no={no} /> : null}
        </AbsoluteFill>
      );
    }
    case 'duo': {
      const h = s.dir === 'h'; const ink = inkOn(s.bg);
      const boxes = pagina
        ? (h ? [{left: 80, top: 320, width: 920, height: 590}, {left: 80, top: 930, width: 920, height: 590}]
          : [{left: 80, top: 320, width: 450, height: 1200}, {left: 550, top: 320, width: 450, height: 1200}])
        : (h ? [{left: 0, top: 0, width: 1080, height: 957}, {left: 0, top: 963, width: 1080, height: 957}]
          : [{left: 0, top: 0, width: 537, height: 1920}, {left: 543, top: 0, width: 537, height: 1920}]);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.vs.map((v, j) => (
            <div key={j} style={{position: 'absolute', ...boxes[j], overflow: 'hidden'}}><Vid v={v} sec={sec} /></div>
          ))}
          {pagina ? <Chrome ink={ink} no={no} /> : null}
        </AbsoluteFill>
      );
    }
    case 'tri': {
      const ink = inkOn(s.bg);
      const shown = s.build ? Math.min(s.vs.length, 1 + Math.floor(f / beat)) : s.vs.length;
      const W = pagina ? 920 : 1080, L = pagina ? 80 : 0, T = pagina ? 320 : 0, H = pagina ? 1200 : 1920, g = 6;
      const w = (W - g * (s.vs.length - 1)) / s.vs.length;
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.vs.slice(0, shown).map((v, j) => (
            <div key={j} style={{position: 'absolute', left: L + j * (w + g), top: T, width: w, height: H, overflow: 'hidden'}}><Vid v={v} sec={sec} /></div>
          ))}
          {pagina ? <Chrome ink={ink} no={no} /> : null}
        </AbsoluteFill>
      );
    }
    case 'sheet': {
      const ink = inkOn(s.bg);
      const shown = Math.min(s.vs.length, 1 + Math.floor(f / beat));
      const g = 10, w = (920 - 2 * g) / 3, h = (1200 - 2 * g) / 3;
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {s.vs.slice(0, shown).map((v, j) => (
            <div key={j} style={{position: 'absolute', left: 80 + (j % 3) * (w + g), top: 320 + Math.floor(j / 3) * (h + g), width: w, height: h, overflow: 'hidden'}}>
              <Vid v={v} sec={sec} />
            </div>
          ))}
          <Chrome ink={ink} no={no} />
        </AbsoluteFill>
      );
    }
    case 'word': {
      const ink = s.ink ?? colors.ivory;
      return (
        <AbsoluteFill style={{background: s.bg, justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontFamily: fonts.display, color: ink, fontSize: s.size ?? (s.text.length > 6 ? 190 : 260), lineHeight: 1,
            textTransform: s.mark ? 'none' : 'uppercase', letterSpacing: 2, marginTop: -40}}>{s.text}</div>
        </AbsoluteFill>
      );
    }
    case 'one': return (
      <AbsoluteFill style={{background: s.bg}}>
        <OneMask id={`rc-one-${i}`} />
        <AbsoluteFill style={{clipPath: `url(#rc-one-${i})`}}><Vid v={s.v} sec={sec} /></AbsoluteFill>
      </AbsoluteFill>
    );
    case 'end': {
      const ink = s.ink ?? inkOn(s.bg);
      return (
        <AbsoluteFill style={{background: s.bg}}>
          {pagina ? <Framed v={s.v} sec={sec} box={{left: 190, top: 330, width: 700, height: 880}} line={ink} /> : (
            <><OneMask id="rc-end" /><AbsoluteFill style={{clipPath: 'url(#rc-end)', transform: 'scale(0.8)', transformOrigin: '50% 40%'}}><Vid v={s.v} sec={sec} /></AbsoluteFill></>
          )}
          <div style={{position: 'absolute', left: 0, right: 0, top: pagina ? 1290 : 1360, textAlign: 'center', color: ink}}>
            <div style={{fontFamily: fonts.display, fontSize: 104, lineHeight: 1}}>Sea, Signora</div>
            {pagina ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, letterSpacing: 8, marginTop: 26, textTransform: 'uppercase'}}>un anno · grazie a tutti</div> : null}
          </div>
        </AbsoluteFill>
      );
    }
  }
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const sub = SUBS.find(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile('rc/b.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(11,11,11,0.6) 0%, rgba(11,11,11,0) 32%)'}} />
      {sub ? (
        <div style={{position: 'absolute', left: 60, right: 60, top: 280, textAlign: 'center', fontFamily: fonts.display, fontSize: 70,
          lineHeight: 1.02, color: colors.ivory, textTransform: 'uppercase', whiteSpace: 'pre-line'}}>{sub[2]}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Recap: React.FC<{variant: 'A' | 'B'}> = ({variant}) => {
  const segs = RECAP[variant];
  const pagina = variant === 'A';
  const total = recapFrames();
  let k = 0, no = 0;
  const parts = segs.map((s, i) => {
    const a = bf(k), b = s.k === 'end' ? total : bf(k + s.n);
    if (s.k !== 'word') no += 1;
    k += s.n;
    return <Sequence key={i} from={a} durationInFrames={Math.max(1, b - a)}><SegView s={s} i={i} frames={b - a} no={no} pagina={pagina} /></Sequence>;
  });
  return (
    <AbsoluteFill style={{background: colors.night}}>
      <Sequence from={0} durationInFrames={bf(0)}><Intro /></Sequence>
      {parts}
    </AbsoluteFill>
  );
};
