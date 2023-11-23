import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { ThreeElements, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

type CubeProps = ThreeElements['mesh'] & {
  isHover?: boolean;
};

export const DirtCube = ({ isHover = false, ...props }: CubeProps) => {
  const cubeRef = useRef<any>();
  const dirtTexture = useTexture(process.env.NEXT_PUBLIC_CDN_BASE_URL + '/minecraft/dirt.jpg');
  useFrame((state) => {
    if (isHover) {
      cubeRef.current.rotation.x += 0.02;
      cubeRef.current.rotation.y += 0.02;
    } else {
      cubeRef.current.rotation.x = 0;
      cubeRef.current.rotation.y = 0;
    }
  });
  return (
    <mesh ref={cubeRef} {...props}>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial attach={`material-${index}`} key={index} map={dirtTexture} />
      ))}
      <boxGeometry />
    </mesh>
  );
};
