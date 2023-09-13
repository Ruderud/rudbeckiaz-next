import * as THREE from 'three';
import { ThreeElements, useFrame } from '@react-three/fiber';
import { MovingLight } from './MovingLight';
import { LightingGrid } from './LightingGrid';
import { SpeakerHolderGrid } from './SpeakerHolderGrid';
import Speaker from './Speaker';
import { useKeyboardControls } from '@react-three/drei';

// TODO: too many lights makes error: FRAGMENT shader texture image units count exceeds MAX_TEXTURE_IMAGE_UNITS(16)
const Celing = (props: ThreeElements['group']) => {
  const [_, get] = useKeyboardControls();

  useFrame((state) => {
    const { enter } = get();
    if (enter) {
    }
  });

  return (
    <>
      <group {...props} receiveShadow>
        {/* <mesh receiveShadow>
          <boxGeometry args={[24, 40, 0.1]} />
          <meshStandardMaterial color={'grey'} />
        </mesh> */}
      </group>

      {/* Stage Front Lighting Grid */}
      <LightingGrid position={[0, 7.8, -8]} length={12} width={0.5} thickness={0.04} />

      {/* Stage Front Lights */}
      <MovingLight position={[-5, 7, -8]} target={[-5, 0, 0]} />
      <MovingLight position={[-3, 7, -8]} target={[-3, 0, 0]} />
      <MovingLight position={[-1, 7, -8]} target={[-1, 0, 0]} />
      <MovingLight position={[1, 7, -8]} target={[1, 0, 0]} />
      <MovingLight position={[3, 7, -8]} target={[3, 0, 0]} />
      <MovingLight position={[5, 7, -8]} target={[5, 0, 0]} />

      {/* Stage Lighting Grid */}
      <LightingGrid position={[0, 7.8, -12]} length={8} width={0.5} thickness={0.04} />
      <LightingGrid position={[0, 7.8, -16]} length={8} width={0.5} thickness={0.04} />
      <LightingGrid
        position={[-3.75, 7.8, -14]}
        rotation={[0, Math.PI / 2, 0]}
        length={3.5}
        width={0.5}
        thickness={0.04}
      />
      <LightingGrid
        position={[3.75, 7.8, -14]}
        rotation={[0, Math.PI / 2, 0]}
        length={3.5}
        width={0.5}
        thickness={0.04}
      />

      {/* Stage Lights */}
      <MovingLight position={[-3.75, 7, -12]} target={[-5, 0, -4]} />
      <MovingLight position={[-2.25, 7, -12]} target={[-3, 0, -4]} />
      <MovingLight position={[-0.75, 7, -12]} target={[-1, 0, -4]} />
      <MovingLight position={[0.75, 7, -12]} target={[1, 0, -4]} />
      <MovingLight position={[2.25, 7, -12]} target={[3, 0, -4]} />
      <MovingLight position={[3.75, 7, -12]} target={[5, 0, -4]} />

      <MovingLight position={[-3.75, 7, -16]} target={[-5, 0, -5]} />
      <MovingLight position={[-2.25, 7, -16]} target={[-3, 0, -5]} />
      <MovingLight position={[-0.75, 7, -16]} target={[-1, 0, -5]} />
      <MovingLight position={[0.75, 7, -16]} target={[1, 0, -5]} />
      <MovingLight position={[2.25, 7, -16]} target={[3, 0, -5]} />
      <MovingLight position={[3.75, 7, -16]} target={[5, 0, -5]} />

      {/* Right Speaker */}
      <SpeakerHolderGrid position={[-5, 9, -10]} />
      <Speaker.LineArray position={[-5, 5.7, -10]} />

      {/* Left Speaker */}
      <SpeakerHolderGrid position={[5, 9, -10]} />
      <Speaker.LineArray position={[5, 5.7, -10]} />
    </>
  );
};

export default Celing;
