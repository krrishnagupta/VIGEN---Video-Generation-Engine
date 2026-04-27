import React from 'react';
import { AbsoluteFill, Sequence, Audio, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneRenderer } from './SceneRenderer';
import { CaptionsRenderer } from './CaptionsRenderer';

export type CaptionWord = {
  text: string;
  start: number;
  end: number;
};

export type SceneData = {
  scene_id: number;
  startFrame: number;
  durationInFrames: number;
  image_url: string;
  voiceover_url?: string;
  captions?: CaptionWord[];
};

export type MainCompositionProps = {
  scenes: SceneData[];
  totalDurationInFrames: number;
};

export const MainComposition: React.FC<MainCompositionProps> = ({ scenes }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {scenes.map((scene) => (
        <Sequence
          key={scene.scene_id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          {/* Scene Visuals */}
          <SceneRenderer scene={scene} />

          {/* Voiceover if present */}
          {scene.voiceover_url && (
            <Audio src={scene.voiceover_url} />
          )}

          {/* Captions if present */}
          {scene.captions && scene.captions.length > 0 && (
            <CaptionsRenderer captions={scene.captions} />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
