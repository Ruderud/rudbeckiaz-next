import Image from 'next/image';
import Link from 'next/link';
import * as cheerio from 'cheerio';

// export const runtime = 'edge';

export const getMetadata = async (url: string) => {
  const res = await fetch(url);
  const data = await res.text();
  const $ = cheerio.load(data);

  const title = $('title').prop('innerText');
  const metaDescription = $('meta[name="description"]').attr('content');
  const metaImageUrl = $('meta[property="og:image"]').attr('content');

  return {
    title: title || 'untitled',
    metaDescription,
    metaImageUrl,
  };
};

type ScrawlCardProps = {
  href: string;
};

export const ScrawlCard = async ({ href }: ScrawlCardProps) => {
  const { title, metaDescription, metaImageUrl } = await getMetadata(String(process.env.NEXT_PUBLIC_BASE_URL + href));

  return (
    <Link
      className="w-[320px] h-[350px] bg-white hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-600 shadow-2xl rounded"
      href={href}
    >
      {metaImageUrl && (
        <div className="rounded w-[320px] h-[160px] bg-white flex align-center justify-center">
          <Image
            className="rounded"
            src={metaImageUrl}
            alt={`${title}-img`}
            loading="lazy"
            width={320}
            height={160}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <section className="p-4 shadow-inner">
        <p className="font-bold truncate pb-2">{title}</p>
        {metaDescription && <p>{metaDescription}</p>}
      </section>
    </Link>
  );
};

export default ScrawlCard;
