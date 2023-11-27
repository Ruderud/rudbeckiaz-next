import { Environment, MeshPortalMaterial, useGLTF } from '@react-three/drei';
import { Euler } from '@react-three/fiber';
import { useRef } from 'react';

type SideProps = {
  rotation?: Euler;
  bg?: string;
  children?: any;
  index?: number;
  flat?: boolean;
  bgMap?: any;
  spotLightOff?: boolean;
};

const Side = ({
  rotation = [0, 0, 0],
  bg = '#f0f0f0',
  children,
  index,
  flat = false,
  bgMap = null,
  spotLightOff = false,
}: SideProps) => {
  const mesh = useRef<any>();
  const { nodes } = useGLTF(
    process.env.NEXT_PUBLIC_CDN_BASE_URL + '/mysterybox/aobox-transformed.glb',
    true,
    true
  ) as any;

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
            color={bg}
            intensity={2}
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            shadow-normalBias={0.05}
            shadow-bias={0.0001}
          />
        )}
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
};

export default Side;
