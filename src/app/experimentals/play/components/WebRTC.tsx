'use client';

import { Dispatch, useContext, useEffect, useState } from 'react';
import { MinecraftContext } from '../../providers';
import { Message } from '../../utils/types';
import { Button } from '@/components/Ui/Button';
import { useSearchParams } from 'next/navigation';

type WebRTCProps = {
  setSendChannel: Dispatch<React.SetStateAction<RTCDataChannel | null>>;
  setMessages: Dispatch<React.SetStateAction<Message[]>>;
};

export const WebRTC = ({ setSendChannel, setMessages }: WebRTCProps) => {
  const { signalingChannel, userData } = useContext(MinecraftContext);

  const searchParams = useSearchParams();
  const roomId = searchParams.get('room');
  //   const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  //   const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    if (!signalingChannel) return;
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    });

    const sendChannel = pc.createDataChannel('sendDataChannel');
    pc.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        const messageData = JSON.parse(e.data) as Message;
        setMessages((prev) => [...prev, messageData]);
      };
    };

    sendChannel.onopen = () => {
      console.log('sendChannel open');
    };
    sendChannel.onclose = () => {
      console.log('sendChannel close');
    };

    setSendChannel(sendChannel);

    pc.onicecandidate = (event) => {
      try {
        signalingChannel.send({
          type: 'SEND_CANDIDATE',
          payload: {
            candidate: event.candidate,
            userData,
          },
        });
      } catch (error) {
        reportError({
          error,
          prefix: 'Failed to add Ice Candidate: ',
          notice: true,
        });
      }
    };

    setPc(pc);
  }, [signalingChannel, userData, setMessages, setSendChannel]);

  useEffect(() => {
    if (!signalingChannel) return;
    if (!pc) return;
    if (!userData) return;

    signalingChannel.setOnMessage(async (message) => {
      const data = JSON.parse(message.data);

      // pass receive my offer
      if (data.payload.userData.id === userData.id) return;

      switch (data.type) {
        case 'SEND_OFFER':
          console.log(`### SEND_OFFER ###`, new Date().toISOString());
          await pc.setRemoteDescription(data.payload.offer);

          const offerAnswer = await pc.createAnswer();
          await pc.setLocalDescription(offerAnswer);

          signalingChannel.send({
            type: 'SEND_ANSWER',
            payload: {
              answer: offerAnswer,
              userData,
            },
          });
          break;

        case 'SEND_CANDIDATE':
          console.log(`### SEND_CANDIDATE ###`);
          if (!data.payload.candidate) return;
          if (!pc.remoteDescription) return;
          await pc.addIceCandidate(data.payload.candidate);
          break;

        case 'SEND_ANSWER':
          console.log(`### SEND_ANSWER ###`);
          if (pc.signalingState === 'stable') return;
          await pc.setRemoteDescription(data.payload.answer);
          break;

        default:
          break;
      }
    });
  }, [signalingChannel, pc, userData]);

  return (
    <div>
      WebRTC
      <Button
        disabled={!signalingChannel || signalingChannel.webSocket?.readyState !== 1}
        onClick={async () => {
          if (signalingChannel && pc) {
            const offer = await pc.createOffer();
            signalingChannel.send({
              type: 'SEND_OFFER',
              payload: {
                roomId,
                offer,
                userData,
              },
            });
            await pc.setLocalDescription(offer);
          }
        }}
      >
        Connect
      </Button>
    </div>
  );
};
