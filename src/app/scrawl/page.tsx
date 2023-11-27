import { Metadata } from 'next';
import ScrawlCard from './components/ScrawlCard';

export const metadata: Metadata = {
  title: 'Rud - scrawl',
  description: 'Unleash Random Thoughts',
};

export const runtime = 'edge';

export default function ScrawlPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10 flex flex-wrap gap-4">
      <ScrawlCard href="/scrawl/when-to-use-cloudflare-worker" />
      {/* <ScrawlCard href="/scrawl/aws-lambda-websocket" /> */}
      {/* <ScrawlCard href="/scrawl/yarn-v4" /> */}
    </main>
  );
}
