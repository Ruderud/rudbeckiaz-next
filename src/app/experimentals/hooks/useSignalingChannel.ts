'use client';

import { useEffect, useState } from 'react';
import { SignalingChannel } from '../utils';

export const useSignalingChannel = () => {
  const [signalingChannel, setSignalingChannel] = useState<SignalingChannel | null>(null);

  useEffect(() => {
    const channel = new SignalingChannel({
      signalingUrl: String(process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL),
      pathname: String(process.env.NEXT_PUBLIC_WS_SERVER_BASE_PATH),
      onMessage: (MessageEvent: MessageEvent) => {},
      onOpen: (Event: Event) => {
        setSignalingChannel(channel);
        console.log('Signaling Channel opened');
      },
      onClosed: (CloseEvent: CloseEvent) => {
        setSignalingChannel(null);
        console.log('Signaling Channel closed');
      },
    });
  }, []);

  return signalingChannel;
};
