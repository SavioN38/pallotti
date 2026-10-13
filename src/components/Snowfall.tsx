import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Flake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
}

export function Snowfall() {
  const { themeConfig, isChristmas } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isChristmas || !themeConfig.snowfall.enabled) return;

    // Respect user's accessibility preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    let width = (canvas.width = Math.min(window.innerWidth, 1920));
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = Math.min(window.innerWidth, 1920);
      height = canvas.height = canvas.parentElement?.clientHeight || 800;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 24 elegant, lightweight particles (0 main-thread or GPU drag)
    const count = 24;
    const flakes: Flake[] = [];

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        speed: (Math.random() * 0.45 + 0.25) * themeConfig.snowfall.speed,
        opacity: Math.random() * 0.5 + 0.25,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.01 + 0.005,
      });
    }

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Fast single-pass drawing with zero expensive shadowBlur
      for (let i = 0; i < count; i++) {
        const f = flakes[i];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        // Move
        f.y += f.speed;
        f.sway += f.swaySpeed;
        f.x += Math.sin(f.sway) * 0.35;

        // Wrap around
        if (f.y > height + 5) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        if (f.x > width + 5) f.x = -5;
        else if (f.x < -5) f.x = width + 5;
      }

      animId = requestAnimationFrame(render);
    };

    // Pause RAF animation loop completely when Hero is scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (nextVisible && !isVisible) {
          isVisible = true;
          animId = requestAnimationFrame(render);
        } else if (!nextVisible) {
          isVisible = false;
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [isChristmas, themeConfig.snowfall]);

  if (!isChristmas || !themeConfig.snowfall.enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full will-change-transform [transform:translateZ(0)]"
      aria-hidden="true"
    />
  );
}
