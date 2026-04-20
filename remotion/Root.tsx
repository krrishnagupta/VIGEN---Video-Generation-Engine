import { Composition, getInputProps } from 'remotion';
import { MainComposition, MainCompositionProps } from './MainComposition';

const defaultProps: MainCompositionProps = {
  scenes: [],
  totalDurationInFrames: 300
};

export const RemotionRoot: React.FC = () => {
  // Catch input props passed via CLI or Lambda
  const inputProps = getInputProps();
  const totalFrames = typeof inputProps.totalDurationInFrames === 'number' 
    ? inputProps.totalDurationInFrames 
    : defaultProps.totalDurationInFrames;

  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={inputProps as any}
      />
    </>
  );
};
