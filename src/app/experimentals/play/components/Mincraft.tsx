'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls, CameraControls, Loader } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Ground } from './Ground';
import { Player } from './Player';
// import { Cube, Cubes } from './Cube';
import { useCallback, useEffect, useState } from 'react';
import { JoyStick } from '@/components/ConcertHall/components';
import { Cube, Cubes } from './Cube';

// The original was made by Paul Henschel: https://codesandbox.io/s/vkgi6

export default function Minecraft() {
  console.log('Minecraft Load');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [joyStickValue, setJoyStickValue] = useState({
    forward: 0,
    backward: 0,
    left: 0,
    right: 0,
  });

  const handleJoyStick = useCallback(
    (joyStickHandler: any) => (evt: any, data: any) => {
      const forward = data.vector.y;
      const turn = data.vector.x;

      if (forward > 0) {
        setJoyStickValue((prev) => ({ ...prev, forward: Math.abs(forward), backward: 0 }));
      } else if (forward < 0) {
        setJoyStickValue((prev) => ({ ...prev, forward: 0, backward: Math.abs(forward) }));
      }

      if (turn > 0) {
        setJoyStickValue((prev) => ({ ...prev, left: 0, right: Math.abs(turn) }));
      } else if (turn < 0) {
        setJoyStickValue((prev) => ({ ...prev, left: Math.abs(turn), right: 0 }));
      }

      joyStickHandler['0'].on('end', function (evt: any) {
        setJoyStickValue({ forward: 0, backward: 0, left: 0, right: 0 });
      });
    },
    []
  );

  useEffect(() => {
    setIsMobile(/mobile|iphone|ipad|ipod|android|blackberry|windows phone/i.test(navigator.userAgent.toLowerCase()));
  }, []);

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W', 'ㅈ'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S', 'ㄴ'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A', 'ㅁ'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D', 'ㅇ'] },
          { name: 'jump', keys: ['Space'] },
          { name: 'shift', keys: ['Shift'] },
        ]}
      >
        <Canvas shadows camera={{ fov: 45, position: [0, 0, 0] }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.3} />
          <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player joyStickActive={isMobile} joyStickValue={joyStickValue} />
            <Cube position={[0, 0.5, -10]} />
            <Cubes />
          </Physics>
          {isMobile ? <CameraControls /> : <PointerLockControls makeDefault />}
        </Canvas>
        {isMobile && <JoyStick onMove={handleJoyStick} />}
      </KeyboardControls>
      <Loader />
    </>
  );
}
