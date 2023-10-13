import { Dispatch, useCallback, useContext, useEffect, useState } from 'react';
import { MinecraftContext } from '../providers';
import { Message } from '../../utils/types';
import { Button } from '@/components/Ui/Button';
import { useSearchParams } from 'next/navigation';
import { useWebRTC } from '../../hooks/useWebRTC';

type WebRTCProps = {
  setSendChannel: Dispatch<React.SetStateAction<RTCDataChannel | null>>;
  setMessages: Dispatch<React.SetStateAction<Message[]>>;
};

export const WebRTC = () => {
  console.log('### WebRTC render ###');
  // const { signalingChannel } = useContext(MinecraftContext);

  // const searchParams = useSearchParams();
  // const roomId = searchParams.get('room');
  // const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const onRecieveMessage = useCallback((message: MessageEvent) => {
    console.log('onRecieveMessage', message);
  }, []);

  const { peerConnection: pc, sendChannel } = useWebRTC({
    signalingChannel: null,
    dataChannelProps: {
      onRecieveMessage: onRecieveMessage,
    },
    userData: null,
  });

  // useEffect(() => {
  //   if (!signalingChannel) return;
  //   console.log('### WebRTC useEffect1 ###');
  //   const pc = new RTCPeerConnection({
  //     iceServers: [
  //       { urls: 'stun:stun.l.google.com:19302' },
  //       { urls: 'stun:stun1.l.google.com:19302' },
  //       { urls: 'stun:stun2.l.google.com:19302' },
  //       { urls: 'stun:stun3.l.google.com:19302' },
  //       { urls: 'stun:stun4.l.google.com:19302' },
  //     ],
  //   });

  //   const sendChannel = pc.createDataChannel('sendDataChannel');
  //   pc.ondatachannel = (e) => {
  //     const receiveChannel = e.channel;
  //     receiveChannel.onmessage = (e) => {
  //       const messageData = JSON.parse(e.data) as Message;
  //       setMessages((prev) => [...prev, messageData]);
  //     };
  //   };

  //   sendChannel.onopen = () => {
  //     console.log('sendChannel open');
  //   };
  //   sendChannel.onclose = () => {
  //     console.log('sendChannel close');
  //   };

  //   setSendChannel(sendChannel);

  //   pc.onicecandidate = (event) => {
  //     try {
  //       signalingChannel.send({
  //         type: 'SEND_CANDIDATE',
  //         payload: {
  //           candidate: event.candidate,
  //           userData,
  //         },
  //       });
  //     } catch (error) {
  //       reportError({
  //         error,
  //         prefix: 'Failed to add Ice Candidate: ',
  //         notice: true,
  //       });
  //     }
  //   };

  //   setPc(pc);
  // }, [signalingChannel, userData, setMessages, setSendChannel]);

  // useEffect(() => {
  //   if (!signalingChannel) return;
  //   if (!pc) return;
  //   if (!userData) return;
  //   console.log('### WebRTC useEffect2 ###');

  //   signalingChannel.setOnMessage(async (message) => {
  //     const data = JSON.parse(message.data);

  //     // pass receive my offer
  //     if (data.payload.userData.id === userData.id) return;

  //     switch (data.type) {
  //       case 'SEND_OFFER':
  //         console.log(`### SEND_OFFER ###`);
  //         await pc.setRemoteDescription(data.payload.offer);
  //         const offerAnswer = await pc.createAnswer();
  //         await pc.setLocalDescription(offerAnswer);

  //         signalingChannel.send({
  //           type: 'SEND_ANSWER',
  //           payload: {
  //             answer: offerAnswer,
  //             userData,
  //           },
  //         });
  //         break;

  //       case 'SEND_CANDIDATE':
  //         console.log(`### SEND_CANDIDATE ###`);
  //         if (!data.payload.candidate) return;
  //         if (!pc.remoteDescription) return;
  //         await pc.addIceCandidate(data.payload.candidate);
  //         break;

  //       case 'SEND_ANSWER':
  //         console.log(`### SEND_ANSWER ###`);
  //         if (pc.signalingState === 'stable') return;
  //         await pc.setRemoteDescription(data.payload.answer);
  //         break;

  //       default:
  //         break;
  //     }
  //   });
  // }, [signalingChannel, pc, userData]);

  return (
    <div>
      WebRTC
      <Button
      // disabled={!signalingChannel || signalingChannel.webSocket?.readyState !== 1}
      // onClick={async () => {
      //   if (signalingChannel && pc) {
      //     console.log('connection start');
      //     const offer = await pc.createOffer();
      //     signalingChannel.send({
      //       type: 'SEND_OFFER',
      //       payload: {
      //         roomId,
      //         offer,
      //         userData,
      //       },
      //     });
      //     await pc.setLocalDescription(offer);
      //   }
      // }}
      >
        Connect
      </Button>
    </div>
  );
};
