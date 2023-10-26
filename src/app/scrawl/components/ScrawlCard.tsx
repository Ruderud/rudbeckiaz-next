import Image from 'next/image';
import Link from 'next/link';

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
            loading="lazy"
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

export default ScrawlCard;
