import * as React from 'react';
import * as THREE from 'three';
import { ThreeElements, useFrame, useLoader } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import { useRef } from 'react';

const VolumeticSpotLight = ({ target = [0, 0, 0], ...spotLightProps }: any) => {
  const light = useRef<THREE.SpotLight>(null);
  const bulb = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!light.current || !bulb.current) return;
    const [x, y, z] = target;
    light.current.target.position.set(x, y, z);
    const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2;
    light.current.color.setRGB(1 + t * 10, 2, 20 + t * 50);
    bulb.current.color.setRGB(1 + t * 10, 2, 20 + t * 50);
  });

  return (
    <>
      <mesh position={[0, 0, -0.1]}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial ref={bulb} toneMapped={false} />
      </mesh>
      <SpotLight
        ref={light}
        penumbra={0.7}
        distance={10}
        // attenuation={7} // 빛내려오는 효과 퍼짐정도
        attenuation={0} // 빛내려오는 효과 퍼짐정도
        anglePower={4}
        intensity={3}
        angle={Math.PI / 6}
        //   emissiveIntensity={1}
        {...spotLightProps}
      />
    </>
  );
};

type MovingLightBodyProps = ThreeElements['group'] & {
  baseMaterialProps?: any;
};

const MovingLightBody = ({ baseMaterialProps, ...props }: MovingLightBodyProps) => {
  const innerPoints = [];
  for (let i = 0; i < 10; i++) {
    const x = -Math.sin(i * 0.2) * 0.1 - 0.1;
    const y = -i * 0.02;
    innerPoints.push(new THREE.Vector2(x, y));
  }

  const outerPoints = [];
  for (let i = 0; i < 10; i++) {
    const x = Math.sin(i * 0.2) * 0.1 + 0.1;
    const y = i * 0.02;
    outerPoints.push(new THREE.Vector2(x, y));
  }
  return (
    <group {...props} receiveShadow>
      {/* body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 6, 1, true]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.01, 6, 1, false]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      {/* bulb funnel */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI, 0, 0]} receiveShadow>
        <latheGeometry args={[innerPoints, 6, Math.PI * 2]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]} receiveShadow>
        <latheGeometry args={[outerPoints, 6, Math.PI * 2]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      {/* Barn door */}
      <mesh position={[0, 0.32, 0.3]} rotation={[Math.PI / 3, 0, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, 0.32, -0.3]} rotation={[-Math.PI / 3, 0, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0.3, 0.32, 0]} rotation={[Math.PI / 2, Math.PI / 6, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[-0.3, 0.32, 0]} rotation={[Math.PI / 2, -Math.PI / 6, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
    </group>
  );
};

type MovingLightHangerProps = ThreeElements['group'] & {
  baseMaterialProps?: any;
};

const MovingLightHanger = ({ baseMaterialProps, ...props }: MovingLightHangerProps) => {
  return (
    <group {...props} castShadow receiveShadow>
      {/* side holder */}
      <mesh position={[-0.2, -0.15, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0.2, -0.15, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.3, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <boxGeometry args={[0.05, 0.41, 0.01]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>

      {/* hanger stick */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial {...baseMaterialProps} />
      </mesh>
    </group>
  );
};

type MovingLightProps = ThreeElements['group'] & {
  target?: THREE.Vector3 | readonly [number, number, number];
  color?: string | number;
  activted?: boolean;
};

export const MovingLight = ({ target, color, activted = false, ...props }: MovingLightProps) => {
  const [map, metallicMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader as any, [
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_BaseColor.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Metallic.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Normal.png',
    '/textures/BrushedIron01_MR_1K/BrushedIron01_1K_Roughness.png',
  ]);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(4, 4);
  map.colorSpace = THREE.SRGBColorSpace;

  metallicMap.wrapS = THREE.RepeatWrapping;
  metallicMap.wrapT = THREE.RepeatWrapping;
  metallicMap.anisotropy = 4;
  metallicMap.repeat.set(4, 4);

  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.anisotropy = 4;
  normalMap.repeat.set(4, 4);

  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;
  roughnessMap.repeat.set(4, 4);

  const baseMaterialProps = {
    roughness: 2,
    metalness: 0.2,
    bumpScale: 0.05,
    color: new THREE.Color('rgb(94, 94, 94)'),
    displacementScale: 0,
    map,
    metalnessMap: metallicMap,
    normalMap,
    roughnessMap,
    needsUpdate: true,
  };

  const { setta_Y, setta_x } = calculateAngles(props.position as Point, target as Point);

  return (
    <group position={props.position} rotation={[Math.PI, setta_Y, 0]} castShadow receiveShadow>
      <MovingLightBody baseMaterialProps={baseMaterialProps} rotation={[setta_x, 0, 0]} />
      <MovingLightHanger
        baseMaterialProps={{
          color: new THREE.Color('rgb(128, 128, 128)'),
        }}
        rotation={[0, 0, 0]}
      />
      {activted && <VolumeticSpotLight position={[0, 0, 0]} target={target} color={color} />}
    </group>
  );
};

type Point = [number, number, number];

function calculateAngles(point1: Point, point2: Point) {
  // 각 점의 좌표 차이 계산
  const diffX = point1[0] - point2[0];
  const diffY = point1[1] - point2[1];
  const diffZ = point1[2] - point2[2];

  const setta_Y = -Math.atan(diffX / diffZ); // 스포트라이트 Y축 자체를 회전시키는데 필요한 각도
  const setta_x = diffY >= 0 ? Math.atan(diffZ / diffY) : Math.atan(diffZ / diffY) + Math.PI; // 스포트라이트 내부 x축 회전각, TODO: 더 깔끔하게 보정하도록 수정

  return {
    setta_Y,
    setta_x,
  };
}
