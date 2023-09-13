import * as THREE from 'three';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import Speaker from './Speaker';

const STAGE = {
  width: 16,
  length: 12,
  height: 0.8,
  coverThickness: 0.05,
};

export const Stage = (props: ThreeElements['group']) => {
  const { rotation } = props;
  const [map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    '/textures/ParquetFlooring10_1K_BaseColor.png',
    '/textures/ParquetFlooring10_1K_Normal.png',
    '/textures/ParquetFlooring10_1K_Roughness.png',
  ]);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(1, 1);
  map.colorSpace = THREE.SRGBColorSpace;

  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.anisotropy = 4;
  normalMap.repeat.set(1, 1);

  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;
  roughnessMap.repeat.set(1, 1);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group rotation={rotation} receiveShadow {...props}>
        <mesh
          position={[0, (STAGE.height + STAGE.coverThickness) / 2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <boxGeometry args={[STAGE.width, STAGE.length, STAGE.coverThickness]} />
          <meshStandardMaterial
            roughness={1}
            metalness={0.3}
            bumpScale={0.05}
            displacementScale={0}
            map={map}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            needsUpdate
          />
        </mesh>
        <mesh receiveShadow>
          <boxGeometry args={[STAGE.width, STAGE.height, STAGE.length]} />
          <meshStandardMaterial
            roughness={1}
            metalness={0.2}
            bumpScale={0.05}
            displacementScale={0}
            needsUpdate
          />
        </mesh>
      </group>

      {/* Stage Metarials */}
      <Speaker.FrontFill
        position={[5, 0.85 + 0.25 - 0.2, -8.9]}
        rotation={[-Math.PI / 6, Math.PI / 9, Math.PI / 15]}
      />
      <Speaker.FrontFill
        position={[3, 0.85 + 0.25 - 0.2, -8.7]}
        rotation={[-Math.PI / 6, Math.PI / 12, Math.PI / 20]}
      />
      <Speaker.FrontFill position={[1, 0.85 + 0.25 - 0.2, -8.5]} rotation={[-Math.PI / 6, 0, 0]} />
      <Speaker.FrontFill position={[-1, 0.85 + 0.25 - 0.2, -8.5]} rotation={[-Math.PI / 6, 0, 0]} />
      <Speaker.FrontFill
        position={[-3, 0.85 + 0.25 - 0.2, -8.7]}
        rotation={[-Math.PI / 6, -Math.PI / 12, -Math.PI / 20]}
      />
      <Speaker.FrontFill
        position={[-5, 0.85 + 0.25 - 0.2, -8.9]}
        rotation={[-Math.PI / 6, -Math.PI / 9, -Math.PI / 15]}
      />
    </RigidBody>
  );
};
