'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo } from 'react';

import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { useSignalingChannel } from '../../hooks/useSignalingChannel';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useGetRoomInfoQuery } from '../../hooks/useGetRoomInfoQuery';
import { MinecraftContext } from '../providers';
import { ChatBox } from './ChatBox';

export const ScreenUi = () => {
  const { setReceiveChannel, setSendChannel, setUserData } = useContext(MinecraftContext);
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

  useEffect(() => {
    receiveChannel && setReceiveChannel(receiveChannel);
    sendChannel && setSendChannel(sendChannel);
  }, [sendChannel, receiveChannel, setReceiveChannel, setSendChannel]);

  useEffect(() => {
    userData && setUserData(userData);
  }, [userData, setUserData]);

  useEffect(() => {
    if (isHost) return;
    sendPcOffer();
  }, [isHost, sendPcOffer]);

  return (
    <div>
      <ChatBox />
    </div>
  );
};
