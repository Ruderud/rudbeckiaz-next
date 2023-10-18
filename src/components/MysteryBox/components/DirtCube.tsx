import { useTexture } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

type CubeProps = ThreeElements['mesh'];

export const DirtCube = (props: CubeProps) => {
  const dirtTexture = useTexture('/assets/dirt.jpg');
  return (
    <mesh {...props} receiveShadow castShadow>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial attach={`material-${index}`} key={index} map={dirtTexture} />
      ))}
      <boxGeometry />
    </mesh>
  );
};
