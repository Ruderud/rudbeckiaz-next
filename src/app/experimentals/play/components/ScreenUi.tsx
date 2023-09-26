'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { KeyboardEventHandler, Suspense, useContext, useEffect, useRef, useState } from 'react';
import Providers, { MinecraftContext } from '../../providers';
import { Message, UserData } from '../../utils/types';
import { Button } from '@/components/Ui/Button';
import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { UserSection } from '../../components/UserSection';
import { WebRTC } from './WebRTC';

export const ScreenUi = () => {
  //   const { setIsInputActive, signalingChannel } = useContext(MinecraftContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room');
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputActive, setInputActive] = useState<boolean>(false);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    const body = document.querySelector('body');
    function toggleChatBoxOpen(this: HTMLBodyElement, event: KeyboardEvent) {
      if (event.code === 'Enter') {
        setInputActive((cur) => {
          if (cur) {
            body?.removeAttribute('playerActive');
            inputRef.current?.blur();
            // setIsInputActive(false);
            return false;
          } else {
            body?.setAttribute('playerActive', 'true');
            inputRef.current?.focus();
            // setIsInputActive(true);
            return true;
          }
        });
      }
    }
    body?.addEventListener('keydown', toggleChatBoxOpen);

    return () => {
      body?.removeEventListener('keydown', toggleChatBoxOpen);
    };
  }, []);

  return (
    <Providers>
      <div className="absolute z-20 top-20 left-5">
        <p>{`RoomId: ${roomId === null ? 'soloPlay' : roomId}`}</p>
        <Suspense fallback={<div>Loading...</div>}>
          <UserSection dispatchUserData={setUserData} />
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

      <div
        className={`absolute flex flex-col z-20 bottom-0 left-0 bg-[rgba(0,0,0,${
          inputActive ? '0.5' : '0'
        })] w-[500px] h-[300px]`}
      >
        <ul className="flex flex-col grow">
          {messages.map((message, index) => {
            return (
              <li key={index}>{`${message.userData.userName}${message.userData.nameCode}: ${message.message}`}</li>
            );
          })}
        </ul>
        {inputActive && (
          <>
            <input
              ref={inputRef}
              type="text"
              className="bottom-0 w-full text-black"
              autoFocus
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.code === 'Enter') {
                  console.log('enter!');
                  sendChannel?.send(
                    JSON.stringify({
                      userData,
                      message: inputRef.current?.value,
                    })
                  );
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                sendChannel?.send(
                  JSON.stringify({
                    userData,
                    message: inputRef.current?.value,
                  })
                );
              }}
            >
              send
            </button>
          </>
        )}
      </div>
    </Providers>
  );
};
