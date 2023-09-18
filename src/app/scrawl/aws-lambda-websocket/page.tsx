export default function ScrawlPage() {
  return (
    <main className="min-w-screen min-h-screen px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10">
      <h1 className="text-xl font-bold">aws lambda에서의 websocket컨셉</h1>
      <br />

      <p>aws lambda에서 websocket사용컨셉</p>
      <p>- 소캣연결시 연결된 클라이언트를 ddb에 저장한다</p>
      <p>- 연결된 소캣들에게 broadcast시 ddb에 저장된 클라이언트들을 참조해서 메시지를 보낸다</p>
      <p>- 기본적으로 헨들러는 $default로 가나, 소캣을 열고닫는것은 따로 핸들링해주는것을 권장한다</p>
      <p>
        - 특정 소캣체널로 들어오는 이벤트는 request.body.action이나 payload등을 통해 따로 핸들러를 만들어서 보내주는
        형식으로 로직을 구성한다
      </p>
    </main>
  );
}
