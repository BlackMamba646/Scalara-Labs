'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    const fontSize = 13;
    const columns = Math.floor(w / fontSize);
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]<>/=;:.()';

    if (!(canvas as any)._drops || (canvas as any)._drops.length !== columns) {
      (canvas as any)._drops = Array.from({ length: columns }, () =>
        Math.random() * -50,
      );
    }
    const drops: number[] = (canvas as any)._drops;

    ctx.fillStyle = 'rgba(12, 27, 59, 0.12)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const brightness = Math.random();
      if (brightness > 0.9) {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.9)';
      } else if (brightness > 0.6) {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.5)';
      } else {
        ctx.fillStyle = 'rgba(33, 138, 243, 0.25)';
      }

      ctx.fillText(char, x, y);

      if (y > h && Math.random() > 0.985) {
        drops[i] = 0;
      }
      drops[i] += 0.05 + Math.random() * 0.05;
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
        borderRadius: 'inherit',
      }}
    />
  );
}
