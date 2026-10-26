import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, grade, motion, scrim, type} from '../../../tokens';
import type {Cta, Scene} from '../types';

// Full-bleed photo or video, cropped to 9:16 around a focus point.
// Photos are static unless `zoom` is set; videos play from `start` at `rate`.
export const Photo: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fx = scene.fx ?? 50;
  const fy = scene.fy ?? 50;
  const z = scene.zoom ?? 'none';
  const p = frame / Math.max(1, scene.frames);
  const k = motion.kenBurnsScale;
  const shift = scene.shift ?? 0;
  const isVideo = scene.src.endsWith('.mp4');
  const w = scene.window;
  // levelling: rotate, then scale up just enough that no corner of the box shows
  const bw = w ? 1080 - 2 * w.side : 1080;
  const bh = w ? 1920 - w.top - w.bottom : 1920;
  const r = (Math.abs(scene.rot ?? 0) * Math.PI) / 180;
  const cover = Math.max((bw * Math.cos(r) + bh * Math.sin(r)) / bw, (bw * Math.sin(r) + bh * Math.cos(r)) / bh);
  const kb = z === 'in' ? 1 + k * p : z === 'out' ? 1 + k * (1 - p) : 1;
  const media: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${fx}% ${fy}%`,
    transform: `scale(${kb * (scene.scale ?? 1)})`, transformOrigin: `${fx}% ${fy}%`,
    filter: grade.filter,
  };
  const box: React.CSSProperties = w
    ? {top: w.top, bottom: w.bottom, left: w.side, right: w.side, width: 'auto', height: 'auto', overflow: 'hidden'}
    : {top: shift, height: 1920, overflow: 'hidden'};
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: colors.night}}>
      <AbsoluteFill style={box}>
        {/* rotation about the box centre (+ cover scale); the crop-in / Ken Burns happens inside, around fx/fy */}
        <AbsoluteFill style={{transform: scene.rot ? `rotate(${scene.rot}deg) scale(${cover})` : undefined}}>
          {isVideo ? (
            <OffthreadVideo
              src={staticFile(`videos/${scene.src}`)}
              startFrom={Math.round((scene.start ?? 0) * fps)}
              playbackRate={scene.rate ?? 1}
              muted
              style={media}
            />
          ) : (
            <Img src={staticFile(`photos/${scene.src}`)} style={media} />
          )}
        </AbsoluteFill>
        <AbsoluteFill style={{background: grade.warmth, mixBlendMode: 'soft-light'}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${grade.vignette}) 100%)`}} />
      </AbsoluteFill>
      {shift > 0 && !w ? (
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

// Link-sticker look-alike. NEVER animated: the real Instagram link sticker is placed
// exactly on top of it when publishing, so it must sit still from the first frame.
export const Chip: React.FC<{cta: Cta}> = ({cta}) => {
  const bg = cta.color === 'olive' ? colors.olive : colors.orange;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: cta.y ?? 400, display: 'flex', justifyContent: 'center'}}>
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
