'use client';

import { GridBox } from './GridBox';

interface AxisViewProps {
  maxDepth: number;
  depth: number;
}

export const AxisView = ({ maxDepth, depth }: AxisViewProps) => {
  return (
    <div
      id="view-layer"
      className="relative top-[-94vh] w-screen h-[94vh] z-[-10] flex justify-center items-center"
      style={{
        perspective: `${maxDepth}px`,
        perspectiveOrigin: '50% 35%',
        transformStyle: 'preserve-3d',
      }}
    >
      <GridBox
        canvasProps={{
          width: 300,
          height: 300,
          style: {
            position: 'absolute',
            transform: `translate3d(-150px,0px,${depth + 2000}px) rotatez(0deg) rotateY(90deg) translateY(-100px)`,
          },
        }}
      />
      <GridBox
        canvasProps={{
          width: 300,
          height: 300,
          style: {
            position: 'absolute',
            transform: `translate3d(150px,0px,${depth + 2000}px) rotatez(0deg) rotateY(-90deg) translateY(-100px)`,
          },
        }}
      />
      <GridBox
        canvasProps={{
          width: 300,
          height: 300,
          style: {
            position: 'absolute',
            transform: `translate3d(0px,0px,${depth + 1850}px) rotatez(0deg) rotateY(0deg) translateY(-100px)`,
          },
        }}
      />
      <GridBox
        canvasProps={{
          width: 300,
          height: 300,
          style: {
            position: 'absolute',
            transform: `translate3d(0px,50px,${depth + 2000}px) rotateX(90deg) rotateY(0deg) translateY(-100px)`,
          },
        }}
      />
    </div>
  );
};
