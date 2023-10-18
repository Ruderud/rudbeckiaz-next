'use client';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, CameraControls, Effects, KeyboardControls, PointerLockControls } from '@react-three/drei';
import { Wall, Player, WoodFloor, Stage, JoyStick } from './components';
import { Physics } from '@react-three/rapier';
import Celing from './components/Celing';
import '@/types/three-stdlib';
import { useCallback, useEffect, useState } from 'react';

// Concert hall w = 12, l = 40, h = 10

// CONCERT_HALL Concept
//
// C: Celing, W: Wall, F: Floor
//
// CCCCCCCCCCCC
// W          W
// W          W
// W          W
// W          W
// W          W
// FFFFFFFFFFFF

const CONCERT_HALL = {
  width: 24,
  length: 40,
  height: {
    upper: 10,
    lower: 2,
  },
  floorThickness: 0.1,
  wall: {
    upper: {
      height: 10,
      thickness: 2,
    },
    lower: {
      height: 2,
      thickness: 1,
    },
  },
  stage: {
    width: 10,
    length: 5,
    height: 0.5,
    coverThickness: 0.1,
  },
};

const ConcertHall = () => {
  //wall
  const { upper, lower } = CONCERT_HALL.wall;
  const { length: wallLength } = CONCERT_HALL;

  const WoodFloorPosition = new THREE.Vector3(0, -CONCERT_HALL.floorThickness / 2, 0);
  const LeftWallPosition = new THREE.Vector3(
    -Math.abs(CONCERT_HALL.width / 2 - upper.thickness / 2),
    (upper.height + lower.height) / 2,
    0
  );
  const RightWallPosition = new THREE.Vector3(
    Math.abs(CONCERT_HALL.width / 2 - upper.thickness / 2),
    (upper.height + lower.height) / 2,
    0
  );
  const CelingPosition = new THREE.Vector3(0, upper.height + lower.height + CONCERT_HALL.floorThickness / 2, 0);

  //stage
  const { width, length, height } = CONCERT_HALL.stage;
  const StagePosition = new THREE.Vector3(0, 0.425, -14);

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
    <div className="absolute top-0 w-screen h-screen">
      <div className="absolute z-30 top-[50%] left-[50%] w-[10px] h-[10px] rounded translate-x-[-50%] translate-y-[50%] translate-z-0 border-white border-2" />

      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W', 'ㅈ'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S', 'ㄴ'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A', 'ㅁ'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D', 'ㅇ'] },
          { name: 'jump', keys: ['Space'] },
          { name: 'shift', keys: ['Shift'] },
          { name: 'enter', keys: ['Enter'] },
        ]}
      >
        <Canvas performance={{ min: 0.5 }} shadows dpr={[1, 2]}>
          <ambientLight intensity={0.3} />
          <Physics gravity={[0, 0, 0]}>
            <Bounds fit clip margin={1.2} damping={0}>
              <WoodFloor position={WoodFloorPosition} rotation={[-Math.PI / 2, 0, 0]} />
              <Wall.Side location="left" position={LeftWallPosition} length={wallLength} upper={upper} lower={lower} />
              <Wall.Side
                location="right"
                position={RightWallPosition}
                length={wallLength}
                upper={upper}
                lower={lower}
              />
              <Wall.Basic position={[0, 6, -20.25]} geometryArgs={[24, 12, 0.5]} />
              <Wall.Basic position={[0, 6, 20.25]} geometryArgs={[24, 12, 0.5]} />

              <Celing position={CelingPosition} rotation={[Math.PI / 2, 0, 0]} />

              <Stage position={StagePosition} />
            </Bounds>

            <Player position={[0, 5, -5]} joyStickActive={isMobile} joyStickValue={joyStickValue} />
          </Physics>
          {isMobile ? <CameraControls /> : <PointerLockControls makeDefault />}
          <fog attach="fog" args={['#202020', 5, 30]} />
          <Effects disableGamma>
            <unrealBloomPass threshold={1} strength={5} radius={0.7} />
          </Effects>
        </Canvas>

        {isMobile && <JoyStick onMove={handleJoyStick} />}
      </KeyboardControls>
    </div>
  );
};

export default ConcertHall;
