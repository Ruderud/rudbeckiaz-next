'use client';

import Minecraft from '../components/Mincraft';
import { ScreenUi } from './components/ScreenUi';

// Do not change state in this component. it will cause Minecraft component to re-render.
export default function PlayPage() {
  return (
    <main className="absolute top-0 w-screen h-screen">
      <div className="absolute z-30 top-[50%] left-[50%] w-[10px] h-[10px] rounded translate-x-[-50%] translate-y-[50%] translate-z-0 border-white border-2" />
      <ScreenUi />
      <Minecraft />
    </main>
  );
}
