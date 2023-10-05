'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Providers from '../../providers';
import { Message, UserData } from '../../utils/types';
import { UserSection } from '../../components/UserSection';
import { WebRTC } from './WebRTC';

// TODO: 현재 input내용작성후 엔터로 보내는것까지는 잘됨. 근데 보내고 바로 input창이 사라지는게 아니라 한번더 엔터를 눌러야 사라짐. 가끔은 그냥 엔터 눌러서 보내면 바로 사라질때도 있음...
export const ScreenUi = () => {
  //   const { setIsInputActive, signalingChannel } = useContext(MinecraftContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room');
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [inputActive, setInputActive] = useState<boolean>(false);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [message, setMessage] = useState<string>('');

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

  useEffect(() => {
    console.log('inputActive', inputActive);
  }, [inputActive]);

  const enableChatBox =
    'absolute flex flex-col z-20 bottom-0 left-0 bg-[rgba(0,0,0,0.5)] w-[500px] w-max-[500px] h-[300px] h-max-[300px] overflow-auto';
  const disableChatBox =
    'absolute flex flex-col z-20 bottom-0 left-0 w-[500px] w-max-[500px] h-[300px] h-max-[300px] overflow-auto';

  const enableInput = 'bottom-0 w-full text-black';
  const disableInput = 'hidden';

  return (
    <Providers>
      <div className="absolute z-20 top-20 left-5">
        <p>{`RoomId: ${roomId === null ? 'soloPlay' : roomId}`}</p>
        <Suspense fallback={<div>Loading...</div>}>
          <UserSection />
        </Suspense>
        <WebRTC setSendChannel={setSendChannel} setMessages={setMessages} />
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            router.push('/experimentals');
          }}
        >
          Exit
        </button>
      </div>

      <div className={inputActive ? enableChatBox : disableChatBox}>
        <ul className="flex flex-col grow">
          {messages.map((message, index) => {
            return (
              <li key={index}>{`${message.userData.userName}${message.userData.nameCode}: ${message.message}`}</li>
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
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </div>
    </Providers>
  );
};
