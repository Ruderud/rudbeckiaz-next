'use client';

import * as THREE from 'three';
import { Edges, useTexture } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { MacBook, Side, DirtCube, LightStage } from './components';

type MysteryBoxProps = ThreeElements['mesh'];
const MACBOOK_SCALE = 0.2;

export const MysteryBox = ({ ...props }: MysteryBoxProps) => {
  const macBookSideBgMap = useTexture('/mac-background.png');
  const mineCraftSideBgMap = useTexture('/assets/grass.jpg');
  mineCraftSideBgMap.wrapS = THREE.RepeatWrapping;
  mineCraftSideBgMap.wrapT = THREE.RepeatWrapping;
  mineCraftSideBgMap.anisotropy = 4;
  mineCraftSideBgMap.colorSpace = THREE.SRGBColorSpace;
  mineCraftSideBgMap.repeat.set(4, 4);

  return (
    <>
      <mesh castShadow receiveShadow {...props}>
        <boxGeometry args={[4, 4, 4]} />
        <Edges />
        <Side bgMap={macBookSideBgMap} bg="rgb(101, 221, 237)" index={0}>
          <MacBook
            receiveShadow
            castShadow
            position={[0, -0.5, -0.3]}
            rotation={[0, Math.PI / 3, 0]}
            scale={[MACBOOK_SCALE, MACBOOK_SCALE, MACBOOK_SCALE]}
            isOpen={true}
            mockDisplay={false}
          />
        </Side>
        <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
          <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, Math.PI / 2]} index={2} spotLightOff>
          <LightStage />
        </Side>
        <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
          <octahedronGeometry />
        </Side>
        <Side bgMap={mineCraftSideBgMap} rotation={[0, -Math.PI / 2, 0]} index={4}>
          <DirtCube position={[0, 0, 0]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side>
      </mesh>
    </>
  );
};
