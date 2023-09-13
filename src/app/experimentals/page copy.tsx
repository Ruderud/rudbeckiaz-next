'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { ButtonHTMLAttributes, DetailedHTMLProps, use, useCallback, useEffect, useMemo, useState } from 'react';
import { SignalingChannel } from './utils';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color: string;
};
const Button = (props: ButtonProps) => {
  const { color, children, ...rest } = props;

  return (
    <button className={`bg-${color}-500 hover:bg-${color}-700 rounded disabled:bg-gray-400 py-2 px-5`} {...rest}>
      {children}
    </button>
  );
};

type Guest = {
  name: string;
  desc?: {
    sdp: string;
    type: string;
  };
};

type Room = {
  roomId: string;
  roomName: string;
  host: {
    name: string;
    desc?: {
      sdp: string;
      type: string;
    };
  };
  guests: Guest[];
  isOpen: boolean;
};

export default function ExperimentalsPage() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const [roomOpen, setRoomOpen] = useState<boolean>(false);
  const [isPing, setIsPing] = useState<boolean>(false);
  const [signalingChannel, setSignalingChannel] = useState<SignalingChannel | null>(null);

  const handleChangeInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => setInput(e.target.value);

  const handleSendButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    sendChannel?.send(input);
    console.log('Sent Data: ', input);
  };

  function onCreateSessionDescriptionError(error: Error) {
    console.log('Failed to create session description: ' + error.toString());
  }

  useEffect(() => {
    setSignalingChannel(
      new SignalingChannel({
        signalingUrl: String(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/ws'),
        onMessage: (event: MessageEvent) => {
          console.log('onMessageReceived', event.data);
          const parsdData = JSON.parse(event.data);
          switch (parsdData.action) {
            case 'GET_ROOMS':
              setRooms(parsdData.rooms);
              break;
            case 'CREATE_ROOM':
              console.log(parsdData.message);
              break;
            case 'DELETE_ROOM':
              console.log(parsdData.message);
              break;
            case 'JOIN_ROOM':
              console.log('someone joined room', parsdData);
              break;
            case 'CONNECT_ABLE':
              if (!isPing) {
                setIsPing(true);
              }
              break;
            case 'CONNECT_UNABLE':
              if (isPing) {
                setIsPing(false);
              }
              break;
            case 'JOIN_ROOM_GET_HOST_OFFER':
              console.log('someone joined room', parsdData);
              const roomdata = parsdData.roomData as Room;
              if (roomdata.host.desc === undefined || !pc) return;
              pc.setRemoteDescription({
                sdp: roomdata.host.desc.sdp,
                type: roomdata.host.desc.type as RTCSessionDescriptionInit['type'],
              });
              pc.createAnswer().then((desc) => {
                console.log("add answer's local description", desc);
                pc.setLocalDescription(desc);
              }, onCreateSessionDescriptionError);
              break;
            default:
              console.log('unknown action', event.data.action);
              break;
          }
        },
      })
    );
    const pc = new RTCPeerConnection();
    pc.onicecandidate = (event) => {
      const { candidate } = event;
      console.log('candidate', candidate);
      if (!candidate) return;
      pc.addIceCandidate(candidate);
    };
    setPc(pc);
  }, [isPing]);

  return (
    <div id="container">
      <h1>
        <span>Transmit text</span>
      </h1>

      <div className="flex gap-5 p-5">
        <input
          type="text"
          className="text-black border-2 border-gray-500 rounded py-2 px-5"
          value={username}
          disabled={isFixed}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Button
          color="green"
          onClick={() => {
            setIsFixed((cur) => !cur);
          }}
        >
          {isFixed ? 'Change Username' : 'Fix Username'}
        </Button>
      </div>

      <ul className="p-5">
        {rooms.map((room) => {
          return (
            <li className="flex items-center gap-3" key={room.roomId}>
              <h3 className="text-md">{`RoomName:${room.roomName} | RoomHost:${room.host.name} | RoomId:${room.roomId} | RoomState:${room.isOpen}`}</h3>
              <Button
                color="blue"
                disabled={room.host.name === username}
                onClick={async () => {
                  if (signalingChannel?.webSocket?.readyState === 1 && pc !== null) {
                    const offerOptions = await pc.createOffer();
                    const guest: Guest = {
                      name: username,
                      desc: {
                        sdp: offerOptions.sdp || '',
                        type: offerOptions.type,
                      },
                    };
                    signalingChannel.send({
                      action: 'JOIN_ROOM',
                      roomId: room.roomId,
                      guest: guest,
                    });
                  }
                }}
              >
                Join
              </Button>
              <Button
                color="red"
                disabled={room.host.name !== username}
                onClick={() => {
                  if (signalingChannel?.webSocket?.readyState === 1) {
                    signalingChannel.send({
                      action: 'DELETE_ROOM',
                      roomId: room.roomId,
                      username,
                    });
                  }
                }}
              >
                Delete
              </Button>

              <Button
                color="green"
                disabled={room.host.name !== username}
                onClick={async () => {
                  if (signalingChannel?.webSocket?.readyState === 1 && pc !== null) {
                    const offerOptions = await pc.createOffer();
                    signalingChannel.send({
                      action: 'CONNECT_ABLE',
                      roomId: room.roomId,
                      username: username,
                      hostDesc: offerOptions,
                    });
                  }
                }}
              >
                Room open
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-5 p-5">
        <Button
          color="green"
          onClick={() => {
            if (signalingChannel?.webSocket?.readyState === 1) {
              signalingChannel.send({
                action: 'GET_ROOMS',
              });
            }
          }}
        >
          Get Rooms
        </Button>

        <Button
          color="green"
          onClick={() => {
            if (signalingChannel?.webSocket?.readyState === 1) {
              signalingChannel.send({
                action: 'CONNECT_UNABLE',
              });
            }
          }}
        >
          set Room Unconnectable
        </Button>

        <h3>{isPing ? 'now Pinging' : null}</h3>
      </div>

      <div className="flex gap-5 p-5">
        <button
          className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={username === '' || !isFixed || signalingChannel === null}
          onClick={() => {
            if (signalingChannel === null) return;
            console.log('signalingChannel.webSocket?.readyState', signalingChannel.webSocket?.readyState);
            signalingChannel.send({
              action: 'CREATE_ROOM',
              roomName: `${username}'s room`,
              username,
            });
          }}
        >
          CreateRoom
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={sendChannel?.readyState !== 'open'}
          onClick={handleSendButton}
        >
          {sendChannel?.readyState === 'connecting' ? 'Now Connecting' : 'Send'}
        </button>
      </div>

      <div className="flex gap-5 p-5">
        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={signalingChannel === null}
          onClick={() => {
            console.log(pc);
          }}
        >
          Check PeerConnection
        </button>
      </div>

      <div id="sendReceive">
        <div id="send">
          <h2>Send</h2>
          <textarea
            id="dataChannelSend"
            className="text-black"
            disabled={sendChannel?.readyState !== 'open'}
            placeholder="Press Start, enter some text, then press Send."
            value={input}
            onChange={handleChangeInput}
          />
        </div>
        <div id="receive">
          <h2>Receive</h2>
          {messages.map((message, i) => {
            return <p key={i}>{message}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
