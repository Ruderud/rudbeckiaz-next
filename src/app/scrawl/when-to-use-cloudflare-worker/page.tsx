import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'When to use cloudflare-worker',
  description: 'When to use cloudflare-worker',
  openGraph: {
    images:
      'https://rudbeckiaz-main-asset.s3.amazonaws.com/scrawl/when-to-use-cloudflare-worker/cloudflare_workers_logo.jpg',
  },
};

export default function ScrawlPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10">
      <h1 className="text-xl font-bold">When to use cloudflare-worker?</h1>
      <br />

      <section>
        <h2 className="text-lg font-bold pb-2">cloudflare-worker는?</h2>
        <div className="pl-2">
          <p>
            클라우드 플레어 워커 (이하 CF-W라고 칭한다)는 서비스 로직을 수행하기 위한 서버리스 백엔드 솔루션이라고 할 수
            있다.
          </p>
          <p>
            기존에는 백엔드 서버를 구축하고, 그 서버를 통해 서비스 로직을 수행했다면, CF-W는 이러한 백엔드 서버를
            구축하지 않고, CF-W를 통해 서비스 로직을 수행할 수 있다.
          </p>
          <p>
            특이한 점은 Aws Lambda와 다르게, 크롬에서 사용하는 V8엔진 기반으로 만들어져있기에 초기 작동시간은
            매우빠르다.
          </p>
          <p>
            이는 분명 장점이지만, 대신 aws lambda와 같이 외부 라이브러리 사용 밎 작동방법이 다른것이 많아서{' '}
            <Link className="font-bold text-blue-700" href="https://developers.cloudflare.com/workers/" target="_blank">
              공식문서
            </Link>
            를 읽고 열심히 트라이 해봐야한다.
          </p>
        </div>
      </section>

      <br />
      <section>
        <h2 className="text-lg font-bold pb-2">언제 쓰면 좋을까?</h2>
        <div className="pl-2">
          <p className="pb-1">
            서비스 로직을 실무자가 간단하게 쪼갤 수 있을때 쓰면 괜찮을 것 같다. 이는 서비스가 복잡한 것과는 다르다.
          </p>
          <p>
            물론 여기서 {'간단'}의 기준은 만드는 사람의 역량과 사용하는 솔루션 또는 프레임워크등의 기능에 따라 많이 바뀔
            수 있는 주관적인 요소이다.
          </p>
          <p>
            이를 토대로 말하면 즉, <strong>본인이 쉽다고 느끼는 서비스의 기능을 만들때</strong> 서버리스 백엔드를
            사용하라고 말하고 싶다.
          </p>
          <p className="pb-4">
            (물론 기술적으로 {'진짜'}못하는 것들도 있을 수 있다! 나 또한 그래서 이 글을 쓰고있는 것이다.)
          </p>
          <div className="pl-2">
            <p>개인적으로 사용하면서 추천하는 CF-W 사용처는 다음과 같다.</p>
            <p className="pb-4 text-sm">(Free-tier 기준으로 작성한다. 돈내면 안되는게 어디있는가.)</p>
            <ol>
              <li className="font-bold">1. Proxy서버 필요시</li>
              <p className="pb-2">{'=>'}이는 정말 편하게 만들어져 있다. wrangler 기본 생성포멧중 하나로 있을정도.</p>
              <li className="font-bold">2. 잦은 DB 저장/삭제/수정이 필요하지 않은 기능개발시</li>
              <p className="pb-2">
                {'=>'}무료 사용자라면 결국 KV를 사용해야하나? 라는 고민에 다다르게 된다. 이정도까지 가면 그냥 Aws
                solution을 찾아보자
              </p>
              <li className="font-bold">3. webSocket을 사용하지 않는 기능 개발시</li>
              <p className="pb-2">
                {'=>'}WebSocket을 지원하게된 지는 그리 오래되지 않았을 뿐더러, 정말 핵심기능인{' '}
                {'"다른 클라이언트들에게 메시지를 Broadcast"'}하는 기능이 무료에서는 불가능 하다는 것 이다.
              </p>
              <p className="pb-4">
                이는 CF-W에서 퍼포먼스 향상을 위해 일부러 다른핸들러에 접근하는것이 불가능하도록 했기 때문인데,
                이것때문에 유료기능인 {'"Durable Objects"'}를 사용해서 다른 소캣들을 전역 객체로서 저장하고, 불러와서
                사용해야한다.
              </p>
              <div className="text-sm bg-gray-500 p-2">
                <code>
                  {`Error: Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response
            bodies, and others) created in the context of one request handler cannot be accessed from a different
            request's handler. This is a limitation of Cloudflare Workers which allows us to improve overall
            performance.`}
                </code>
              </div>
              <p>억지로 특정 소캣에서 다른 소캣을 불러와서 사용시 나오는 에러 메시지이다.</p>
            </ol>
          </div>
        </div>
      </section>
      <p className="pt-4">
        위의 3가지 사항에 부합하는 기능개발시에는 무료로 간단하게 기능을 만드는데에는 매우 좋은 솔루션이라고 생각한다.
      </p>
    </main>
  );
}
