import * as THREE from 'three';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useLoader } from '@react-three/fiber';

export function Ground() {
  const [map] = useLoader(THREE.TextureLoader, ['/assets/grass.jpg']);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.colorSpace = THREE.SRGBColorSpace;
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial map={map} map-repeat={[240, 240]} color="green" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
