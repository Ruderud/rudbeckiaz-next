import * as THREE from 'three';
import { Edges, Environment, MeshPortalMaterial, useGLTF, useScroll } from '@react-three/drei';
import { ThreeElements, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MyRoom } from './components';

function Side({ rotation = [0, 0, 0], bg = '#f0f0f0', children, index, flat = false }: any) {
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
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
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

type MysteryBoxProps = ThreeElements['mesh'] & {};

export const MysteryBox = ({ ...props }: MysteryBoxProps) => {
  const { nodes } = useGLTF('/transforms/level-react-draco.glb') as any;
  return (
    <>
      <mesh castShadow receiveShadow {...props}>
        <boxGeometry args={[4, 4, 4]} />
        <Edges />
        <Side bg="purple" index={0}>
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
        <Side rotation={[0, -Math.PI / 2, 0]} bg="rgb(97, 219, 251)" index={4}>
          {/* <icosahedronGeometry /> */}
          <mesh geometry={nodes.React.geometry} rotation={[Math.PI / 2, 0, Math.PI / 2]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side>
      </mesh>
    </>
  );
};
