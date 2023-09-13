import Link from 'next/link';

export const metadata = {
  title: 'Rud - scrawl',
  description: 'Unleash Random Thoughts',
};
export default function ScrawlPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10">
      <Link href="/scrawl/when-to-use-cloudflare-worker">When to use Cloudflare Workers?</Link>
    </main>
  );
}
