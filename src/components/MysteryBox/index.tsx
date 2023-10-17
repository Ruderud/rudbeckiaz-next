'use client';

import * as THREE from 'three';
import { Edges, Environment, MeshPortalMaterial, useGLTF, useScroll, useTexture } from '@react-three/drei';
import { ThreeElements, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { MyRoom } from './components';

function Side({ rotation = [0, 0, 0], bg = '#f0f0f0', children, index, flat = false, bgMap = null }: any) {
  const mesh = useRef<any>();
  // const { worldUnits } = useControls({ worldUnits: false });
  const { nodes } = useGLTF('/transforms/aobox-transformed.glb', true, true) as any;
  useFrame((state, delta) => {
    if (!mesh.current) return;
    // mesh.current.rotation.x = mesh.current.rotation.y += delta;
  });

  return (
    <MeshPortalMaterial worldUnits={true} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry} scale={[2, 2, 2]}>
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} map={bgMap} color={bg} />
        <spotLight
          castShadow
          color={bg}
          intensity={2}
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          shadow-normalBias={0.05}
          shadow-bias={0.0001}
        />
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
}

const MineCraftSide = ({ rotation = [0, 0, 0], bg = '#f0f0f0', children, index, flat = false }: any) => {
  const mesh = useRef<any>();
  const { nodes } = useGLTF('/transforms/aobox-transformed.glb', true, true) as any;
  const [map] = useLoader(THREE.TextureLoader as any, ['/assets/grass.jpg']);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.colorSpace = THREE.SRGBColorSpace;
  map.repeat.set(4, 4);

  return (
    <MeshPortalMaterial worldUnits={true} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry} scale={[2, 2, 2]}>
        <meshStandardMaterial aoMapIntensity={1} map={map} color={bg} />
        <spotLight
          castShadow
          // color={bg}
          intensity={2}
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          shadow-normalBias={0.05}
          shadow-bias={0.0001}
        />
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
};

type CubeProps = ThreeElements['mesh'];

const Cube = (props: CubeProps) => {
  const dirtTexture = useTexture('/assets/dirt.jpg');
  return (
    <mesh {...props} receiveShadow castShadow>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial attach={`material-${index}`} key={index} map={dirtTexture} />
      ))}
      <boxGeometry />
    </mesh>
  );
};

type MysteryBoxProps = ThreeElements['mesh'] & {};

export const MysteryBox = ({ ...props }: MysteryBoxProps) => {
  const { nodes } = useGLTF('/transforms/level-react-draco.glb') as any;
  const macBookSide = useTexture('/mac-background.png');

  return (
    <>
      <mesh castShadow receiveShadow {...props}>
        <boxGeometry args={[4, 4, 4]} />
        <Edges />
        <Side bgMap={macBookSide} bg="rgb(101, 221, 237)" index={0}>
          <MyRoom />
        </Side>
        <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
          <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, Math.PI / 2]} bg="lightgreen" index={2}>
          <boxGeometry args={[1.15, 1.15, 1.15]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
          <octahedronGeometry />
        </Side>
        <MineCraftSide rotation={[0, -Math.PI / 2, 0]} bg="rgb(97, 219, 251)" index={4}>
          <Cube position={[0, 0, 0]} />
        </MineCraftSide>
        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side>
      </mesh>
    </>
  );
};
