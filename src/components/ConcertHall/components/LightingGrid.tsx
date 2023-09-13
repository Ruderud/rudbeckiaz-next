import * as THREE from 'three';
import { ThreeElements, useLoader } from '@react-three/fiber';

type LightingGridProps = ThreeElements['group'] & {
  length: number;
  width: number;
  thickness: number;
};

export const LightingGrid = ({ length, width, thickness, ...props }: LightingGridProps) => {
  const [map, metallicMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader as any, [
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_BaseColor.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Metallic.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Normal.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Roughness.png',
  ]);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(2, 2);
  map.colorSpace = THREE.SRGBColorSpace;

  metallicMap.wrapS = THREE.RepeatWrapping;
  metallicMap.wrapT = THREE.RepeatWrapping;
  metallicMap.anisotropy = 4;
  map.repeat.set(2, 2);

  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.anisotropy = 4;
  map.repeat.set(2, 2);

  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;
  map.repeat.set(2, 2);

  const outerGridX = new THREE.CapsuleGeometry(thickness, length - thickness / 2, 4, 8);
  const outerGridY = new THREE.CapsuleGeometry(thickness, width - thickness / 2, 4, 8);
  const outerGridZ = new THREE.CapsuleGeometry(thickness, width - thickness / 2, 4, 8);
  const innerGrid = new THREE.CapsuleGeometry(thickness, width - thickness / 2, 4, 8);
  const innerSlashGrid = new THREE.CapsuleGeometry(thickness, width * Math.sqrt(2) - thickness / 2, 4, 8);

  const material = new THREE.MeshStandardMaterial({
    map,
    metalnessMap: metallicMap,
    normalMap,
    roughnessMap,
    color: 'rgb(213, 213, 213)',
    roughness: 1,
    metalness: 0.2,
    bumpScale: 0.04,
  });

  const gridPositionsX = [
    [0, width / 2, width / 2],
    [0, -width / 2, width / 2],
    [0, width / 2, -width / 2],
    [0, -width / 2, -width / 2],
  ] as const;

  const gridPositionsY = [
    [length / 2, 0, width / 2],
    [-length / 2, 0, width / 2],
    [length / 2, 0, -width / 2],
    [-length / 2, 0, -width / 2],
  ] as const;

  const gridPositionsZ = [
    [length / 2, width / 2, 0],
    [-length / 2, width / 2, 0],
    [length / 2, -width / 2, 0],
    [-length / 2, -width / 2, 0],
  ] as const;

  const innerGridPositions = (isVertical: boolean): THREE.Vector3[] => {
    const left = Array.from({ length: Math.floor(length / width) }).map((_, index) => {
      const vec = new THREE.Vector3();

      vec.set(index * width - length / 2, isVertical ? -width / 2 : 0, isVertical ? 0 : -width / 2);
      return vec;
    });

    const right = Array.from({ length: Math.floor(length / width) }).map((_, index) => {
      const vec = new THREE.Vector3();
      vec.set(index * width - length / 2, isVertical ? width / 2 : 0, isVertical ? 0 : width / 2);
      return vec;
    });

    return [...left, ...right];
  };

  const innerSlashGridPositions = (isVertical: boolean): THREE.Vector3[] => {
    const left = Array.from({ length: Math.floor(length / width) }).map((_, index) => {
      const vec = new THREE.Vector3();

      vec.set(index * width - length / 2 + width / 2, isVertical ? -width / 2 : 0, isVertical ? 0 : -width / 2);
      return vec;
    });

    const right = Array.from({ length: Math.floor(length / width) }).map((_, index) => {
      const vec = new THREE.Vector3();
      vec.set(index * width - length / 2 + width / 2, isVertical ? width / 2 : 0, isVertical ? 0 : width / 2);
      return vec;
    });

    return [...left, ...right];
  };

  return (
    <group {...props}>
      {gridPositionsX.map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[0, 0, Math.PI / 2]}
            geometry={outerGridX}
            material={material}
          />
        );
      })}
      {gridPositionsY.map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            geometry={outerGridY}
            material={material}
          />
        );
      })}
      {gridPositionsZ.map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            geometry={outerGridZ}
            material={material}
          />
        );
      })}
      {/* inner grid */}
      {innerGridPositions(true).map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            geometry={innerGrid}
            material={material}
          />
        );
      })}
      {innerGridPositions(false).map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            geometry={innerGrid}
            material={material}
          />
        );
      })}
      {/* inner Slash grid */}
      {innerSlashGridPositions(true).map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[Math.PI / 2, 0, Math.PI / 4]}
            geometry={innerSlashGrid}
            material={material}
          />
        );
      })}
      {innerSlashGridPositions(false).map((position, index) => {
        return (
          <mesh
            key={index}
            position={position}
            rotation={[0, 0, -Math.PI / 4]}
            geometry={innerSlashGrid}
            material={material}
          />
        );
      })}
    </group>
  );
};
