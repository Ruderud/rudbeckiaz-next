import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';
import { useMemo, useState } from 'react';

type TrapezoidProps = ThreeElements['mesh'] & {
  trapezoidArgs: [number, number, number];
};

// Trapezoid Construction
//  upside: w1, downside: w2, height: h
//
//     ......
//    . .  . .
//   .   ..   .
//  ............
//

const Trapezoid = (props: TrapezoidProps) => {
  const [w1, w2, h] = props.trapezoidArgs;
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    ...[-w1 / 2, h / 2, 0],
    ...[w1 / 2, h / 2, 0],
    ...[0, -h / 2, 0], //center tri
    ...[-w1 / 2, h / 2, 0],
    ...[-w2 / 2, -h / 2, 0],
    ...[0, -h / 2, 0], //left tri
    ...[w1 / 2, h / 2, 0],
    ...[w2 / 2, -h / 2, 0],
    ...[0, -h / 2, 0], //right tri
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

  return <mesh {...props} geometry={geometry} material={material} />;
};

//TODO: 플러그 꽂는면과 스피커면은 사실 곡면으로 되어있음. 일단 나중에 수정필요.

const LineArrayElement = (props: ThreeElements['group']) => {
  const spec = {
    backHeight: 0.5,
    frontHeight: 0.6,
    length: 1.2,
    width: 1.5,
  };
  const { backHeight, frontHeight, length, width } = spec;
  const trapeziodSideArc = Math.atan(length / ((backHeight - frontHeight) / 2));
  const trapeziodSideLength = Math.sqrt(length ** 2 + ((backHeight - frontHeight) / 2) ** 2);
  const elseSideDiffY = backHeight / 2 + length / 2 / Math.abs(Math.tan(trapeziodSideArc));

  const pluggingSideGeo = new THREE.PlaneGeometry(width, backHeight);
  const speakerSideGeo = new THREE.PlaneGeometry(width, frontHeight);
  const elseSideGeo = new THREE.PlaneGeometry(width, trapeziodSideLength);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  const elseMaterial = new THREE.MeshBasicMaterial({ color: 'rgb(54, 191, 93)', side: THREE.DoubleSide });
  const speakerMaterial = new THREE.MeshBasicMaterial({ color: 'rgb(124, 124, 124)', side: THREE.DoubleSide });

  return (
    <group {...props}>
      <Trapezoid
        position={[-width / 2, 0, 0]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        trapezoidArgs={[backHeight, frontHeight, length]}
      />
      <Trapezoid
        position={[width / 2, 0, 0]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        trapezoidArgs={[backHeight, frontHeight, length]}
      />
      <mesh position={[0, 0, -length / 2]} geometry={pluggingSideGeo} material={speakerMaterial} />
      <mesh position={[0, 0, length / 2]} geometry={speakerSideGeo} material={speakerMaterial} />
      <mesh
        position={[0, -elseSideDiffY, 0]}
        rotation={[trapeziodSideArc, 0, 0]}
        geometry={elseSideGeo}
        material={elseMaterial}
      />
      <mesh
        position={[0, elseSideDiffY, 0]}
        rotation={[-trapeziodSideArc, 0, 0]}
        geometry={elseSideGeo}
        material={elseMaterial}
      />
    </group>
  );
};

const LineArray = (props: ThreeElements['group']) => {
  return (
    <group {...props}>
      <LineArrayElement position={[0, 0, 0]} />
      <LineArrayElement position={[0, -0.61, 0]} />
      <LineArrayElement position={[0, -1.22, 0]} />
      <LineArrayElement position={[0, -1.83, 0]} />
    </group>
  );
};

const FrontFill = (props: ThreeElements['mesh']) => {
  const bodyGeometry = new THREE.BoxGeometry(0.75, 0.5, 0.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 'rgb(182, 190, 69)' });

  return <mesh receiveShadow {...props} geometry={bodyGeometry} material={bodyMaterial} />;
};

const Speaker = { LineArray, FrontFill };
export default Speaker;
