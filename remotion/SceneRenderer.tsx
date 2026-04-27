import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneData } from './MainComposition';

export const SceneRenderer: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animation cycle based on scene_id
  const animationType = scene.scene_id % 6;

  // Common scale/translate calculations
  const scaleIn = interpolate(frame, [0, durationInFrames], [1, 1.15], { extrapolateRight: 'clamp' });
  const scaleOut = interpolate(frame, [0, durationInFrames], [1.15, 1], { extrapolateRight: 'clamp' });
  
  const panRight = interpolate(frame, [0, durationInFrames], [0, -5], { extrapolateRight: 'clamp' });
  const panLeft = interpolate(frame, [0, durationInFrames], [-5, 0], { extrapolateRight: 'clamp' });
  const panUp = interpolate(frame, [0, durationInFrames], [0, -5], { extrapolateRight: 'clamp' });
  const panDown = interpolate(frame, [0, durationInFrames], [-5, 0], { extrapolateRight: 'clamp' });

  let transform = '';
  switch (animationType) {
    case 0: // zoom in
      transform = `scale(${scaleIn})`;
      break;
    case 1: // slide left (pan right)
      transform = `scale(1.15) translateX(${panRight}%)`;
      break;
    case 2: // zoom out
      transform = `scale(${scaleOut})`;
      break;
    case 3: // slide up (pan down)
      transform = `scale(1.15) translateY(${panUp}%)`;
      break;
    case 4: // slide right (pan left)
      transform = `scale(1.15) translateX(${panLeft}%)`;
      break;
    case 5: // slide down (pan up)
      transform = `scale(1.15) translateY(${panDown}%)`;
      break;
    default:
      transform = `scale(${scaleIn})`;
  }

  // Fade-in transition at the start of the scene (first 15 frames)
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      {scene.image_url ? (
        <AbsoluteFill style={{ opacity }}>
          <Img 
            src={scene.image_url} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transform 
            }} 
          />
        </AbsoluteFill>
      ) : (
        <div style={{ color: 'white', fontSize: 60, fontFamily: 'sans-serif', opacity }}>
          Scene {scene.scene_id}
        </div>
      )}
    </AbsoluteFill>
  );
};
