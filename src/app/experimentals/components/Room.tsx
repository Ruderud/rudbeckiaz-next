'use client';

import { useSearchParams } from 'next/navigation';
import { MinecraftContext } from '../providers';
import { useContext, useEffect, useState } from 'react';
import { reportError } from '@/utils';
import { Button } from '@/components/Ui/Button';
import { UserData } from '../utils/types';

type Message = {
  userData: UserData;
  message: string;
};

export const Room = () => {
  const { signalingChannel, userData } = useContext(MinecraftContext);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  const searchParams = useSearchParams();
  const search = searchParams.get('room');

  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);

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
    // const receiveChannel = pc.createDataChannel('receiveDataChannel');
    pc.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        const messageData = JSON.parse(e.data) as Message;
        setMessages((prev) => [...prev, messageData]);
      };
      setReceiveChannel(receiveChannel);
    };

    sendChannel.onopen = (event) => {
      console.log('sendChannel open', event);
    };

    setSendChannel(sendChannel);

    pc.onicecandidate = async (event) => {
      console.log('candidate Fire at', new Date().toISOString());
      try {
        signalingChannel.send({
          type: 'SEND_CANDIDATE',
          payload: {
            candidate: event.candidate,
            userData,
          },
        });
        // const { candidate } = event;
        // // console.log('candidate', candidate);
        // if (!candidate) {
        //   console.log('candidate is null');
        //   return;
        // }
        // if (!pc.remoteDescription) {
        //   console.log('remoteDescription is null');
        //   return;
        // }
        // console.log('remoteDescription', pc.remoteDescription);
        // await pc.addIceCandidate(candidate);
      } catch (error) {
        reportError({
          error,
          prefix: 'Failed to add Ice Candidate: ',
        });
      }
    };

    // pc.ontrack = (event) => {
    //   const remoteVideo = document.querySelector<HTMLVideoElement>('#remoteVideo');
    //   if (remoteVideo) {
    //     remoteVideo.srcObject = event.streams[0];
    //   }
    // };

    setPc(pc);
  }, [signalingChannel, userData]);

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
          console.log('offer from', data.payload.userData.userName);
          //   console.log('offer', data.payload.offer);
          await pc.setRemoteDescription(data.payload.offer);
          // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          // const localVideo = document.querySelector<HTMLVideoElement>('#localVideo');
          // if (localVideo) {
          //   localVideo.srcObject = stream;
          // }
          // stream.getTracks().forEach((track) => {
          //   pc.addTrack(track, stream);
          // });

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
          if (!pc.remoteDescription) {
            console.log('remoteDescription is null');
            return;
          }
          await pc.addIceCandidate(data.payload.candidate);
          break;

        case 'SEND_ANSWER':
          console.log(`### SEND_ANSWER ###`);
          console.log('Answer from', data.payload.userData.userName);
          console.log('answer', data.payload.answer);
          if (pc.signalingState === 'stable') {
            console.log('now stable');
            return;
          }

          await pc.setRemoteDescription(data.payload.answer);
          break;

        default:
          break;
      }
    });
  }, [signalingChannel, pc, userData, offer]);

  return (
    <div>
      <div>{`Room Id is: ${search}`}</div>

      <input
        className="text-black"
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />

      <Button
        color="blue"
        onClick={async () => {
          console.log('pc', pc?.remoteDescription);
          if (signalingChannel && pc) {
            const roomId = search;
            const offer = await pc.createOffer();

            // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // const localVideo = document.querySelector<HTMLVideoElement>('#localVideo');
            // if (localVideo) {
            //   localVideo.srcObject = stream;
            // }
            // stream.getTracks().forEach((track) => {
            //   pc.addTrack(track, stream);
            // });

            console.log('setLocalDescription Fire at', new Date().toISOString());
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

      <Button
        color="green"
        onClick={() => {
          console.log('pc', pc);
          console.log('sendChannel', sendChannel?.readyState);
        }}
      >
        pc Logging
      </Button>

      <Button
        color="green"
        onClick={() => {
          sendChannel?.send(
            JSON.stringify({
              userData,
              message,
            })
          );
        }}
      >
        Test Send
      </Button>

      <div>
        {messages.map((message, index) => {
          return (
            <div key={index}>{`${message.userData.userName}${message.userData.nameCode}: ${message.message}`}</div>
          );
        })}
      </div>

      {/* <video id="localVideo" playsInline autoPlay muted></video>
      <video id="remoteVideo" playsInline autoPlay></video> */}
    </div>
  );
};
