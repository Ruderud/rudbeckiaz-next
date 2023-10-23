'use client';

import * as THREE from 'three';
import { CameraControls, Edges, Loader, useGLTF, useTexture } from '@react-three/drei';
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

  // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);

  const boxRef = useRef<any>();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // useEffect(() => {
  //   const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  //   const object = boxRef.current;
  //   const onMouseDown = (e: any) => {
  //     var vectorMouse = new THREE.Vector3( //vector from camera to mouse
  //       (-(window.innerWidth / 2 - e.clientX) * 2) / window.innerWidth,
  //       ((window.innerHeight / 2 - e.clientY) * 2) / window.innerHeight,
  //       -1 / Math.tan((22.5 * Math.PI) / 180)
  //     ); //22.5 is half of camera frustum angle 45 degree
  //     vectorMouse.applyQuaternion(camera.quaternion);
  //     vectorMouse.normalize();

  //     var vectorObject = new THREE.Vector3(); //vector from camera to object
  //     vectorObject.set(object.x - camera.position.x, object.y - camera.position.y, object.z - camera.position.z);
  //     vectorObject.normalize();
  //     console.log('vectorMouse', vectorMouse);
  //     console.log('vectorObject', vectorObject);
  //     if ((vectorMouse.angleTo(vectorObject) * 180) / Math.PI < 1) {
  //       //mouse's position is near object's position
  //       console.log('vectorMouse', vectorMouse);
  //       console.log('vectorObject', vectorObject);
  //     }
  //   };
  //   document.addEventListener('mousedown', onMouseDown, false);
  //   return () => {
  //     document.removeEventListener('mousedown', onMouseDown, false);
  //   };
  // }, []);

  const onClickSide = (element?: string) => () => {
    // console.log('element ', element);
  };

  const { camera } = useThree();

  const handleDiceClick = (event: any) => {
    // Calculate normalized mouse coordinates (-1 to 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // console.log('boxRef.current', boxRef.current);

    const intersects = raycaster.intersectObjects(boxRef.current.children);

    console.log('intersects', intersects, boxRef.current.children);

    if (intersects.length > 0) {
      const intersectedFace = intersects[0];
      console.log('intersectedFace', intersectedFace.object.name);
    }
  };

  const faces: any[] = [
    { index: 0, position: [0, 0, 2], color: 'red' },
    { index: 1, position: [0, 0, -2], rotation: [Math.PI, 0, 0], color: 'green' },
    { index: 2, position: [2, 0, 0], rotation: [0, -Math.PI / 2, 0], color: 'yellow' },
    { index: 3, position: [-2, 0, 0], rotation: [0, Math.PI / 2, 0], color: 'orange' },
    { index: 4, position: [0, 2, 0], rotation: [-Math.PI / 2, 0, 0], color: 'white' },
    { index: 5, position: [0, -2, 0], rotation: [Math.PI / 2, 0, 0], color: 'blue' },
  ];

  return (
    <>
      <group ref={boxRef} onClick={handleDiceClick}>
        {faces.map((face) => (
          <mesh
            name={face.color}
            key={face.index}
            userData={{ index: face.index }}
            position={face.position}
            rotation={face.rotation}
          >
            <planeGeometry args={[4, 4]} />
            <meshBasicMaterial color={face.color} />
          </mesh>
        ))}
      </group>
      <mesh castShadow receiveShadow {...props}>
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
