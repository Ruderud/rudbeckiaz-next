'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Message, UserData } from '../../utils/types';

import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SignalingChannel } from '../../utils';
import { useSignalingChannel } from '../../hooks/useSignalingChannel';
import { useGetRoomInfoQuery } from '../../hooks/useGetRoomInfoQuery';

type SendMessage = {
  message: string;
};

type ChatBoxProps = {
  onSendMessage?: (message: string) => void;
};

const ChatBox = ({ onSendMessage }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SendMessage>();

  const onSubmit: SubmitHandler<SendMessage> = (data) => {
    onSendMessage && onSendMessage(data.message);
    reset();
  };

  return (
    <div className="absolute bottom-0 left-0 bg-[rgba(255, 0, 0, 0.5)] w-[500px] w-max-[500px] h-[300px] h-max-[300px] overflow-auto">
      <ul className="flex flex-col grow">
        {messages.map((message, index) => {
          return (
            <li key={index}>{`${message?.userData?.userName}${message?.userData?.nameCode}: ${message.message}`}</li>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('message', { required: true, minLength: 1, onBlur: () => console.log('onBlur') })}
          className="absolute bottom-0 left-0 w-full text-black bg-[rgba(0,0,0,1)]]"
          type="text"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

type useWebRTCParams = {
  signalingChannel: SignalingChannel | null;
  userData: UserData | null;
};

const useWebRTC = ({ signalingChannel, userData }: useWebRTCParams) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    if (!signalingChannel) return;
    if (!userData) return;

    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    const sendChannel = pc.createDataChannel('sendDataChannel');
    pc.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        const messageData = JSON.parse(e.data) as Message;
        console.log('receiveChannel.onmessage', messageData);
      };
    };

    sendChannel.onopen = () => {
      console.log('sendChannel open');
    };
    sendChannel.onclose = () => {
      console.log('sendChannel close');
    };

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
    setSendChannel(sendChannel);
  }, [userData, signalingChannel]);

  useEffect(() => {
    if (!signalingChannel) return;
    if (!pc) return;
    if (!userData) return;

    signalingChannel.setOnMessage(async (message) => {
      const data = JSON.parse(message.data);

      // pass receive my offer
      if (data.payload.userData.id === userData.id) return;
      console.log('data.payload', data);

      switch (data.type) {
        case 'SEND_OFFER':
          console.log(`### SEND_OFFER ###`);
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
  }, [signalingChannel, pc, userData]);

  return { pc, sendChannel };
};

const ScreenUi = () => {
  const storedUserId = useMemo(() => {
    return window.localStorage.getItem('userId');
  }, []);
  const signalingChannel = useSignalingChannel();
  const { data: userData } = useGetUserInfoQuery({ id: storedUserId });
  const { pc, sendChannel } = useWebRTC({
    signalingChannel: signalingChannel,
    userData: userData?.userData || null,
  });
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room');
  const { data: roomData } = useGetRoomInfoQuery({ id: roomId });
  const isHost = useMemo(() => {
    if (!userData || !roomData) return false;
    if (userData.userData.id === roomData.Item.host.id) return true;
    return false;
  }, [userData, roomData]);

  const sendOffer = useCallback(async () => {
    if (!signalingChannel) return;
    if (!pc) return;
    if (!roomId) return;
    if (!userData?.userData) return;
    const offer = await pc.createOffer();
    signalingChannel.send({
      type: 'SEND_OFFER',
      payload: {
        roomId,
        offer,
        userData: userData.userData,
      },
    });

    console.log('### fire send offer, pc-signalingState: ###', pc.signalingState);
  }, [signalingChannel, pc, roomId, userData]);

  const sendMessage = useCallback(
    (message: string) => {
      console.log('pc states', sendChannel, pc);

      if (!sendChannel) return;
      sendChannel.send(
        JSON.stringify({
          message,
          userData: userData?.userData || null,
        })
      );
    },
    [sendChannel, pc, userData]
  );

  return (
    <div className="absolute z-30 w-full h-full bg-white/25">
      <ChatBox onSendMessage={sendMessage} />
      {!isHost && (
        <button
          className="absolute top-[50%] bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            sendOffer();
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export { ScreenUi };
