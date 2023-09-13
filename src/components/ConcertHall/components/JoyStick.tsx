import { useEffect, useRef, useState } from 'react';
import { JoystickManager, EventData, JoystickOutputData } from 'nipplejs';

type JoyStickProps = {
  onMove: (joyStickHandler: JoystickManager) => (evt: EventData, data: JoystickOutputData) => void;
};

export const JoyStick = ({ onMove }: JoyStickProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [joyStickHandler, setJoyStickHandler] = useState<JoystickManager | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const nipplejs = require('nipplejs'); // ERROR: 상단에서 최소에 모듈 import시, window is not defined 에러 발생.
    const joyStickHandler: JoystickManager = nipplejs.create({
      zone: ref.current,
      multitouch: true,
      maxNumberOfNipples: 2,
      mode: 'static',
      restJoystick: true,
      shape: 'circle',
      position: { bottom: '12vw', left: '12vw' },
      dynamicPage: true,
    });
    setJoyStickHandler(joyStickHandler);
  }, []);

  useEffect(() => {
    if (!joyStickHandler) return;
    joyStickHandler.on('move', onMove(joyStickHandler));
  }, [onMove, joyStickHandler]);

  return <div ref={ref} />;
};
