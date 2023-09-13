'use client';

import { MouseEventHandler, UIEventHandler, useEffect, useState } from 'react';
import { AxisScroll, AxisScrollDebugTool, AxisView } from './components';

const SECTION_COUNT = 7;

export const AxisTunnel = () => {
  const [depth, setDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(0);

  useEffect(() => {
    // chrome react devTool => canvas element로 인한 html의 스크롤을 막음
    const htmlElement = document.querySelector('html');
    htmlElement?.style.setProperty('overflow', 'hidden');
    return () => {
      htmlElement?.style.setProperty('overflow', 'unset');
    };
  }, []);

  const setCurrentDepth: UIEventHandler<HTMLDivElement> = (event) => {
    setDepth(event.currentTarget.scrollTop);
  };
  const excuteViewLayerClickEventByPosition: MouseEventHandler<HTMLDivElement> = (event) => {
    const { pageX: x, pageY: y } = event;
    const elements = document.elementsFromPoint(x, y);

    // id가 "view-layer"인 버튼 요소들을 필터링하여 buttonsInViewLayer에 추가
    elements.forEach(function (element) {
      if (element.tagName === 'A') {
        console.log(element);
        const button = element as HTMLAnchorElement;
        button.click();
      }
    });
  };

  return (
    <div className="relative">
      <AxisScrollDebugTool maxDepth={maxDepth} depth={depth} />
      <AxisScroll
        onScroll={setCurrentDepth}
        onClick={excuteViewLayerClickEventByPosition}
        setMaxDepth={setMaxDepth}
        sectionCount={SECTION_COUNT}
      />
      <AxisView maxDepth={maxDepth} depth={depth} />
    </div>
  );
};
