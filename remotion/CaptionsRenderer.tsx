import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionWord } from './MainComposition';

export const CaptionsRenderer: React.FC<{ captions: CaptionWord[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert frame to seconds
  const currentSeconds = frame / fps;

  // Find the word that overlaps with currentSeconds
  const currentWord = captions.find(
    (c) => currentSeconds >= c.start && currentSeconds <= c.end
  );

  if (!currentWord) return null;

  return (
    <AbsoluteFill 
      style={{ 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: '20%' 
      }}
    >
      <div 
        style={{
          fontSize: '70px',
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'uppercase',
          textShadow: '0px 0px 10px rgba(0,0,0,0.8), 0px 4px 4px rgba(0,0,0,0.8)',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          WebkitTextStroke: '2px black'
        }}
      >
        {currentWord.text}
      </div>
    </AbsoluteFill>
  );
};
