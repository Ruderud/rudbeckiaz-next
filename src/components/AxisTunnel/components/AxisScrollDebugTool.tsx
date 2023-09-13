'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface AxisScrollDebugToolProps {
  maxDepth: number;
  depth: number;
}

export const AxisScrollDebugTool = ({ maxDepth, depth }: AxisScrollDebugToolProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prevX, setPrevX] = useState<number>(0);
  const [prevY, setPrevY] = useState<number>(50);

  const clearDot = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.clearRect(prevX - 6, prevY - 6, 12, 12);
    },
    [prevX, prevY]
  );

  const drawDot = (context: CanvasRenderingContext2D, x: number, y: number) => {
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const currentDepth = (depth / maxDepth) * 400;

    clearDot(context);

    //선 세팅
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    const { width, height } = canvas;

    //중앙 선 그리기
    context.beginPath();
    context.moveTo(50, height / 2);
    context.lineTo(width - 50, height / 2);
    context.stroke();

    //양 끝선 그리기
    context.beginPath();
    context.moveTo(50, 10);
    context.lineTo(50, height - 10);
    context.stroke();

    context.beginPath();
    context.moveTo(width - 50, 10);
    context.lineTo(width - 50, height - 10);
    context.stroke();

    //점 찍기
    drawDot(context, currentDepth + 50, canvas.height / 2);
    setPrevX(currentDepth + 50);
    setPrevY(canvas.height / 2);
  }, [maxDepth, depth, clearDot]);

  return (
    <div className="absolute z-10 bg-white text-black p-2">
      <div className="flex gap-4 p-2">
        <div>perspective: {maxDepth}px</div>
        <div>current Depth: {depth}px</div>
      </div>
      <div className="flex justify-center align-center">
        <canvas className="border-2 border-black" ref={canvasRef} width={500} height={50} />
      </div>
    </div>
  );
};
