'use client';

import { Cloud, Sky, Sparkles, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GlobalContext } from 'context/GlobalContext';
import { useContext, useRef } from 'react';

type BackGroundSceneProps = {
  isStaticPage: boolean;
};

export const BackGroundScene = ({ isStaticPage }: BackGroundSceneProps) => {
  const { isDarkMode } = useContext(GlobalContext);
  const cloudRef = useRef<THREE.Mesh>(null);
  const skyRef = useRef<any>(null);
  useFrame((state) => {
    if (!cloudRef.current) return;

    if (!isDarkMode) {
      if (cloudRef.current.position.x > 30) {
        cloudRef.current.position.x = -30;
      } else {
        cloudRef.current.position.x += 0.05;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <Sky
        ref={skyRef}
        sunPosition={isDarkMode ? [0, 0, 0] : [10, 2, 1]}
        rayleigh={0.8}
        turbidity={30}
        mieCoefficient={0.008}
        mieDirectionalG={0.9999}
      />
      {isDarkMode ? (
        <>
          {isStaticPage && (
            <>
              <Sparkles position={[0, 8, 0]} count={10} scale={10} size={15} speed={0} />
              <Sparkles position={[0, 8, 0]} count={10} scale={10} size={10} speed={0} />
              <Sparkles position={[0, 0, 0]} count={10} scale={10} size={15} speed={0} />
              <Sparkles position={[0, 0, 0]} count={10} scale={10} size={10} speed={0} />
              <Sparkles position={[0, -8, 0]} count={10} scale={10} size={15} speed={0} />
              <Sparkles position={[0, -8, 0]} count={10} scale={10} size={10} speed={0} />
            </>
          )}
          <Stars saturation={0} count={5000} speed={1} factor={10} fade />
        </>
      ) : (
        <mesh ref={cloudRef} position={[0, 15, 0]}>
          <Cloud
            opacity={0.8}
            speed={0.4} // Rotation speed
            width={15} // Width of the full cloud
            depth={0.8} // Z-dir depth
            segments={100} // Number of particles
            color={'rgb(233, 233, 233)'}
          />
        </mesh>
      )}
    </>
  );
};
