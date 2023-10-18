'use client';

import { Canvas } from '@react-three/fiber';
import { BackGroundScene } from '../ThreejsScenes/BackGround';
import { ReactNode } from 'react';
import { Loader } from '@react-three/drei';
import { usePathname } from 'next/navigation';

const ACTIVE_PAGES = ['/about', '/scrawl'];

export const Background = ({ children }: { children: ReactNode }) => {
  const currentPage = usePathname();
  const isActivate = ACTIVE_PAGES.includes(currentPage);
  return (
    <>
      {isActivate && (
        <>
          <Canvas
            shadows
            style={{
              position: 'absolute',
              zIndex: -9999,
            }}
            camera={{
              position: [0, 5, 15],
            }}
          >
            <BackGroundScene isStaticPage={true} />
          </Canvas>
          <Loader />
        </>
      )}
      {children}
    </>
  );
};
