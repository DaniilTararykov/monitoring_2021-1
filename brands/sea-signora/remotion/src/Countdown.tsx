import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {brandPalette, colors, fonts} from '../../tokens';
import {loadBrandFonts} from './fonts';

loadBrandFonts();

// Week 02–08.11: ten days to the first birthday (12.11). Two stories a day, same clean language as «Vocabolario»
// (flat brand colour, one shape, little text, no black):
//  · Countdown — the number of days left, big, and one moment of the year in an arch: an event or an evening.
//  · Window    — a moment of the restaurant today, full frame, with one flat brand-colour band at the bottom.
// All footage from the Drive folder «Lisa & Danik», not used before. Silent; one link chip, on Saturday.

type Bg = 'white' | 'green' | 'orange';
const BG: Record<Bg, {bg: string; ink: string; accent: string}> = {
  white: {bg: colors.ivory, ink: brandPalette.green5605, accent: brandPalette.orange158},
  green: {bg: brandPalette.green5605, ink: colors.ivory, accent: brandPalette.orange158},
  orange: {bg: brandPalette.orange158, ink: brandPalette.green5605, accent: colors.ivory},
};
const FPS = 30;
const vid = (n: string) => staticFile(`videos/w6/${n}.mp4`);
const ease = (f: number, a: number, len = 10) => interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

export type CountdownProps = {days: number; bg: Bg; clip: string; start?: number; rate?: number; fx?: number; fy?: number; zoom?: number; line: string; place: string};

export const Countdown: React.FC<CountdownProps> = ({days, bg, clip, start = 0, rate = 1, fx = 50, fy = 50, zoom = 1, line, place}) => {
  const f = useCurrentFrame();
  const c = BG[bg];
  const AW = 600, AH = 760, AX = 540 - AW / 2, AY = 470;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.display, fontSize: 36, letterSpacing: 1}}>Sea, Signora</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 15, letterSpacing: 6, textTransform: 'uppercase', marginTop: 8, color: c.accent}}>
          {days} days to our first birthday
        </div>
      </div>
      <div style={{position: 'absolute', left: AX, top: AY, width: AW, height: AH, overflow: 'hidden', borderRadius: `${AW / 2}px ${AW / 2}px 0 0`}}>
        <OffthreadVideo src={vid(clip)} startFrom={Math.round(start * FPS)} playbackRate={rate} muted
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%`,
            filter: 'contrast(1.08) saturate(1.15)'}} />
      </div>
      {/* the number leans on the arch, overlapping its base */}
      <div style={{position: 'absolute', left: 0, right: 0, top: AY + AH - 150, textAlign: 'center', fontFamily: fonts.display, fontSize: 300, lineHeight: 1,
        color: c.accent, opacity: ease(f, 0, 8), transform: `translateY(${(1 - ease(f, 0, 8)) * 30}px)`}}>{days}</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: AY + AH + 170, textAlign: 'center', color: c.ink}}>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 40, opacity: ease(f, 8)}}>{line}</div>
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 19, letterSpacing: 4, textTransform: 'uppercase', marginTop: 14, opacity: ease(f, 14)}}>{place}</div>
      </div>
    </AbsoluteFill>
  );
};

export type WindowProps = {band: Bg; clip: string; start?: number; rate?: number; fx?: number; fy?: number; zoom?: number; title: string; sub: string; kicker?: string;
  cta?: string};

export const Window: React.FC<WindowProps> = ({band, clip, start = 0, rate = 1, fx = 50, fy = 50, zoom = 1, title, sub, kicker, cta}) => {
  const f = useCurrentFrame();
  const c = BG[band];
  const BAND = 560;
  return (
    <AbsoluteFill style={{background: c.bg}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1920 - BAND, overflow: 'hidden'}}>
        <OffthreadVideo src={vid(clip)} startFrom={Math.round(start * FPS)} playbackRate={rate} muted
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`, transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%`,
            filter: 'contrast(1.08) saturate(1.15)'}} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1920 - BAND + 56, color: c.ink}}>
        {kicker ? <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: 5, textTransform: 'uppercase', color: c.accent, opacity: ease(f, 2)}}>{kicker}</div> : null}
        <div style={{fontFamily: fonts.display, fontSize: 72, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.02, marginTop: kicker ? 14 : 0,
          opacity: ease(f, 4), transform: `translateY(${(1 - ease(f, 4)) * 16}px)`}}>{title}</div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 36, marginTop: 14, opacity: ease(f, 10)}}>{sub}</div>
        {cta ? (
          <div style={{display: 'inline-flex', marginTop: 26, padding: '14px 26px', borderRadius: 18, background: c.accent, color: c.bg,
            fontFamily: fonts.mono, fontWeight: 500, fontSize: 26}}>{cta}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
