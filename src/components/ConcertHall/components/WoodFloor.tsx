import * as THREE from 'three';
import { ThreeElements, useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

export const WoodFloor = (props: ThreeElements['mesh']) => {
  const [map, bumpMap, roughnessMap] = useLoader(THREE.TextureLoader as any, [
    '/textures/hardwood2_diffuse.jpg',
    '/textures/hardwood2_bump.jpg',
    '/textures/hardwood2_roughness.jpg',
  ]);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  map.colorSpace = THREE.SRGBColorSpace;

  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = 4;
  bumpMap.repeat.set(10, 24);

  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;
  roughnessMap.repeat.set(10, 24);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh {...props} receiveShadow>
        <boxGeometry args={[24, 40, 0.1]} />
        <meshStandardMaterial
          roughness={0.8}
          color={'#e3e3e3'}
          metalness={0.2}
          bumpScale={0.0005}
          map={map}
          bumpMap={bumpMap}
          roughnessMap={roughnessMap}
          needsUpdate
        />
      </mesh>
    </RigidBody>
  );
};

export default WoodFloor;
