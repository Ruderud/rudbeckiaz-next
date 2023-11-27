/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Blender3D (https://sketchfab.com/Blender3D)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/0d62f4d3676545c88ec8523213c055dd
title: Minecraft Diamond Axe
*/

import { useGLTF } from '@react-three/drei';

type AxeProps = JSX.IntrinsicElements['group'];

export default function Axe(props: AxeProps) {
  const model = useGLTF(process.env.NEXT_PUBLIC_CDN_BASE_URL + '/minecraft/axe.glb') as any;
  return (
    <group dispose={null} {...props}>
      <group rotation={[0, Math.PI / 1.8, -0.3]} scale={0.5}>
        <mesh geometry={model.nodes.Mesh_1001_1.geometry} material={model.materials.material_2} />
        <mesh geometry={model.nodes.Mesh_1001_2.geometry} material={model.materials.material_3} />
      </group>
    </group>
  );
}

useGLTF.preload(process.env.NEXT_PUBLIC_CDN_BASE_URL + '/minecraft/axe.glb');
