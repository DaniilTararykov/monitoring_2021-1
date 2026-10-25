import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, motion, scrim, type} from '../../../tokens';
import type {Cta, Scene} from '../types';

// Full-bleed photo, cropped to 9:16 around a focus point, with a slow Ken Burns drift.
export const Photo: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const fx = scene.fx ?? 50;
  const fy = scene.fy ?? 50;
  const z = scene.zoom ?? 'in';
  const p = frame / Math.max(1, scene.frames);
  const k = motion.kenBurnsScale;
  const scale = z === 'in' ? 1 + k * p : z === 'out' ? 1 + k * (1 - p) : 1;
  const shift = scene.shift ?? 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: colors.night}}>
      <AbsoluteFill style={{top: shift, height: 1920, overflow: 'hidden'}}>
      <Img
        src={staticFile(`photos/${scene.src}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${fx}% ${fy}%`,
          transform: `scale(${scale})`,
          transformOrigin: `${fx}% ${fy}%`,
        }}
      />
      </AbsoluteFill>
      {shift > 0 ? (
        <div
          style={{
            position: 'absolute', left: 0, right: 0, top: shift - 2, height: 260,
            background: `linear-gradient(to bottom, ${colors.night}, rgba(11,11,11,0))`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// Soft night gradient behind text — the only "plate" the brand uses.
export const Scrim: React.FC<{top?: boolean; bottom?: boolean; strength?: number}> = ({top, bottom, strength = 1}) => {
  const a = scrim.opacity * strength;
  const night = (o: number) => `rgba(11,11,11,${o})`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {top ? (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: scrim.topHeight,
            background: `linear-gradient(to bottom, ${night(a)} 0%, ${night(a * 0.75)} 40%, ${night(0)} 100%)`,
          }}
        />
      ) : null}
      {bottom ? (
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: scrim.bottomHeight,
            background: `linear-gradient(to top, ${night(a)} 0%, ${night(a * 0.75)} 40%, ${night(0)} 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const LinkIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1-1" />
  </svg>
);

// Link-sticker look-alike. When publishing, put the real Instagram link sticker over it.
export const Chip: React.FC<{cta: Cta}> = ({cta}) => {
  const frame = useCurrentFrame();
  const from = cta.from ?? 20;
  const p = interpolate(frame, [from, from + motion.textFadeFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const bg = cta.color === 'olive' ? colors.olive : colors.orange;
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: cta.y ?? 400,
        display: 'flex', justifyContent: 'center', opacity: p,
        transform: `translateY(${(1 - p) * motion.textRisePx}px)`,
      }}
    >
      <div
        style={{
          background: bg, borderRadius: 22, padding: '20px 34px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
        }}
      >
        <LinkIcon size={36} color={colors.ivory} />
        <span style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: type.chip.size, color: colors.ivory}}>{cta.label}</span>
      </div>
    </div>
  );
};

// Debug overlay: shows the Instagram UI danger zones (top 250 / bottom 340).
export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 250, background: 'rgba(255,0,0,0.28)'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 340, background: 'rgba(255,0,0,0.28)'}} />
  </AbsoluteFill>
);
