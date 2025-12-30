
import React, { useEffect, useRef } from 'react';
import { MousePosition } from '../types';

interface BackgroundWavesProps {
  mousePosition: MousePosition;
}

const BackgroundWaves: React.FC<BackgroundWavesProps> = ({ mousePosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;

      const lines = 8;
      const mouseInfluence = 0.05;

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const yOffset = (canvas.height / (lines + 1)) * (i + 1);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const distortion = Math.sin(x * 0.002 + time + i) * 20;
          const mouseDistX = Math.abs(x - mousePosition.x);
          const mouseEffect = Math.max(0, 100 - mouseDistX) * mouseInfluence;
          
          const y = yOffset + distortion + (mousePosition.y - canvas.height/2) * 0.02 + mouseEffect;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      time += 0.005;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
    />
  );
};

export default BackgroundWaves;
