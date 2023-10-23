// import * as THREE from 'three';
import { Vector3, MathUtils, MeshStandardMaterial } from 'three';
import { Html, useGLTF, useTexture } from '@react-three/drei';
import { ThreeElements, useFrame, useLoader } from '@react-three/fiber';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { HtmlProps } from '@react-three/drei/web/Html';
import axios from 'axios';

type ChromeBrowserProps = HtmlProps & {
  mockDisplay: boolean;
};

const ChromeBrowser = ({ mockDisplay, ...props }: ChromeBrowserProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [path, setPath] = useState<string>('https://threejs.org');
  const [pathDoc, setPathDoc] = useState<string | undefined>(undefined);
  const pathInputRef = useRef<HTMLInputElement>(null);
  const handleGobutton: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!pathInputRef.current) return;
    setPath(pathInputRef.current.value);
  };

  const getPathDoc = async (path: string) => {
    const { data } = await axios.get(
      `https://arcaea-archieve-proxy-prod.ruderud00552780.workers.dev/proxy/get-client?targetUrl=${path}`
    );
    setPathDoc(data);
  };

  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    // pathInputRef.current!.value = iframeRef.current?.contentWindow?.location.href || '';

    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    if (isSafari) {
      console.log('safari');
      getPathDoc(path);
    }
  }, [path]);

  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  return (
    <Html {...props}>
      <div className="w-[21rem] h-[13.5rem] bg-[url(/mac-background.png)] bg-cover bg-center bg-no-repeat">
        <div className="absolute maw-w-[inherit] top-2 left-2 bg-white rounded-2xl">
          <div className="rounded-t-2xl bg-[rgb(50,50,50)] w-full h-[2.4rem] flex items-center">
            <div className="flex pl-2 justify-between gap-2">
              <button className="bg-[rgb(240,100,90)] rounded-full w-4 h-4"></button>
              <button className="bg-[rgb(240,190,80)] rounded-full w-4 h-4"></button>
              <button className="bg-[rgb(100,200,80)] rounded-full w-4 h-4"></button>
            </div>
          </div>
          <form className="text-black">
            <input type="text" ref={pathInputRef} />
            <button type="submit" onClick={handleGobutton}>
              GO
            </button>
          </form>

          {!mockDisplay && (
            <iframe
              ref={iframeRef}
              src={path}
              title="embed"
              style={{
                transform: 'scale(1)',
                zoom: 4,
              }}
            />
          )}
        </div>
      </div>
    </Html>
  );
};

type MacBookProps = ThreeElements['group'] & {
  isOpen?: boolean;
  mockDisplay?: boolean;
};

export const MacBook = ({ isOpen = false, mockDisplay = true, ...props }: MacBookProps) => {
  const { nodes, materials } = useGLTF('/transforms/mac-draco.glb') as any;

  const screenRef = useRef<THREE.Group>(null);
  const vec = new Vector3();
  useFrame((state) => {
    if (!screenRef.current) return;

    if (isOpen) {
      screenRef.current.position.lerp(vec.set(0, 0.1, 0.26), 0.1);

      if (screenRef.current.rotation.x > Math.PI / 2.2) {
        screenRef.current.rotateX(-0.1);
      }
    }
    if (!isOpen) {
      screenRef.current.position.lerp(vec.set(0, 0.05, 0.6), 0.1);
      if (Math.abs(screenRef.current.rotation.x) < Math.PI) {
        if (Math.abs(screenRef.current.rotation.x) + 0.2 > Math.PI) {
          return (screenRef.current.rotation.x = Math.PI);
        }
        screenRef.current.rotateX(0.1);
      }
    }
  });

  const group = useRef<any>();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, Math.cos(t / 10) / 10 + 0.25, 0.1);
    group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, Math.sin(t / 10) / 10, 0.1);
    group.current.position.y = MathUtils.lerp(group.current.position.y, (-1 + Math.sin(t)) / 3, 0.1);
  });

  const screenPosition = [0, 0, -2.8] as [x: number, y: number, z: number];

  const macBookScreenBgMap = useTexture('/mac-background.png');
  macBookScreenBgMap.flipY = false;
  const screenMaterial = new MeshStandardMaterial({
    map: macBookScreenBgMap,
    metalness: 0,
    roughness: 1,
    roughnessMap: macBookScreenBgMap,
  });

  return (
    <group ref={group} {...props} castShadow receiveShadow>
      <group ref={screenRef} rotation={[Math.PI, 0, 0]} position={[0, 0.05, 0.6]} onClick={props.onClick}>
        <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} position={screenPosition} />
        <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} position={screenPosition} />
        <mesh material={screenMaterial} geometry={nodes['Cube008_2'].geometry} position={screenPosition} />
      </group>

      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />

      <group position={[0, -0.1, 3.39]} onClick={props.onClick}>
        <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
        <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
      </group>
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  );
};
