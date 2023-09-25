'use client';

import { useEffect, useState } from 'react';
import { SignalingChannel } from '../utils';

export const useSignalingChannel = () => {
  const [signalingChannel, setSignalingChannel] = useState<SignalingChannel | null>(null);

  useEffect(() => {
    const baseUrl = String(process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL);
    const channel = new SignalingChannel({
      signalingUrl: baseUrl,
      pathname: '/dev',
      onMessage: (MessageEvent: MessageEvent) => {
        console.log('MessageEvent', MessageEvent);
      },
      onOpen: (Event: Event) => {
        setSignalingChannel(channel);
        console.log('Signal Channel opened');
      },
      onClosed: (CloseEvent: CloseEvent) => {
        setSignalingChannel(null);
        console.log('Signal Channel closed');
      },
    });
  }, []);

  return signalingChannel;
};
