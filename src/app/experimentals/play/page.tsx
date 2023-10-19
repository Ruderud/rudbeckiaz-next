import { Dot } from './components/Dot';
import { ScreenUi } from './components/ScreenUi';
import Providers from './providers';
import dynamic from 'next/dynamic';
const Minecraft = dynamic(() => import('./components/Mincraft'));

// Do not change state in this component. it will cause Minecraft component to re-render.
export default function PlayPage() {
  return (
    <main className="absolute top-0 w-screen h-screen">
      <Providers>
        <Dot />
        <ScreenUi />
        <Minecraft />
      </Providers>
    </main>
  );
}
