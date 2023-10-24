'use client';

import { MacBook } from '@/components/MysteryBox/components/MacBook';
import { CameraControls, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';

const MACBOOK_SCALE = 1;

export const Scene = () => {
  const [isMacBookOpen, setIsMacBookOpen] = useState<boolean>(true);
  return (
    <Suspense fallback={<div>MacBook Loading...</div>}>
      <Canvas
        shadows
        camera={{
          position: [3, 5, 10],
        }}
      >
        <ambientLight intensity={0.4} />
        <Environment preset="studio" />
        <MacBook
          rotation={[0, 0, 0]}
          scale={[MACBOOK_SCALE, MACBOOK_SCALE, MACBOOK_SCALE]}
          isOpen={isMacBookOpen}
          mockDisplay={false}
          onClick={(e) => {
            e.stopPropagation();
            setIsMacBookOpen((cur) => !cur);
          }}
        />
        <CameraControls makeDefault minDistance={3} maxDistance={1500} />
      </Canvas>
    </Suspense>
  );
};
