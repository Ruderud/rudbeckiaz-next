import { useCallback, useRef, useState } from 'react';
import { useTexture } from '@react-three/drei';
import { RigidBody, RigidBodyProps } from '@react-three/rapier';
import { create } from 'zustand';
import { ThreeEvent } from '@react-three/fiber';

// This is a naive implementation and wouldn't allow for more than a few thousand boxes.
// In order to make this scale this has to be one instanced mesh, then it could easily be
// hundreds of thousands.

type CubeStore = {
  cubes: number[][];
  addCube: (x: number, y: number, z: number) => void;
};

const useCubeStore = create<CubeStore>((set) => ({
  cubes: [],
  addCube: (x, y, z) => set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}));

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((coords, index) => <Cube key={index} position={[coords[0], coords[1], coords[2]]} />);
};

type CubeProps = RigidBodyProps & {
  key?: number | string | null | undefined;
};

export function Cube(props: CubeProps) {
  const ref = useRef<any>();
  const [hover, set] = useState<number | null>(null);
  const addCube = useCubeStore((state) => state.addCube);
  const texture = useTexture('/assets/dirt.jpg');
  const onMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!e.faceIndex) return;
    set(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => set(null), []);
  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const { x, y, z } = ref.current.translation();
      const dir: number[][] = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ];
      if (!e.faceIndex) return;
      const [cx, cy, cz] = dir[Math.floor(e.faceIndex / 2)];
      addCube(cx, cy, cz);
    },
    [addCube]
  );
  return (
    <RigidBody {...props} type="fixed" colliders="cuboid" ref={ref}>
      <mesh receiveShadow castShadow onPointerMove={onMove} onPointerOut={onOut} onClick={onClick}>
        {[...Array(6)].map((_, index) => (
          <meshStandardMaterial
            attach={`material-${index}`}
            key={index}
            map={texture}
            color={hover === index ? 'hotpink' : 'white'}
          />
        ))}
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
}
