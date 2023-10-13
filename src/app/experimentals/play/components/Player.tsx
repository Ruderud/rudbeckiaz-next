import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { useEffect, useRef } from 'react';
import { ThreeElements, useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { CapsuleCollider, RigidBody, RigidBodyProps, useRapier } from '@react-three/rapier';
import Axe from './Axe';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();
const upDownVector = new THREE.Vector3();
const axeVector = new THREE.Vector3();

type PlayerProps = RigidBodyProps & {
  joyStickActive: boolean;
  joyStickValue: any;
};

export function Player({ joyStickActive, joyStickValue, ...props }: PlayerProps) {
  const bodyRef = useRef<RAPIER.RigidBody>(null);
  const axeRef = useRef<any>(null);
  const rapier = useRapier();
  const [_, get] = useKeyboardControls();
  const bodyEle = document.querySelector('body');
  const root = useThree();

  useEffect(() => {
    if (!root) return;
    const handleControlLockByEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        console.log('root', root);
        const { controls } = root as any;
        controls.disconnect();
        // if (controls.isLocked) {
        //   // controls.unlock();
        //   console.log('controls', controls);
        // } else if (!controls.isLocked) {
        //   // controls.lock();
        // }
      }
    };

    document.addEventListener('keydown', handleControlLockByEnter);
    return () => {
      document.removeEventListener('keydown', handleControlLockByEnter);
    };
  }, [root]);

  useFrame((state) => {
    if (bodyEle?.getAttribute('playerActive')) return;
    if (!bodyRef.current) return;
    const { jump, shift } = get();
    const { forward, backward, left, right } = joyStickActive ? joyStickValue : get();
    const velocity = bodyRef.current.linvel();
    // update camera
    const { x, y, z } = bodyRef.current.translation();
    state.camera.position.set(x, y, z);

    // update axe
    if (axeRef.current) {
      axeRef.current.children[0].rotation.x = THREE.MathUtils.lerp(axeRef.current.children[0].rotation.x, 0, 0.1);
      axeRef.current.rotation.copy(state.camera.rotation);
      axeRef.current.position
        .copy(state.camera.position)
        .add(state.camera.getWorldDirection(rotation).multiplyScalar(1));
    }

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation);
    bodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // jumping
    const param_1 = new RAPIER.Ray(bodyRef.current.translation(), { x: 0, y: -1, z: 0 });
    const ray = rapier.world.castRay(param_1, 4, true);
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    if (jump && grounded) bodyRef.current.setLinvel({ x: 0, y: 10, z: 0 }, true);
    if (jump && shift) bodyRef.current.setLinvel({ x: 0, y: -2.5, z: 0 }, true); // for dev
  });
  return (
    <>
      <RigidBody
        ref={bodyRef}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <group
        ref={axeRef}
        onPointerMissed={(e) => {
          return (axeRef.current.children[0].rotation.x = -0.5);
        }}
      >
        <Axe position={[0.3, -0.35, 0.5]} />
      </group>
    </>
  );
}
