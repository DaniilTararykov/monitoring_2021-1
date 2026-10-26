import React from 'react';
import {Composition} from 'remotion';
import {video} from '../../tokens';
import {BrandSheet} from './BrandSheet';
import {BlackoutReel, DURATION_S, FPS} from './BlackoutReel';
import {StoryVideo, storyFrames} from './Story';
import {stories} from './stories';
import {pack2} from './pack2';
import {pack3} from './pack3';
import type {Story} from './types';

const Story: React.FC<{story: Story; guides?: boolean}> = (p) => <StoryVideo {...p} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="BrandSheet" component={BrandSheet} durationInFrames={300} fps={video.fps} width={2600} height={1500} />
    {['a', 'b', 'c', 'd'].map((v) => (
      <Composition key={v} id={v === 'a' ? 'BlackoutReel' : `BlackoutReel-${v}`} component={BlackoutReel} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{withAudio: true, variant: v}} />
    ))}
    {[...stories, ...pack2, ...pack3].map((s) => (
      <Composition
        key={s.id}
        id={`S${s.id}`}
        component={Story}
        durationInFrames={storyFrames(s)}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{story: s, guides: false}}
      />
    ))}
  </>
);
