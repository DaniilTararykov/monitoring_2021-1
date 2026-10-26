import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {colors, contacts, fonts, motion, safe, type} from '../../../tokens';
import type {Block, Overlay} from '../types';

// Client rule: no full stops or punctuation in headlines (wordmark keeps its comma).
const clean = (t: string) => t.replace(/[.,:;!?]+/g, '').replace(/ +\n/g, '\n').trim();

const display: React.CSSProperties = {
  fontFamily: fonts.display,
  color: colors.ivory,
  textTransform: 'uppercase',
  fontWeight: 400,
  margin: 0,
  whiteSpace: 'pre-line',
};

const mono: React.CSSProperties = {
  fontFamily: fonts.mono,
  color: colors.ivory,
  margin: 0,
  whiteSpace: 'pre-line',
};

const Star: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={colors.star}
      d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z"
    />
  </svg>
);

const Hours: React.FC<{mode: 'split' | 'compact' | 'weekend'}> = ({mode}) => {
  const s: React.CSSProperties = {...mono, fontWeight: 500, fontSize: type.caption.size, lineHeight: 1.3};
  if (mode === 'compact')
    return <p style={{...s, textAlign: 'center', fontSize: type.caption.size, letterSpacing: 1, lineHeight: 1.45}}>{contacts.hoursCompact}</p>;
  if (mode === 'weekend')
    return <p style={{...s, textAlign: 'center'}}>{'12:30-15:30\n19:00-00:00'}</p>;
  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 34}}>
      <p style={{...s, alignSelf: 'flex-start'}}>{contacts.hoursWeek}</p>
      <p style={{...s, alignSelf: 'flex-end', textAlign: 'right'}}>{contacts.hoursWeekend}</p>
    </div>
  );
};

export const BlockView: React.FC<{b: Block; align: 'center' | 'left'}> = ({b, align}) => {
  switch (b.t) {
    case 'wordmark':
      return (
        <p style={{...display, textTransform: 'none', fontSize: Math.min(b.size ?? type.wordmark.size, 96), lineHeight: type.wordmark.lineHeight, letterSpacing: type.wordmark.letterSpacing}}>
          {b.text ?? 'Sea, Signora'}
        </p>
      );
    case 'headline':
      return (
        <p style={{...display, fontSize: Math.min(b.size ?? type.headline.size, 72), lineHeight: type.headline.lineHeight, letterSpacing: type.headline.letterSpacing}}>{clean(b.text)}</p>
      );
    case 'sub':
      return (
        <p style={{...mono, fontWeight: 500, textTransform: 'uppercase', fontSize: type.sub.size, letterSpacing: type.sub.letterSpacing, lineHeight: type.sub.lineHeight}}>
          {b.text}
        </p>
      );
    case 'note':
      return (
        <p style={{...mono, fontWeight: 500, fontSize: type.sub.size, letterSpacing: 0.5, lineHeight: type.sub.lineHeight}}>{b.text}</p>
      );
    case 'stars':
      return (
        <div style={{display: 'flex', gap: 14, justifyContent: align === 'center' ? 'center' : 'flex-start'}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={78} />
          ))}
        </div>
      );
    case 'review':
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 34, width: '100%'}}>
          <p style={{...mono, textTransform: 'uppercase', fontSize: type.small.size + 4, letterSpacing: type.small.letterSpacing, lineHeight: type.small.lineHeight}}>
            {b.text}
          </p>
          {b.author ? (
            <p style={{...mono, fontWeight: 500, fontSize: 44, letterSpacing: 2, alignSelf: 'flex-end', paddingRight: 30}}>— {b.author}</p>
          ) : null}
        </div>
      );
    case 'hours':
      return <Hours mode={b.mode ?? 'split'} />;
    case 'list':
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start'}}>
          {b.items.map((it) => (
            <p key={it} style={{...mono, fontWeight: 500, textTransform: 'uppercase', fontSize: type.small.size + 4, letterSpacing: type.small.letterSpacing, textAlign: 'left'}}>
              — {it}
            </p>
          ))}
        </div>
      );
    case 'rule':
      return <div style={{width: 330, height: 3, background: colors.orange}} />;
    case 'gap':
      return <div style={{height: b.px}} />;
    case 'giant':
      return (
        <p style={{...display, fontSize: Math.min(b.size ?? 140, 150), lineHeight: 0.95, letterSpacing: 1, color: b.color ? colors[b.color] : colors.ivory}}>
          {b.raw ? b.text : clean(b.text)}
        </p>
      );
    case 'kicker':
      return (
        <p style={{...mono, fontWeight: 500, textTransform: 'uppercase', fontSize: 26, letterSpacing: 6, opacity: b.color ? 1 : 0.85, color: b.color ? colors[b.color] : undefined}}>{b.text}</p>
      );
  }
};

// Gap between a block and the one before it: tight under headlines, looser elsewhere.
const gapBefore = (prev: Block | undefined, cur: Block) => {
  if (!prev) return 0;
  if (cur.t === 'gap' || prev.t === 'gap') return 0;
  if ((prev.t === 'headline' || prev.t === 'wordmark') && (cur.t === 'sub' || cur.t === 'note')) return 10;
  if (prev.t === 'headline' && cur.t === 'headline') return 0;
  if (prev.t === 'kicker') return 14;
  if (prev.t === 'giant' && (cur.t === 'sub' || cur.t === 'note')) return 22;
  if (cur.t === 'rule' || prev.t === 'rule') return 26;
  if (cur.t === 'review' || prev.t === 'stars') return 40;
  return 30;
};

export const OverlayView: React.FC<{o: Overlay}> = ({o}) => {
  const frame = useCurrentFrame();
  const align = o.align ?? 'center';
  const delay = o.delay ?? 4;
  const pos: React.CSSProperties =
    o.y !== undefined
      ? {top: o.y}
      : o.position === 'top'
      ? {top: safe.top + 20}
      : o.position === 'bottom'
        ? {bottom: safe.bottom + 40}
        : {top: 0, bottom: 0, justifyContent: 'center'};
  return (
    <div
      style={{
        position: 'absolute',
        left: safe.side,
        right: safe.side,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        ...pos,
      }}
    >
      {o.blocks.map((b, i) => {
        const start = delay + i * motion.textStaggerFrames;
        const p =
          o.anim === 'static'
            ? 1
            : interpolate(frame, [start, start + motion.textFadeFrames], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
        return (
          <div
            key={i}
            style={{
              width: b.t === 'hours' || b.t === 'review' ? '100%' : undefined,
              marginTop: gapBefore(o.blocks[i - 1], b),
              opacity: p,
              transform: `translateY(${(1 - p) * motion.textRisePx}px)`,
            }}
          >
            <BlockView b={b} align={align} />
          </div>
        );
      })}
    </div>
  );
};
