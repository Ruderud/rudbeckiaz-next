import { LightingGrid, MovingLight } from '@/components/ConcertHall/components';
import { useTexture } from '@react-three/drei';

export const LightStage = () => {
  const keepOutTexture = useTexture('/keep_out.png');

  return (
    <>
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial map={keepOutTexture} side={2} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[1, 2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial map={keepOutTexture} side={2} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]} position={[-1.5, 2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial map={keepOutTexture} side={2} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, -Math.PI / 8]} position={[0, 2, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial map={keepOutTexture} side={2} transparent />
        </mesh>
      </group>
      <LightingGrid position={[0, 1.5, -1.5]} length={4} width={0.5} thickness={0.03} />
      <group scale={0.5}>
        <MovingLight position={[1, 2, -3]} target={[0, -2, 0]} activted />
        <MovingLight position={[-1, 2, -3]} target={[0, -2, 0]} activted />
      </group>
    </>
  );
};
