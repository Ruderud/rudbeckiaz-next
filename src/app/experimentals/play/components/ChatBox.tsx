import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MinecraftContext } from '../providers';
import { DataChannel, DataChannelMessage, Message, UserData } from '../../utils/types';

type inputMessage = {
  message: string;
};

type ChatBoxProps = {
  onSubmitMessage?: (message: string) => void;
};

type ViewMessage = Message & {
  userData: UserData;
};

export const ChatBox = ({ onSubmitMessage }: ChatBoxProps) => {
  const { sendChannel, receiveChannel, userData } = useContext(MinecraftContext);
  const [messages, setMessages] = useState<ViewMessage[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<inputMessage>();

  const onSubmit: SubmitHandler<inputMessage> = (data) => {
    if (!sendChannel || !userData) return;
    const message: DataChannelMessage<Message> = {
      type: 'MESSAGE',
      payload: {
        message: data.message,
        createdAt: new Date().toISOString(),
      },
      userData: userData,
    };
    sendChannel.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { ...message.payload, userData }]);
    reset();
  };

  useEffect(() => {
    if (receiveChannel) {
      receiveChannel.addEventListener('message', (event) => {
        const dataChannelMessage = JSON.parse(event.data) as DataChannelMessage<Message>;
        if (dataChannelMessage.type !== 'MESSAGE') return;
        setMessages((prev) => [...prev, { ...dataChannelMessage.payload, userData: dataChannelMessage.userData }]);
      });
    }
  }, [receiveChannel]);

  return (
    <div className="absolute z-[50] bottom-0 left-0 bg-[rgba(255, 0, 0, 0.5)] w-[500px] w-max-[500px] h-[300px] h-max-[300px] overflow-auto">
      <ul className="flex flex-col grow">
        {messages.map((message, index) => {
          return (
            <li key={index}>{`[${convertISOToLocalTimeToHHMMSS(message.createdAt)}]${message?.userData?.userName}${
              message?.userData?.nameCode
            }: ${message.message}`}</li>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('message', { required: true, minLength: 1, onBlur: () => console.log('onBlur') })}
          className="absolute z-[50] bottom-0 left-0 w-full text-black bg-[#ffffff]]"
          type="text"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

function convertISOToLocalTimeToHHMMSS(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date string');
    }

    const localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return localTime;
  } catch (error) {
    console.error('Error:', error);
    return 'Invalid Date';
  }
}
