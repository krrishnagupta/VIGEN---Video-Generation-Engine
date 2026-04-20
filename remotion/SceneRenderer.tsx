import React from 'react';
import { AbsoluteFill, Img, Video, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData } from './MainComposition';

export const SceneRenderer: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (scene.type === 'wan' && scene.wan_video_url) {
    return (
      <AbsoluteFill>
        <Video 
          src={scene.wan_video_url} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </AbsoluteFill>
    );
  }

  // Fallback mode: animate the static image.
  // Slow zoom-in as a baseline cinematic effect.
  // Can expand to random panning or sliding for variety.
  const isZoomIn = scene.scene_id % 2 === 0;
  
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    isZoomIn ? [1, 1.15] : [1.15, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      {scene.image_url ? (
        <Img 
          src={scene.image_url} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transform: `scale(${scale})` 
          }} 
        />
      ) : (
        <div style={{ color: 'white', fontSize: 60, fontFamily: 'sans-serif' }}>
          Scene {scene.scene_id}
        </div>
      )}
    </AbsoluteFill>
  );
};
