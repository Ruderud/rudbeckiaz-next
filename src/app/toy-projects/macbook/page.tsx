import { Scene } from './components/Scene';

export const runtime = 'edge';

export default function AboutPage() {
  return (
    <main>
      <div className="absolute z-10 top-0 w-screen h-screen">
        <Scene />
      </div>
    </main>
  );
}
