import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Rud - scrawl',
  description: 'Unleash Random Thoughts',
};

type ScrawlCardProps = {
  title: string;
  description: string;
  href: string;
  imgUrl?: string;
};

const ScrawlCard = ({ title, description, href, imgUrl }: ScrawlCardProps) => {
  return (
    <Link
      className="w-[320px] h-[350px] bg-white hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-600 shadow-2xl rounded"
      href={href}
    >
      {imgUrl && (
        <div className="rounded w-[320px] h-[160px] bg-white flex align-center justify-center">
          <Image
            className="rounded"
            src={imgUrl}
            alt={`${title}-img`}
            width={320}
            height={160}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <section className="p-4 shadow-inner">
        <p className="font-bold truncate pb-2">{title}</p>
        <p>{description}</p>
      </section>
    </Link>
  );
};

export default function ScrawlPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10 flex flex-wrap gap-4">
      <ScrawlCard
        title="Cloudflare worker를 언제 사용해야할까??????????????"
        description="Cloudflare worker를 사용하는 시점에 대해 고민해보고, 정해본 개인적 기준"
        href="/scrawl/when-to-use-cloudflare-worker"
        imgUrl="https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/when-to-use-cloudflare-worker/cloudflare_workers_logo.jpg"
      />
      <ScrawlCard
        title="Aws lambda에서 websocket 사용해보기"
        description="서버리스환경에서 websocket을 사용하는 방법"
        href="/scrawl/aws-lambda-websocket"
        imgUrl="https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/aws-lambda-websocket/ws-chat-app.png"
      />
      <ScrawlCard
        title="yarn v4 사용하기"
        description="yarn v4를 사용하여 프로젝트 시작하기"
        href="/scrawl/yarn-v4"
        imgUrl="https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/yarn-v4/yarn-kitten-full.png"
      />
    </main>
  );
}
