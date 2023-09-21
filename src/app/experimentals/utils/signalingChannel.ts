import { reportError } from '@/utils';

type SignalingChannelParams = {
  signalingUrl: string;
  pathname?: string;
  onMessage?: (data: MessageEvent) => void;
  onClosed?: (data: CloseEvent) => void;
  onOpen?: (data: Event) => void;
};
export class SignalingChannel {
  signalingUrl?: URL;
  webSocket?: WebSocket;
  constructor({ signalingUrl, pathname = '/', onMessage, onClosed, onOpen }: SignalingChannelParams) {
    this.signalingUrl = new URL(signalingUrl);
    this.signalingUrl.protocol = this.checkHTTPS(signalingUrl) ? 'wss' : 'ws';
    this.signalingUrl.pathname = pathname;
    this.webSocket = new WebSocket(this.signalingUrl);
    this.webSocket.addEventListener('message', onMessage || this.onMessage);
    this.webSocket.addEventListener('open', onOpen || this.onOpen);
    this.webSocket.addEventListener('close', onClosed || this.onClosed);
  }

  private checkHTTPS = (url: string) => {
    const wsProtocolPattern = /^(ws|wss):\/\//;
    const httpProtocolPattern = /^(http|https):\/\//;

    try {
      if (wsProtocolPattern.test(url)) {
        return url.match(/^wss:/) !== null ? true : false;
      }
      if (!httpProtocolPattern.test(url)) throw new Error('Invalid URL');
      return url.match(/^https:/) !== null ? true : false;
    } catch (error) {
      reportError(error, 'checkHTTPS: ');
      return false;
    }
  };

  private onMessage(data: MessageEvent) {
    console.log('received message', data);
  }

  private onOpen() {
    console.log('Signal Channel opened');
  }

  onClosed() {
    console.log('Signal Channel closed');
  }

  // setOnMessage(newOnMessageCallBack: (data: MessageEvent) => void) {
  //   this.webSocket?.removeEventListener('message', this.onMessage);
  //   this.webSocket?.addEventListener('message', newOnMessageCallBack);
  // }

  send(data: unknown) {
    if (!this.webSocket) {
      console.log("ws doesn't exist");
      return;
    }
    if (this.webSocket instanceof WebSocket) {
      this.webSocket.send(JSON.stringify(data));
    }
    console.log('send: ', JSON.stringify(data));
  }

  close() {
    this.webSocket?.close();
  }
}
