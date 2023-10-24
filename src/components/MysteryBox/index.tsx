'use client';

import * as THREE from 'three';
import { CameraControls, Edges, Environment, Loader, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber';
import { MacBook, Side, DirtCube, LightStage } from './components';
import { Suspense, use, useEffect, useRef, useState } from 'react';
import { BackGroundScene } from '../ThreejsScenes/BackGround';

type MysteryBoxProps = ThreeElements['mesh'];
const MACBOOK_SCALE = 0.2;

const MysteryBoxScene = ({ ...props }: MysteryBoxProps) => {
  const macBookSideBgMap = useTexture('/mac-background.png');
  const mineCraftSideBgMap = useTexture('/assets/grass.jpg');

  mineCraftSideBgMap.wrapS = THREE.RepeatWrapping;
  mineCraftSideBgMap.wrapT = THREE.RepeatWrapping;
  mineCraftSideBgMap.anisotropy = 4;
  mineCraftSideBgMap.colorSpace = THREE.SRGBColorSpace;
  mineCraftSideBgMap.repeat.set(4, 4);

  const boxRef = useRef<any>();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const { camera } = useThree();

  const handleDiceClick = (event: any) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(boxRef.current.children);

    if (intersects.length > 0) {
      const intersectedFace = intersects[0];
      console.log('intersectedFace', intersectedFace.object.name);
    }
  };

  const faces: any[] = [
    { index: 0, position: [0, 0, 2], rotation: [0, 0, 0], color: 'rgba(0,0,0,0.2)' },
    { index: 1, position: [0, 0, -2], rotation: [Math.PI, 0, 0], color: 'green' },
    { index: 2, position: [2, 0, 0], rotation: [0, Math.PI / 2, 0], color: 'yellow' },
    { index: 3, position: [-2, 0, 0], rotation: [0, -Math.PI / 2, 0], color: 'orange' },
    { index: 4, position: [0, 2, 0], rotation: [-Math.PI / 2, 0, 0], color: 'white' },
    { index: 5, position: [0, -2, 0], rotation: [Math.PI / 2, 0, 0], color: 'blue' },
  ];

  const renderer = new THREE.WebGLRenderer({ alpha: true });

  return (
    <>
      <mesh castShadow receiveShadow {...props}>
        <group ref={boxRef} onClick={handleDiceClick}>
          {faces.map((face) => (
            <mesh
              name={face.color}
              key={face.index}
              userData={{ index: face.index }}
              position={face.position}
              rotation={face.rotation}
              geometry={new THREE.PlaneGeometry(4, 4)}
              material={new THREE.MeshBasicMaterial({ color: face.color, opacity: 0, transparent: true })}
            />
          ))}
        </group>
        <boxGeometry args={[4, 4, 4]} />
        <Edges />
        <Side bgMap={macBookSideBgMap} bg="rgb(101, 221, 237)" index={0}>
          <MacBook
            name="macbook"
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
          <DirtCube name="dirtCube" position={[0, 0, 0]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side>
      </mesh>
    </>
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
        <pointLight position={[10, 10, 10]} />
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
