import React from 'react';
import {Composition} from 'remotion';
import {video} from '../../tokens';
import {BrandSheet} from './BrandSheet';
import {SEQ_S, SPLIT_S, TwoRecipesSeq, TwoRecipesSplit} from './TwoRecipes';
import {RECIPE_CARD_S, RecipeCard} from './RecipeCard';
import {EditorReel, editorDuration, type EditorConfig} from './EditorReel';
import {BlackoutReel, DURATION_S, FPS} from './BlackoutReel';
import {StoryVideo, storyFrames} from './Story';
import {stories} from './stories';
import {pack2} from './pack2';
import {pack3} from './pack3';
import {week4} from './week4';
import type {Story} from './types';

const Story: React.FC<{story: Story; guides?: boolean}> = (p) => <StoryVideo {...p} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="BrandSheet" component={BrandSheet} durationInFrames={300} fps={video.fps} width={2600} height={1500} />
    {['a', 'b', 'c', 'd'].map((v) => (
      <Composition key={v} id={v === 'a' ? 'BlackoutReel' : `BlackoutReel-${v}`} component={BlackoutReel} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{withAudio: true, variant: v}} />
    ))}
    <Composition
      id="EditorReel"
      component={EditorReel}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={552}
      defaultProps={{config: {name: 'demo', mode: 'split', title: 'Two recipes of one evening', titleFont: 'display', music: 'ref-art-of-hands', beatsPerCut: 6, grade: true,
        shots: [{a: {clip: 'IMG_0633', start: 3.9, fy: 73}, b: {clip: 'IMG_0763', start: 2.6, fy: 56}}]} as EditorConfig}}
      calculateMetadata={({props}) => ({durationInFrames: editorDuration(props.config)})}
    />
    <Composition id="TwoRecipes-split1" component={TwoRecipesSplit} durationInFrames={Math.round(SPLIT_S * 30)} fps={30} width={1080} height={1920} defaultProps={{variant: 's1'}} />
    <Composition id="TwoRecipes-split2" component={TwoRecipesSplit} durationInFrames={Math.round(SPLIT_S * 30)} fps={30} width={1080} height={1920} defaultProps={{variant: 's2'}} />
    <Composition id="TwoRecipes-sequence" component={TwoRecipesSeq} durationInFrames={Math.round(SEQ_S * 30)} fps={30} width={1080} height={1920} />
    <Composition id="TwoRecipes-card" component={RecipeCard} durationInFrames={Math.round(RECIPE_CARD_S * 30)} fps={30} width={1080} height={1920} />
    {[...stories, ...pack2, ...pack3, ...week4].map((s) => (
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
