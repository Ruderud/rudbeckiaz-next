'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Message } from '../../utils/types';

import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSignalingChannel } from '../../hooks/useSignalingChannel';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useGetRoomInfoQuery } from '../../hooks/useGetRoomInfoQuery';

type SendMessage = {
  message: string;
};

type ChatBoxProps = {
  onSubmitMessage?: (message: string) => void;
};

const ChatBox = ({ onSubmitMessage }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SendMessage>();

  const onSubmit: SubmitHandler<SendMessage> = (data) => {
    onSubmitMessage && onSubmitMessage(data.message);
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

export const ScreenUi = () => {
  const roomId = useSearchParams().get('room');

  const storedUserId = useMemo(() => {
    return window.localStorage.getItem('userId');
  }, []);
  const { data: userData } = useGetUserInfoQuery({ id: storedUserId });
  const { data: roomData } = useGetRoomInfoQuery({ id: roomId });
  const isHost = useMemo(() => {
    if (roomData?.Item.host.id === userData?.id) return true;
    return false;
  }, [roomData, userData]);

  const signalingChannel = useSignalingChannel();
  const { pc, sendChannel, receiveChannel } = useWebRTC({ signalingChannel, userData });

  const sendPcOffer = useCallback(async () => {
    if (!signalingChannel || !pc) return;
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
  }, [signalingChannel, pc, userData, roomId]);

  const onSubmitMessage = useCallback(
    (message: string) => {
      sendChannel?.send(
        JSON.stringify({
          message,
          userData,
        })
      );
    },
    [sendChannel, userData]
  );

  useEffect(() => {
    if (!receiveChannel) return;
    receiveChannel.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log('added new event', message);
    });
  }, [receiveChannel]);

  useEffect(() => {
    if (isHost) return;
    sendPcOffer();
  }, [isHost, sendPcOffer]);

  return (
    <div className={`absolute z-30 w-full h-full bg-white/25`}>
      <ChatBox onSubmitMessage={onSubmitMessage} />
    </div>
  );
};
