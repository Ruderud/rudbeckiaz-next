'use client';

import { CanvasHTMLAttributes, DetailedHTMLProps, useEffect, useRef } from 'react';

interface GridBoxProps {
  depth?: number;
  canvasProps?: DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
}

export const GridBox = ({ depth, canvasProps }: GridBoxProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // 캔버스 배경 채우기
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 격자 선 스타일 설정
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    const { width, height } = canvas;
    const widthGap = Math.floor(width / 10);
    const heightGap = Math.floor(height / 10);

    // 가로 선 그리기
    for (let x = widthGap; x <= width; x += widthGap) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, width);
      context.stroke();

      context.fillStyle = 'black';
      context.fillText(String(Math.floor(x / widthGap)), x - 5, 10);
    }

    // 세로 선 그리기
    for (let y = heightGap; y <= height; y += heightGap) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(height, y);
      context.stroke();

      context.fillStyle = 'black';
      context.fillText(String(Math.floor(y / heightGap)), 10, y + 5);
    }
  }, []);

  return <canvas ref={canvasRef} width={100} height={100} {...canvasProps} />;
};
