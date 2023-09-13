'use client';

import * as THREE from 'three';
import { CameraControls, Loader, useGLTF, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { DragControls } from 'three-stdlib';
import { MysteryBox } from '../MysteryBox';
import { BackGroundScene } from './components/BackGround';
import { MacBook } from '../MysteryBox/components/MacBook';
import { EffectComposer, Outline, Select, Selection } from '@react-three/postprocessing';

// const Draggable = ({ children, camera }: any) => {
//   const ref = useRef<THREE.Group>(null);
//   const { gl, scene } = useThree();

//   useEffect(() => {
//     const controls = new DragControls(ref.current!.children, camera, gl.domElement);
//     controls.transformGroup = true;

//     controls.addEventListener('drag', () => {
//       gl.render(scene, camera);
//     });
//   }, [camera, gl, scene]);

//   return <group ref={ref}>{children}</group>;
// };

function Model({ open, hinge, ...props }: any) {
  const group = useRef<any>();
  // Load model
  const { nodes, materials } = useGLTF('/transforms/mac-draco.glb') as any;
  // Take care of cursor state on hover
  const [hovered, setHovered] = useState(false);
  useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered]);
  // Make it float in the air when it's opened
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      open ? Math.cos(t / 10) / 10 + 0.25 : 0,
      0.1
    );
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(t / 10) / 4 : 0, 0.1);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, open ? Math.sin(t / 10) / 10 : 0, 0.1);
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      open ? (-2 + Math.sin(t)) / 3 : -4.3,
      0.1
    );
  });
  // The view was auto-generated by: https://github.com/pmndrs/gltfjsx
  // Events and spring animations were added afterwards
  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      dispose={null}
    >
      <group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
          <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
          <mesh material={materials['screen.001']} geometry={nodes['Cube008_2'].geometry} />
        </group>
      </group>
      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
        <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
      </group>
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  );
}

const Scenes = () => {
  // const model = useGLTF('/transforms/Untitled_Scan_14_05_18.glb') as any;
  // console.log(model);

  return (
    <Suspense fallback={null}>
      {/* <BackGroundScene isStaticPage={false} /> */}

      {/* <mesh material={model.materials['material_0']} geometry={model.nodes['mesh_0'].geometry} /> */}
      <MysteryBox />
    </Suspense>
  );
};

export const IntroScroll = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [6, 3, 3],
        }}
      >
        {/* <Selection enabled>
          <EffectComposer autoClear={false}>
            <Outline visibleEdgeColor={0xffffff} hiddenEdgeColor={0xffffff} blur width={1000} edgeStrength={100} />
          </EffectComposer>
          <Select enabled>
            <Scenes />
          </Select>
        </Selection> */}

        <Scenes />
        <ambientLight intensity={0.4} />
        <CameraControls
          makeDefault
          // minDistance={3}
          maxDistance={1500}
          // current three side only support polarAngle
          //   maxPolarAngle={Math.PI / 2}
          //   minPolarAngle={0}
          //   maxAzimuthAngle={Math.PI / 2}
          //   minAzimuthAngle={0}
        />
      </Canvas>
      <Loader />
    </>
  );
};
