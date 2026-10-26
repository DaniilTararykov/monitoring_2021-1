import React from 'react';
import {Composition} from 'remotion';
import {video} from '../../tokens';
import {BrandSheet} from './BrandSheet';
import {StoryVideo, storyFrames} from './Story';
import {stories} from './stories';
import {pack2} from './pack2';
import {pack3} from './pack3';
import type {Story} from './types';

const Story: React.FC<{story: Story; guides?: boolean}> = (p) => <StoryVideo {...p} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="BrandSheet" component={BrandSheet} durationInFrames={300} fps={video.fps} width={2600} height={1500} />
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
