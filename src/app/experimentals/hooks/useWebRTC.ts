import { useEffect, useState } from 'react';
import { SignalingChannel } from '../utils';
import { Message, UserData } from '../utils/types';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

type DataChannelProps = {
  onRecieveMessage: (message: MessageEvent) => void;
};

type useWebRTCProps = {
  signalingChannel: SignalingChannel | null;
  dataChannelProps: DataChannelProps;
  userData: UserData | null;
};

export const useWebRTC = ({ signalingChannel, dataChannelProps, userData }: useWebRTCProps) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    if (!signalingChannel) return;
    if (!userData) return;
    console.log('### useWebRTC ###');
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // const sendChannel = pc.createDataChannel('sendDataChannel');
    // pc.ondatachannel = (e) => {
    //   const receiveChannel = e.channel;
    //   receiveChannel.onmessage = dataChannelProps.onRecieveMessage;
    // };

    // sendChannel.onopen = () => {
    //   console.log('sendChannel open');
    // };
    // sendChannel.onclose = () => {
    //   console.log('sendChannel close');
    // };

    // setSendChannel(sendChannel);

    // pc.onicecandidate = (event) => {
    //   try {
    //     signalingChannel.send({
    //       type: 'SEND_CANDIDATE',
    //       payload: {
    //         candidate: event.candidate,
    //         userData,
    //       },
    //     });
    //   } catch (error) {
    //     reportError({
    //       error,
    //       prefix: 'Failed to add Ice Candidate: ',
    //       notice: true,
    //     });
    //   }
    // };

    // signalingChannel.setOnMessage(async (message) => {
    //   const data = JSON.parse(message.data);

    //   // pass receive my offer
    //   if (data.payload.userData.id === userData.id) return;

    //   switch (data.type) {
    //     case 'SEND_OFFER':
    //       console.log(`### SEND_OFFER ###`);
    //       await pc.setRemoteDescription(data.payload.offer);
    //       const offerAnswer = await pc.createAnswer();
    //       await pc.setLocalDescription(offerAnswer);

    //       signalingChannel.send({
    //         type: 'SEND_ANSWER',
    //         payload: {
    //           answer: offerAnswer,
    //           userData,
    //         },
    //       });
    //       break;

    //     case 'SEND_CANDIDATE':
    //       console.log(`### SEND_CANDIDATE ###`);
    //       if (!data.payload.candidate) return;
    //       if (!pc.remoteDescription) return;
    //       await pc.addIceCandidate(data.payload.candidate);
    //       break;

    //     case 'SEND_ANSWER':
    //       console.log(`### SEND_ANSWER ###`);
    //       if (pc.signalingState === 'stable') return;
    //       await pc.setRemoteDescription(data.payload.answer);
    //       break;

    //     default:
    //       break;
    //   }
    // });

    setPc(pc);
  }, [signalingChannel, dataChannelProps, userData]);

  //   useEffect(() => {
  //     if (!signalingChannel) return;
  //     if (!pc) return;
  //     if (!userData) return;
  //     console.log('### useWebRTC-connect ###');

  //     signalingChannel.setOnMessage(async (message) => {
  //       const data = JSON.parse(message.data);

  //       // pass receive my offer
  //       if (data.payload.userData.id === userData.id) return;

  //       switch (data.type) {
  //         case 'SEND_OFFER':
  //           console.log(`### SEND_OFFER ###`);
  //           await pc.setRemoteDescription(data.payload.offer);
  //           const offerAnswer = await pc.createAnswer();
  //           await pc.setLocalDescription(offerAnswer);

  //           signalingChannel.send({
  //             type: 'SEND_ANSWER',
  //             payload: {
  //               answer: offerAnswer,
  //               userData,
  //             },
  //           });
  //           break;

  //         case 'SEND_CANDIDATE':
  //           console.log(`### SEND_CANDIDATE ###`);
  //           if (!data.payload.candidate) return;
  //           if (!pc.remoteDescription) return;
  //           await pc.addIceCandidate(data.payload.candidate);
  //           break;

  //         case 'SEND_ANSWER':
  //           console.log(`### SEND_ANSWER ###`);
  //           if (pc.signalingState === 'stable') return;
  //           await pc.setRemoteDescription(data.payload.answer);
  //           break;

  //         default:
  //           break;
  //       }
  //     });
  //   }, [signalingChannel, pc, userData]);

  return {
    peerConnection: pc,
    sendChannel: sendChannel,
  };
};
