import Link from 'next/link';
import { DarkModeButton } from './DarkModeButton';

export const TopBar = () => {
  return (
    <nav className="sticky z-20 top-0 backdrop-blur-lg p-2 border-b-[1px] border-slate-400 flex justify-between">
      <Link href="/" className="text-xl font-bold px-5 flex items-center">
        Rud
      </Link>
      <div className="px-5 flex justify-end items-center gap-5">
        <Link href="/experimentals">Experimental</Link>
        <Link href="/scrawl">Scrawl</Link>
        <Link href="/about">About</Link>
        <DarkModeButton />
      </div>
    </nav>
  );
};
