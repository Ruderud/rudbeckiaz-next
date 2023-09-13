import { ThreeElements } from '@react-three/fiber';
import { MacBook } from './MacBook';
import { useEffect, useState } from 'react';

const MACBOOK_SCALE = 0.2;

export const MyRoom = (props: ThreeElements['group']) => {
  const [isMacBookOpen, setIsMacBookOpen] = useState<boolean>(true);
  const [isMacBookHover, setIsMacBookHover] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.cursor = isMacBookHover ? 'pointer' : 'default';
  }, [isMacBookHover]);

  return (
    <>
      <MacBook
        position={[0, -0.5, -0.3]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[MACBOOK_SCALE, MACBOOK_SCALE, MACBOOK_SCALE]}
        isOpen={isMacBookOpen}
        mockDisplay={false}
        onClick={(e) => {
          e.stopPropagation();
          setIsMacBookOpen((cur) => !cur);
        }}
        onPointerEnter={(e) => {
          console.log(e.camera);
          setIsMacBookHover(true);
        }}
        onPointerLeave={(e) => {
          setIsMacBookHover(false);
        }}
      />
    </>
  );
};
