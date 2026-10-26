import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Chip} from './components/Visual';
import {loadBrandFonts} from './fonts';
import type {Cta} from './types';

loadBrandFonts();

// A finished poster (e.g. a partner's artwork) with our link-sticker chip laid on top, so the real Instagram
// link sticker can be placed exactly over it. src is relative to public/.
export type PosterChipProps = {src: string; cta: Cta};
export const PosterChip: React.FC<PosterChipProps> = ({src, cta}) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <Chip cta={cta} />
  </AbsoluteFill>
);
