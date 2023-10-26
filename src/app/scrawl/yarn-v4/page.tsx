import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'yarn v4 사용하기',
  description: 'yarn v4를 사용하여 프로젝트 시작하기',
  openGraph: {
    images: 'https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/yarn-v4/yarn-kitten-full.png',
  },
};

export default function YarnV4Page() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10">
      <h1 className="text-xl font-bold">Yarn v4 사용하기</h1>
      <br />

      <Image
        className="bg-white p-4 mb-4"
        src={'https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/yarn-v4/yarn-kitten-full.png'}
        alt="cloudflare_workers_logo"
        width={300}
        height={150}
      />

      <section className="pb-4">
        <h2 className="text-lg font-bold pb-2">yarn v4 업데이트 노트</h2>
        <div className="pl-2">
          <Link className="font-bold text-blue-700" href="https://yarnpkg.com/blog/release/4.0" target="_blank">
            공식문서 링크
          </Link>
        </div>
      </section>

      <section className="pb-4">
        <h2 className="text-lg font-bold pb-2">기존 v3에서 크게 달라진점</h2>
        <div className="pl-2">
          <p>yarn을 각 프로젝트에 직접 설치하지 않고, nodejs의 corepack을 사용하여 사용한다. (node 18버전이상필요)</p>
        </div>
      </section>

      <section className="pb-4">
        <h2 className="text-lg font-bold pb-2">프로젝트에서 yarn v4사용하기</h2>
        <div className="pl-2 pb-2">
          <pre className="bg-slate-500">
            <code>
              {'$ corepack enable // corepack 사용\n'}
              {
                '$ yarn init -2를 사용해서 프로젝트 시작. 또는 yarn create react-app my-app, yarn create vite 등을 사용하여 생성\n'
              }
              {'$ yarn install'}
            </code>
          </pre>
        </div>
        <div className="pl-2 pb-2">
          <p className="pb-2">
            만일, 이전의 전역설치된 yarn v3로 인해 yarn v4로 설치되지 않았다면 생성된 패키지 내에서 다음과 같이 업데이트
          </p>
          <pre className="bg-slate-500">
            <code>
              {'$ yarn set version stable\n'}
              {'$ yarn install'}
            </code>
          </pre>
        </div>

        <p>이제 자동으로 .yarnrc.yml이 생성된다.</p>
      </section>
    </main>
  );
}
