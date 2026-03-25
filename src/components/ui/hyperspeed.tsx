'use client';

import { useEffect, useRef } from 'react';

interface HyperspeedProps {
  className?: string;
  speed?: number;        // base speed multiplier (default 1)
  density?: number;      // number of streaks (default 150)
  color1?: string;       // primary streak colour
  color2?: string;       // secondary streak colour
}

export default function Hyperspeed({
  className = '',
  speed = 1,
  density = 160,
  color1 = '#7c3aed',
  color2 = '#ec4899',
}: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Parse hex to rgb
    const hexRgb = (hex: string) => {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return { r, g, b };
    };
    const c1 = hexRgb(color1);
    const c2 = hexRgb(color2);

    interface Star {
      x: number; y: number;
      z: number; pz: number;
      col: { r:number; g:number; b:number };
    }

    const stars: Star[] = Array.from({ length: density }, () => ({
      x:  (Math.random() - 0.5) * w * 3,
      y:  (Math.random() - 0.5) * h * 3,
      z:  Math.random() * w,
      pz: 0,
      col: Math.random() > 0.5 ? c1 : c2,
    }));

    let frame = 0;

    const draw = () => {
      frame++;
      // Fading trail
      ctx.fillStyle = 'rgba(5,5,18,0.25)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const spd = speed * (1 + frame * 0.0008); // accelerate slightly over time, cap it
      const effectiveSpeed = Math.min(spd, speed * 6);

      for (const star of stars) {
        star.pz = star.z;
        star.z -= effectiveSpeed * 4;

        if (star.z <= 0) {
          star.x  = (Math.random() - 0.5) * w * 3;
          star.y  = (Math.random() - 0.5) * h * 3;
          star.z  = w;
          star.pz = w;
          star.col = Math.random() > 0.5 ? c1 : c2;
        }

        // Project 3D → 2D
        const sx  = (star.x  / star.z)  * w + cx;
        const sy  = (star.y  / star.z)  * h + cy;
        const spx = (star.x  / star.pz) * w + cx;
        const spy = (star.y  / star.pz) * h + cy;

        const size = Math.max(0.5, (1 - star.z / w) * 3);
        const alpha = Math.min(1, (1 - star.z / w) * 1.5);

        // Draw streak
        const grad = ctx.createLinearGradient(spx, spy, sx, sy);
        grad.addColorStop(0, `rgba(${star.col.r},${star.col.g},${star.col.b},0)`);
        grad.addColorStop(1, `rgba(${star.col.r},${star.col.g},${star.col.b},${alpha})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = size;
        ctx.moveTo(spx, spy);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Bright dot at head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [speed, density, color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
