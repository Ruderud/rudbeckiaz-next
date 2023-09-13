import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { CapsuleCollider, RigidBody, RigidBodyProps, useRapier } from '@react-three/rapier';

const SPEED = 10;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const upDownVector = new THREE.Vector3();

type PlayerProps = RigidBodyProps & {
  joyStickActive: boolean;
  joyStickValue: any;
};

export function Player({ joyStickActive, joyStickValue, ...props }: PlayerProps) {
  const ref = useRef<RAPIER.RigidBody>(null);
  const rapier = useRapier();
  const [_, get] = useKeyboardControls();
  useFrame((state) => {
    if (!ref.current) return;
    const { jump, shift } = get();
    const { forward, backward, left, right } = joyStickActive ? joyStickValue : get();
    const velocity = ref.current.linvel();
    // update camera
    const { x, y, z } = ref.current.translation();
    state.camera.position.set(x, y, z);
    // movement
    // frontVector.set(0, 0, Number(backward) - Number(forward));
    // sideVector.set(Number(left) - Number(right), 0, 0);
    // direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation);
    // ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // movement for dev
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    upDownVector.set(0, Number(jump) - Number(shift) * SPEED, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation);
    ref.current.setLinvel({ x: direction.x, y: upDownVector.y, z: direction.z }, true);

    // jumping
    const param_1 = new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 });
    const ray = rapier.world.castRay(param_1, 4, true);
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 10, z: 0 }, true);
    if (jump && shift) ref.current.setLinvel({ x: 0, y: -2.5, z: 0 }, true); // for dev
  });
  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        enabledRotations={[false, false, false]}
        {...props}
      >
        <CapsuleCollider args={[0.9, 0.6]} />
      </RigidBody>
    </>
  );
}

export default Player;
