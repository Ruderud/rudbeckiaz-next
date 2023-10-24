'use client';

import * as THREE from 'three';
import { CameraControls, Edges, Loader, useTexture } from '@react-three/drei';
import { Canvas, ThreeElements, useThree } from '@react-three/fiber';
import { MacBook, Side, DirtCube, LightStage } from './components';
import { Suspense, useRef, useState } from 'react';
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

  const faces: any[] = [
    { index: 0, position: [0, 0, 2], rotation: [0, 0, 0], href: '/experimentals/play' },
    { index: 1, position: [0, 0, -2], rotation: [Math.PI, 0, 0], href: '' },
    { index: 2, position: [2, 0, 0], rotation: [0, Math.PI / 2, 0], href: '/toy-projects/macbook' },
    { index: 3, position: [-2, 0, 0], rotation: [0, -Math.PI / 2, 0], href: '' },
    { index: 4, position: [0, 2, 0], rotation: [-Math.PI / 2, 0, 0], href: '' },
    { index: 5, position: [0, -2, 0], rotation: [Math.PI / 2, 0, 0], href: '' },
  ];
  const [hoveredFaceIdx, setHoveredFaceIdx] = useState<number | null>(null);

  type Corrd = {
    x: number;
    y: number;
    z: number;
  };
  const [capturedCameraRotation, setCapturedCameraRotation] = useState<Corrd | null>(null);

  return (
    <>
      <mesh castShadow receiveShadow {...props}>
        <group
          ref={boxRef}
          onPointerMove={(e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(boxRef.current.children);
            if (intersects.length > 0) {
              const intersectedFace = intersects[0];
              setHoveredFaceIdx(intersectedFace.object.userData.index);
            }
          }}
          onPointerOut={() => {
            setHoveredFaceIdx(null);
          }}
          onPointerDown={() => {
            setCapturedCameraRotation({
              x: camera.rotation.x,
              y: camera.rotation.y,
              z: camera.rotation.z,
            });
          }}
          onPointerUp={(e) => {
            if (!capturedCameraRotation) return;
            const isFixed =
              Math.abs(camera.rotation.x - capturedCameraRotation.x) < 0.1 &&
              Math.abs(camera.rotation.y - capturedCameraRotation.y) < 0.1 &&
              Math.abs(camera.rotation.z - capturedCameraRotation.z) < 0.1;

            if (isFixed) {
              mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

              raycaster.setFromCamera(mouse, camera);

              const intersects = raycaster.intersectObjects(boxRef.current.children);

              if (intersects.length > 0) {
                const intersectedFace = intersects[0];
                if (faces[Number(intersectedFace.object.name)].href) {
                  window.location.href = faces[Number(intersectedFace.object.name)].href;
                }
              }
            } else {
              setCapturedCameraRotation(null);
            }
          }}
        >
          {faces.map((face) => (
            <mesh
              name={face.index}
              key={face.index}
              userData={{ index: face.index }}
              position={face.position}
              rotation={face.rotation}
              geometry={new THREE.PlaneGeometry(4, 4)}
              material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
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
            isOpen={hoveredFaceIdx === 2}
            mockDisplay={false}
          />
        </Side>
        <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
          <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, Math.PI / 2]} index={2} spotLightOff>
          <LightStage isHover={hoveredFaceIdx === 4} />
        </Side>
        <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
          <octahedronGeometry />
        </Side>
        <Side bgMap={mineCraftSideBgMap} rotation={[0, -Math.PI / 2, 0]} index={4}>
          <DirtCube name="dirtCube" position={[0, 0, 0]} isHover={hoveredFaceIdx === 0} />
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
