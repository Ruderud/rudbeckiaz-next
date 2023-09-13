'use client';

import { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from 'react';

interface AxisScrollProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setMaxDepth: (maxDepth: number) => void;
  sectionCount: number;
}

export const AxisScroll = (props: AxisScrollProps) => {
  const { setMaxDepth, sectionCount, ...divProps } = props;
  const scrollLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollLayerRef.current) return;
    setMaxDepth(scrollLayerRef.current.getBoundingClientRect().height * (scrollLayerRef.current.children.length - 1));
  }, [setMaxDepth]);

  return (
    <div
      ref={scrollLayerRef}
      id="scroll-layer"
      className="relative h-screen overflow-scroll snap-y snap-mandatory" //scrollbar-hide
      {...divProps}
    >
      {Array.from({ length: sectionCount + 1 }, (_, index) => {
        return <div className="h-screen bg-blue-100 opacity-20 overflow-hidden snap-start snap-always" key={index} />;
      })}
    </div>
  );
};
