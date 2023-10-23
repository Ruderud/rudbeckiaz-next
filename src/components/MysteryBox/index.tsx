'use client';

import { RepeatWrapping, SRGBColorSpace } from 'three';
import { CameraControls, Edges, Loader, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber';
import { MacBook, Side, DirtCube, LightStage } from './components';
import { Suspense, use, useRef } from 'react';
import { BackGroundScene } from '../ThreejsScenes/BackGround';

type MysteryBoxProps = ThreeElements['mesh'];
const MACBOOK_SCALE = 0.2;

const MysteryBoxScene = ({ ...props }: MysteryBoxProps) => {
  const macBookSideBgMap = useTexture('/mac-background.png');
  const mineCraftSideBgMap = useTexture('/assets/grass.jpg');

  mineCraftSideBgMap.wrapS = RepeatWrapping;
  mineCraftSideBgMap.wrapT = RepeatWrapping;
  mineCraftSideBgMap.anisotropy = 4;
  mineCraftSideBgMap.colorSpace = SRGBColorSpace;
  mineCraftSideBgMap.repeat.set(4, 4);

  const { camera } = useThree();

  const onClickSide = () => {
    console.log('camera rotation', camera.rotation);
  };

  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[4, 4, 4]} />
      <Edges />
      <Side bgMap={macBookSideBgMap} bg="rgb(101, 221, 237)" index={0} onClickSide={onClickSide}>
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
      <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1} onClickSide={onClickSide}>
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
  );
};

const MysteryBox = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [5, 2, 5],
        }}
      >
        <Suspense fallback={null}>
          <BackGroundScene isStaticPage={false} />
          <MysteryBoxScene />
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
    </>
  );
};

export default MysteryBox;
