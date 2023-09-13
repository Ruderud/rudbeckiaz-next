import * as THREE from 'three';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

const BALCONY = {
  x: 2,
  y: 12,
  z: 2,
  thickness: 0.1,
};

const Balcony = (props: ThreeElements['group']) => {
  const BASE_OFFSET_Z = 0.5;
  const [cx, cy, cz] = props.position as [number, number, number];
  return (
    <group {...props} receiveShadow>
      <mesh position={[cx, cy, cz - BALCONY.z + BASE_OFFSET_Z]} receiveShadow>
        <boxGeometry args={[BALCONY.x, BALCONY.y, BALCONY.thickness]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <mesh
        position={[cx, cy - BALCONY.y / 2 + BALCONY.thickness / 2, cz - BALCONY.z / 2 + BASE_OFFSET_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[BALCONY.x, BALCONY.x - BALCONY.thickness, BALCONY.thickness]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <mesh
        position={[cx, cy + BALCONY.y / 2 - BALCONY.thickness / 2, cz - BALCONY.z / 2 + BASE_OFFSET_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[BALCONY.x, BALCONY.x - BALCONY.thickness, BALCONY.thickness]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <mesh
        position={[
          cx + BALCONY.x / 2 + BALCONY.thickness / 2,
          cy,
          cz - BALCONY.z / 2 + BASE_OFFSET_Z - BALCONY.thickness / 2,
        ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[BALCONY.x, BALCONY.y, BALCONY.thickness]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <mesh
        position={[
          cx - BALCONY.x / 2 - BALCONY.thickness / 2,
          cy,
          cz - BALCONY.z / 2 + BASE_OFFSET_Z - BALCONY.thickness / 2,
        ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[BALCONY.x, BALCONY.y, BALCONY.thickness]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
    </group>
  );
};

type SideWallProps = ThreeElements['group'] & {
  location: 'left' | 'right';
  length: number;
  upper: {
    height: number;
    thickness: number;
  };
  lower: {
    height: number;
    thickness: number;
  };
};

const Side = ({ location, length, upper, lower, ...props }: SideWallProps) => {
  const [map, dispMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    '/textures/concrete_wall_008_diff_1k.jpg',
    '/textures/concrete_wall_008_disp_1k.jpg',
    '/textures/concrete_wall_008_rough_1k.jpg',
  ]);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(upper.height / 4, length / 2);
  map.colorSpace = THREE.SRGBColorSpace;

  dispMap.wrapS = THREE.RepeatWrapping;
  dispMap.wrapT = THREE.RepeatWrapping;
  dispMap.anisotropy = 4;
  dispMap.repeat.set(upper.height / 4, length / 2);

  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;
  roughnessMap.repeat.set(upper.height / 4, length / 2);

  const rotation: THREE.Euler = new THREE.Euler(0, location === 'right' ? -Math.PI / 2 : Math.PI / 2, -Math.PI / 2);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group rotation={rotation} receiveShadow {...props}>
        <mesh position={[-lower.height / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[upper.height, length, upper.thickness]} />
          <Balcony position={[1, 3.5, 0.5]} />
          <Balcony position={[1, -3.5, 0.5]} />
          <meshStandardMaterial
            roughness={10}
            metalness={0.2}
            bumpScale={0.05}
            displacementScale={0}
            map={map}
            displacementMap={dispMap}
            roughnessMap={roughnessMap}
            needsUpdate
          />
        </mesh>
        <mesh position={[upper.height / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[lower.height, length, lower.thickness]} />
          <meshStandardMaterial
            roughness={10}
            metalness={0.2}
            bumpScale={0.05}
            color={'#e3e3e3'}
            displacementScale={0}
            map={map}
            displacementMap={dispMap}
            roughnessMap={roughnessMap}
            needsUpdate
          />
        </mesh>
      </group>
    </RigidBody>
  );
};

type BasicWallProps = ThreeElements['mesh'] & {
  geometryArgs: [
    width?: number | undefined,
    height?: number | undefined,
    depth?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined,
    depthSegments?: number | undefined
  ];
};

const Basic = ({ geometryArgs, ...props }: BasicWallProps) => {
  const geometry = new THREE.BoxGeometry(...geometryArgs);
  const material = new THREE.MeshStandardMaterial({ color: 'gray' });
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh {...props} receiveShadow geometry={geometry} material={material} />
    </RigidBody>
  );
};

export const Wall = { Side, Basic };
