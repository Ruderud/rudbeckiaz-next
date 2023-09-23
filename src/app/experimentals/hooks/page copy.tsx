'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { ButtonHTMLAttributes, DetailedHTMLProps, useCallback, useEffect, useState } from 'react';
import { SignalingChannel } from '../utils';

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

type Room = {
  roomId: string;
  roomName: string;
  host: string;
};

export default function ExperimentalsPage() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [localConnection, setLocalConnection] = useState<RTCPeerConnection | null>(null);
  const [remoteConnection, setRemoteConnection] = useState<RTCPeerConnection | null>(null);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const [signalingChannel, setSignalingChannel] = useState<SignalingChannel | null>(null);

  const onIceCandidate = useCallback(
    async (pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => {
      if (localConnection === null || remoteConnection === null) return;
      const { candidate } = event;
      console.log('candidate', candidate, pc === localConnection ? 'local' : 'remote');
      if (!candidate) return;
      try {
        const otherPc = pc === localConnection ? remoteConnection : localConnection;
        await otherPc.addIceCandidate(candidate);
        console.log('AddIceCandidate success.');
      } catch (error) {
        const prefixMessage = 'Failed to add Ice Candidate: ';
      }
    },
    [localConnection, remoteConnection]
  );

  const gotDescription1 = async (desc: RTCSessionDescriptionInit) => {
    console.log('desc1', desc);
    localConnection?.setLocalDescription(desc);
    console.log(`Offer from localConnection\n${desc.sdp}`);
    remoteConnection?.setRemoteDescription(desc);
    remoteConnection?.createAnswer().then(gotDescription2, onCreateSessionDescriptionError);
  };
  function onCreateSessionDescriptionError(error: Error) {
    console.log('Failed to create session description: ' + error.toString());
  }

  function gotDescription2(desc: RTCSessionDescriptionInit) {
    remoteConnection?.setLocalDescription(desc);
    console.log(`Answer from remoteConnection\n${desc.sdp}`, 'localConnection', localConnection);
    localConnection?.setRemoteDescription(desc);
  }

  const handleChangeInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => setInput(e.target.value);
  const handleCreateRoomButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (localConnection === null || remoteConnection === null) return;

    //create signaling channel
    const signalingChannel = createSignalingChannel();
    const sendChannel = localConnection.createDataChannel('sendDataChannel');

    localConnection.onicecandidate = (event) => onIceCandidate(localConnection, event);
    localConnection.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        console.log('receive data', e.data);
        setMessages((prev) => [...prev, e.data]);
      };
      setReceiveChannel(receiveChannel);
    };

    console.log('Created remote peer connection object remoteConnection');

    remoteConnection.onicecandidate = (event) => {
      onIceCandidate(remoteConnection, event);
    };
    remoteConnection.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage = (e) => {
        console.log('receive data', e.data);
        setMessages((prev) => [...prev, e.data]);
      };
      setReceiveChannel(receiveChannel);
    };

    createOffer(localConnection);

    setSignalingChannel(signalingChannel);
    setSendChannel(sendChannel);
  };

  const onConnectProgress = useCallback((event: RTCPeerConnectionIceEvent) => {}, []);

  const createOffer = async (pc: RTCPeerConnection) => {
    try {
      const offerOptions = await pc.createOffer();
      console.log(offerOptions);
      gotDescription1(offerOptions);
      return offerOptions;
    } catch (error) {
      const prefixMessage = 'Failed to create session description: ';
    }
  };

  const handleSendButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    sendChannel?.send(input);
    console.log('Sent Data: ', input);
  };

  const onMessageReceived = useCallback((event: MessageEvent) => {
    console.log('onMessageReceived', event.data);
    const parsdData = JSON.parse(event.data);
    switch (parsdData.action) {
      case 'GET_ROOMS':
        setRooms(parsdData.rooms);
        break;
      default:
        console.log('unknown action', event.data.action);
        break;
    }
  }, []);

  const createSignalingChannel = useCallback(() => {
    const baseUrl = String(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/ws');
    const channel = new SignalingChannel({
      signalingUrl: baseUrl,
      onMessage: onMessageReceived,
    });
    return channel;
  }, [onMessageReceived]);

  useEffect(() => {
    // setRemoteConnection(
    //   new RTCPeerConnection({
    //     iceServers: [
    //       { urls: 'stun:stun.l.google.com:19302' },
    //       { urls: 'stun:stun1.l.google.com:19302' },
    //       { urls: 'stun:stun2.l.google.com:19302' },
    //       { urls: 'stun:stun3.l.google.com:19302' },
    //       { urls: 'stun:stun4.l.google.com:19302' },
    //     ],
    //   })
    // );
    // setLocalConnection(
    //   new RTCPeerConnection({
    //     iceServers: [
    //       { urls: 'stun:stun.l.google.com:19302' },
    //       { urls: 'stun:stun1.l.google.com:19302' },
    //       { urls: 'stun:stun2.l.google.com:19302' },
    //       { urls: 'stun:stun3.l.google.com:19302' },
    //       { urls: 'stun:stun4.l.google.com:19302' },
    //     ],
    //   })
    // );
    const channel = createSignalingChannel();
    setSignalingChannel(channel);
  }, [createSignalingChannel]);

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
              <h3 className="text-lg">{`RoomName:${room.roomName} | RoomHost:${room.host}`}</h3>
              <Button color="blue" disabled={room.host === username} onClick={() => {}}>
                Join
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
      </div>

      <div className="flex gap-5 p-5">
        <button
          className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={signalingChannel !== null}
          onClick={() => {
            console.log('reconnect');
            const channel = createSignalingChannel();
            setSignalingChannel(channel);
          }}
        >
          Reconnect
        </button>

        <button
          className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={username === '' || !isFixed || signalingChannel === null}
          onClick={() => {
            if (signalingChannel === null) return;
            console.log('signalingChannel.webSocket?.readyState', signalingChannel.webSocket?.readyState);
            signalingChannel.send({
              action: 'CREATE_ROOM',
              roomName: `${username}'s room`,
              host: username,
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

        <button
          className="bg-orange-500 hover:bg-orange-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={sendChannel?.readyState !== 'open'}
          onClick={async () => {
            if (localConnection === null) return;
            const offerOptions = await localConnection.createOffer();
            console.log(offerOptions);
            if (signalingChannel) {
              signalingChannel.send(JSON.stringify({ offerOptions }));
            }
          }}
        >
          createOfferData
        </button>

        <button
          className="bg-orange-500 hover:bg-orange-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={sendChannel?.readyState !== 'open'}
          onClick={async () => {
            navigator.clipboard.writeText(JSON.stringify(localConnection?.localDescription?.sdp));
          }}
        >
          copyOfferData
        </button>
      </div>

      <div className="flex gap-5 p-5">
        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={signalingChannel === null}
          onClick={() => {
            console.log(signalingChannel);
          }}
        >
          Check Socket State
        </button>

        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={signalingChannel === null}
          onClick={() => {
            signalingChannel?.close();
            setSignalingChannel(null);
          }}
        >
          Socket Close
        </button>

        {/* <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          disabled={signalingChannel !== null}
          onClick={() => {
            if (signalingChannel) return;
            const baseUrl = String(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/ws');
            const channel = new SignalingChannel({
              signalingUrl: baseUrl,
              onMessage,
            });
            setSignalingChannel(channel);
          }}
        >
          socket Connect
        </button>

        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          onClick={() => {
            signalingChannel?.send({ type: 'createRoom' });
          }}
        >
          send
        </button>

        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          onClick={() => {
            signalingChannel?.close();
          }}
        >
          close socket
        </button>
        <button
          className="bg-amber-500 hover:bg-amber-700 disabled:bg-gray-400 rounded py-2 px-5"
          onClick={() => {
            setSignalingChannel(null);
          }}
        >
          Erase socket
        </button> */}
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
