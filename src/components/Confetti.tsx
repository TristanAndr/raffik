import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  angle: number;
  spin: number;
  gravity: number;
  alpha: number;
  shape: 'rect' | 'circle';
}

interface ConfettiProps {
  active: boolean;
  /** Palette: 'green' (default) | 'amber' */
  palette?: 'green' | 'amber';
  duration?: number; // ms, default 2800
}

const GREEN_PALETTE  = ['#22c55e', '#4ade80', '#86efac', '#16a34a', '#f0fdf4', '#ffffff', '#bbf7d0'];
const AMBER_PALETTE  = ['#f59e0b', '#fbbf24', '#fde68a', '#22c55e', '#ffffff', '#4ade80', '#d97706'];

export default function Confetti({ active, palette = 'green', duration = 2800 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full viewport
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = palette === 'amber' ? AMBER_PALETTE : GREEN_PALETTE;

    // Spawn burst of particles from center-top
    particles.current = Array.from({ length: 130 }, () => ({
      x:       canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
      y:       -10,
      vx:      (Math.random() - 0.5) * 9,
      vy:      Math.random() * 5 + 3,
      color:   colors[Math.floor(Math.random() * colors.length)],
      size:    Math.random() * 9 + 5,
      angle:   Math.random() * Math.PI * 2,
      spin:    (Math.random() - 0.5) * 0.25,
      gravity: 0.15 + Math.random() * 0.1,
      alpha:   1,
      shape:   Math.random() > 0.4 ? 'rect' : 'circle',
    }));

    const startTime = Date.now();

    const tick = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;
      const fadeStart = duration * 0.65;

      particles.current.forEach((p) => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += p.gravity;
        p.vx    *= 0.99;
        p.angle += p.spin;

        if (elapsed > fadeStart) {
          p.alpha = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });

      if (elapsed < duration) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, palette, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}
