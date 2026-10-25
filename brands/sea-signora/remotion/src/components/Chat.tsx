import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts, safe} from '../../../tokens';
import type {ChatPair} from '../types';

// "Your problem / Our solution" rubric (published as IMG_9770): olive ground,
// grey chat bubbles on the left, square dish photos on the right, popping in one by one.
const pop = (frame: number, at: number) =>
  interpolate(frame, [at, at + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});

export const Chat: React.FC<{pairs: ChatPair[]; step: number}> = ({pairs, step}) => {
  const frame = useCurrentFrame();
  const rowH = 290;
  const label: React.CSSProperties = {fontFamily: fonts.display, fontSize: 46, color: colors.night, opacity: 0.8};
  return (
    <AbsoluteFill style={{background: colors.olive}}>
      <div style={{position: 'absolute', top: safe.top + 40, left: 90, right: 90, display: 'flex', justifyContent: 'space-between'}}>
        <span style={label}>Your problem</span>
        <span style={{...label, marginRight: 20}}>Our solution</span>
      </div>
      {pairs.map((p, i) => {
        const tq = 18 + i * step;
        const ta = tq + Math.round(step * 0.45);
        const q = pop(frame, tq);
        const a = pop(frame, ta);
        const top = safe.top + 150 + i * rowH;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute', left: 70, top: top + 100, transform: `scale(${q})`, transformOrigin: 'left center',
                background: '#4A4943', color: colors.ivory, fontFamily: fonts.mono, fontWeight: 500, fontSize: 30,
                padding: '18px 30px', borderRadius: 40, maxWidth: 520,
              }}
            >
              {p.problem}
            </div>
            <div
              style={{
                position: 'absolute', right: 80, top, width: 260, height: 260, borderRadius: 26, overflow: 'hidden',
                transform: `scale(${a}) rotate(${(1 - a) * -8}deg)`, boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              }}
            >
              <Img src={staticFile(`photos/${p.solution}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
