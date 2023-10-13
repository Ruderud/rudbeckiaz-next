import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTexture } from '@react-three/drei';
import { RigidBody, RigidBodyProps } from '@react-three/rapier';

import { ThreeEvent } from '@react-three/fiber';
import { MinecraftContext } from '../providers';
import { Cube as CubeType, DataChannelMessage } from '../../utils/types';

export const Cubes = () => {
  const { cubes } = useContext(MinecraftContext);
  // const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((coords, index) => <Cube key={index} position={[coords[0], coords[1], coords[2]]} />);
};

type CubeProps = RigidBodyProps & {
  key?: number | string | null | undefined;
};

export function Cube(props: CubeProps) {
  const ref = useRef<any>();
  const [hover, set] = useState<number | null>(null);
  // const addCube = useCubeStore((state) => state.addCube);
  const { setCubes, sendChannel, receiveChannel, userData } = useContext(MinecraftContext);
  const texture = useTexture('/assets/dirt.jpg');
  const onMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!e.faceIndex) return;
    set(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => set(null), []);
  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!userData) return;
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
      setCubes((cur) => [...cur, [cx, cy, cz]]);
      const dataChannelMessage: DataChannelMessage<CubeType> = {
        type: 'CUBE',
        payload: [cx, cy, cz],
        userData: userData,
      };
      sendChannel?.send(JSON.stringify(dataChannelMessage));
    },
    [setCubes, sendChannel, userData]
  );

  useEffect(() => {
    if (receiveChannel) {
      receiveChannel.addEventListener('message', (event) => {
        const dataChannelMessage = JSON.parse(event.data) as DataChannelMessage<CubeType>;
        if (dataChannelMessage.type !== 'CUBE') return;
        setCubes((prev) => [...prev, { ...dataChannelMessage.payload, userData: dataChannelMessage.userData }]);
      });
    }
  }, [receiveChannel, setCubes]);

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
