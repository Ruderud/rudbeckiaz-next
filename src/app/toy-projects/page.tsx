import Link from 'next/link';

export const metadata = {
  title: 'Rud - toy-projects',
  description: 'Exploring the Tangible Manifestation of Inspiration through Toy Projects',
};

export default function ToyProjectsPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10 flex flex-col">
      <Link href="/toy-projects/macbook">simple macbook</Link>
      {process.env.NEXT_PUBLIC_BUILD_MODE === 'dev' && (
        <Link href="/toy-projects/concert-hall">concert hall(dev-ing)</Link>
      )}
    </main>
  );
}
