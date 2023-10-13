'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, createElement, use, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Message, UserData } from '../../utils/types';
import { WebRTC } from './WebRTC';
import { UserInfo } from './UserInfo';
import { MinecraftContext } from '../providers';
import { Button } from '@/components/Ui/Button';

import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { SubmitHandler, set, useController, useForm } from 'react-hook-form';
import { SignalingChannel } from '../../utils';
import { useSignalingChannel } from '../../hooks/useSignalingChannel';
import { useGetRoomInfoQuery } from '../../hooks/useGetRoomInfoQuery';

const ScreenUi_old = () => {
  // const { signalingChannel } = useContext(MinecraftContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room');
  const inputRef = useRef<HTMLInputElement>(null);
  const signalingChannel = useSignalingChannel();

  const [inputActive, setInputActive] = useState<boolean>(false);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const { data } = useGetUserInfoQuery({ id: userId });
  const userData = data?.userData || null;

  const addMessage = useCallback(
    (message?: string) => {
      if (!userData) return;
      if (!inputRef.current) return;
      if (!message) return;
      setMessages((prev) => [
        ...prev,
        {
          userData: userData,
          message: message,
        },
      ]);
      setMessage('');
      inputRef.current.blur();
    },
    [userData]
  );
  useEffect(() => {
    const body = document.querySelector('body');

    function toggleChatBoxOpen(this: HTMLBodyElement, event: KeyboardEvent) {
      if (event.code === 'Enter') {
        setInputActive((cur) => {
          if (cur) {
            if (sendChannel?.readyState === 'open') {
              sendChannel?.send(
                JSON.stringify({
                  userData,
                  message: inputRef.current?.value,
                })
              );
            }
            addMessage(inputRef.current?.value);
            body?.removeAttribute('playerActive');
            return false;
          } else {
            body?.setAttribute('playerActive', 'true');
            setTimeout(() => {
              inputRef.current?.focus();
            });
            return true;
          }
        });
      }
    }
    body?.addEventListener('keydown', toggleChatBoxOpen);

    return () => {
      body?.removeEventListener('keydown', toggleChatBoxOpen);
    };
  }, [sendChannel, userData]);

  const enableInput = 'bottom-0 w-full text-black';
  const disableInput = 'hidden';

  return (
    <>
      <div className="absolute z-30 top-20 left-5">
        <p>{`RoomId: ${roomId === null ? 'soloPlay' : roomId}`}</p>
        {/* <Suspense fallback={<div>Loading...</div>}>
          <UserInfo />
        </Suspense> */}

        <WebRTC />

        {/* <div>
          WebRTC
          <Button
            disabled={!signalingChannel || signalingChannel.webSocket?.readyState !== 1}
            onClick={async () => {
              if (signalingChannel && peerConnection) {
                console.log('connection start');
                const offer = await peerConnection.createOffer();
                // signalingChannel.send({
                //   type: 'SEND_OFFER',
                //   payload: {
                //     roomId,
                //     offer,
                //     userData,
                //   },
                // });
                await peerConnection.setLocalDescription(offer);
              }
            }}
          >
            Connect
          </Button>
        </div> */}

        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            router.push('/experimentals');
          }}
        >
          Exit
        </button>
      </div>

      <div className="absolute flex flex-col z-20 bottom-0 left-0 bg-[rgba(0,0,0,0.5)] w-[500px] w-max-[500px] h-[300px] h-max-[300px] overflow-auto">
        <ul className="flex flex-col grow">
          {messages.map((message, index) => {
            return (
              <li key={index}>{`${message?.userData?.userName}${message?.userData?.nameCode}: ${message.message}`}</li>
            );
          })}
        </ul>
        <input
          ref={inputRef}
          className={inputActive ? enableInput : disableInput}
          type="text"
          value={message}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setMessage('');
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </div>
    </>
  );
};

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
// export { ScreenUi_old as ScreenUi };
