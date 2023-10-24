import * as THREE from 'three';
import { Environment, MeshPortalMaterial, useGLTF } from '@react-three/drei';
import { Euler, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';

type SideProps = {
  rotation?: Euler;
  bg?: string;
  children?: any;
  index?: number;
  flat?: boolean;
  bgMap?: any;
  spotLightOff?: boolean;
  onClickSide?: () => void;
};

export const Side = ({
  rotation = [0, 0, 0],
  bg = '#f0f0f0',
  children,
  index,
  flat = false,
  bgMap = null,
  spotLightOff = false,
  onClickSide,
}: SideProps) => {
  const mesh = useRef<any>();
  // const { worldUnits } = useControls({ worldUnits: false });
  const { nodes } = useGLTF('/transforms/aobox-transformed.glb', true, true) as any;

  const { camera } = useThree();

  const [isHover, setIsHover] = useState<boolean>(false);
  const onPointerEnter = () => setIsHover(true);
  const onPointerOut = () => setIsHover(false);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  return (
    <MeshPortalMaterial worldUnits={true} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry} scale={[2, 2, 2]}>
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} map={bgMap} color={bg} />
        {!spotLightOff && (
          <spotLight
            castShadow
            // color={bg}
            color={isHover ? 'red' : bg}
            intensity={2}
            position={isHover ? [5, 0, 0] : [10, 10, 10]}
            angle={0.15}
            penumbra={1}
            shadow-normalBias={0.05}
            shadow-bias={0.0001}
          />
        )}
      </mesh>
      {/** The shape */}
      <mesh
        castShadow
        receiveShadow
        ref={mesh}
        // onClick={handleDiceClick}
        // onPointerEnter={onPointerEnter}
        // onPointerOut={onPointerOut}
      >
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
};
