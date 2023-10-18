'use client';

import { CameraControls, Loader } from '@react-three/drei';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BackGroundScene } from '@/components/ThreejsScenes/BackGround';
import { MysteryBox } from '@/components/MysteryBox';

export default function HomePage() {
  return (
    <main className="absolute z-10 top-0 w-screen h-screen">
      <Canvas
        shadows
        camera={{
          position: [5, 2, 5],
        }}
      >
        <Suspense fallback={null}>
          <BackGroundScene isStaticPage={false} />
          <MysteryBox />
        </Suspense>
        <ambientLight intensity={0.4} />
        <CameraControls
          makeDefault
          minDistance={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? 4 : undefined}
          maxDistance={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? 50 : undefined}
          // current three side only support polarAngle
          // minPolarAngle={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? Math.PI / 2 : undefined} // 윗면 제한
          maxPolarAngle={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? Math.PI / 2 : undefined} // 아랫면 제한
          maxAzimuthAngle={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? Math.PI / 2 : undefined} // 시계반대방향 회전 제한
          minAzimuthAngle={process.env.NEXT_PUBLIC_BUILD_MODE === 'prod' ? 0 : undefined} // 시계방향 회전 제한
        />
      </Canvas>
      <Loader />
    </main>
  );
}
