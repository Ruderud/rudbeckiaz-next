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

  const [localConnection, setLocalConnection] = useState<RTCPeerConnection | null>(null);

  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);

  useEffect(() => {
    if (!signalingChannel) return;
    const localConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    });

    const sendChannel = localConnection.createDataChannel('sendDataChannel');
    // const receiveChannel = localConnection.createDataChannel('receiveDataChannel');
    localConnection.ondatachannel = (e) => {
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

    localConnection.onicecandidate = async (event) => {
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
        // if (!localConnection.remoteDescription) {
        //   console.log('remoteDescription is null');
        //   return;
        // }
        // console.log('remoteDescription', localConnection.remoteDescription);
        // await localConnection.addIceCandidate(candidate);
      } catch (error) {
        reportError({
          error,
          prefix: 'Failed to add Ice Candidate: ',
        });
      }
    };

    // localConnection.ontrack = (event) => {
    //   const remoteVideo = document.querySelector<HTMLVideoElement>('#remoteVideo');
    //   if (remoteVideo) {
    //     remoteVideo.srcObject = event.streams[0];
    //   }
    // };

    setLocalConnection(localConnection);
  }, [signalingChannel, userData]);

  useEffect(() => {
    if (!signalingChannel) return;
    if (!localConnection) return;
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
          await localConnection.setRemoteDescription(data.payload.offer);
          // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          // const localVideo = document.querySelector<HTMLVideoElement>('#localVideo');
          // if (localVideo) {
          //   localVideo.srcObject = stream;
          // }
          // stream.getTracks().forEach((track) => {
          //   localConnection.addTrack(track, stream);
          // });

          const offerAnswer = await localConnection.createAnswer();
          await localConnection.setLocalDescription(offerAnswer);

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
          if (!localConnection.remoteDescription) {
            console.log('remoteDescription is null');
            return;
          }
          await localConnection.addIceCandidate(data.payload.candidate);
          break;

        case 'SEND_ANSWER':
          console.log(`### SEND_ANSWER ###`);
          console.log('Answer from', data.payload.userData.userName);
          console.log('answer', data.payload.answer);
          if (localConnection.signalingState === 'stable') {
            console.log('now stable');
            return;
          }

          await localConnection.setRemoteDescription(data.payload.answer);
          break;

        default:
          break;
      }
    });
  }, [signalingChannel, localConnection, userData, offer]);

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
          console.log('localConnection', localConnection?.remoteDescription);
          if (signalingChannel && localConnection) {
            const roomId = search;
            const offer = await localConnection.createOffer();

            // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // const localVideo = document.querySelector<HTMLVideoElement>('#localVideo');
            // if (localVideo) {
            //   localVideo.srcObject = stream;
            // }
            // stream.getTracks().forEach((track) => {
            //   localConnection.addTrack(track, stream);
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
            await localConnection.setLocalDescription(offer);
          }
        }}
      >
        Connect
      </Button>

      <Button
        color="green"
        onClick={() => {
          console.log('localConnection', localConnection);
          console.log('sendChannel', sendChannel?.readyState);
        }}
      >
        localConnection Logging
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
