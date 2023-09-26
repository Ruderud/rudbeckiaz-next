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
  /**
   * @param readyState 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED
   */
  webSocket?: WebSocket;
  constructor({ signalingUrl, pathname = '/', onMessage, onClosed, onOpen }: SignalingChannelParams) {
    this.signalingUrl = new URL(signalingUrl);
    this.signalingUrl.protocol = this.checkHTTPS(signalingUrl) ? 'wss' : 'ws';
    this.signalingUrl.pathname = pathname;
    this.webSocket = new WebSocket(this.signalingUrl);
    this.webSocket.addEventListener('message', onMessage || this.onMessage);
    onOpen && this.webSocket.addEventListener('open', onOpen);
    onClosed && this.webSocket.addEventListener('close', onClosed);
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
      reportError({
        error,
        prefix: 'checkHTTPS: ',
        notice: false,
      });
      return false;
    }
  };

  private onMessage(data: MessageEvent) {
    console.log('received message', data);
  }

  setOnMessage(onMessage: (data: MessageEvent) => void) {
    this.webSocket?.addEventListener('message', onMessage);
  }

  send(data: unknown) {
    try {
      if (!this.webSocket) throw new Error('WebSocket is not initialized');
      this.webSocket.send(JSON.stringify(data));
    } catch (error) {
      reportError({ error });
    }
  }

  close() {
    this.webSocket?.close();
  }
}
