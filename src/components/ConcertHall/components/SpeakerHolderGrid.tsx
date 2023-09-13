import * as THREE from 'three';
import { ThreeElements, useLoader } from '@react-three/fiber';

export const SpeakerHolderGrid = (props: ThreeElements['group']) => {
  const verticalGridPositions = [
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [-0.5, 0, 0.5],
    [0.5, 0, 0.5],
  ] as const;
  const horizontalGridPositions = [
    {
      position: [0, -3, -0.5],
      rotation: new THREE.Euler(0, 0, Math.PI / 2),
    },
    {
      position: [0, -3, 0.5],
      rotation: new THREE.Euler(0, 0, Math.PI / 2),
    },
    {
      position: [-0.5, -3, 0],
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
    },
    {
      position: [0.5, -3, 0],
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
    },
  ] as const;

  const verticalGrid = new THREE.CapsuleGeometry(0.025, 6, 4, 8);
  const horizontalGrid = new THREE.CapsuleGeometry(0.025, 1, 4, 8);
  const bottomPlate = new THREE.BoxGeometry(1, 1, 0.01);
  const material = new THREE.MeshStandardMaterial({
    color: 'rgb(213, 213, 213)',
  });

  return (
    <group {...props}>
      {verticalGridPositions.map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[Math.PI / 2, Math.PI / 2, Math.PI / 2]}
            geometry={verticalGrid}
            material={material}
          />
        );
      })}
      {horizontalGridPositions.map(({ position, rotation }, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={rotation}
            geometry={horizontalGrid}
            material={material}
          />
        );
      })}
      <mesh
        position={[0, -3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={bottomPlate}
        material={material}
      />
    </group>
  );
};
