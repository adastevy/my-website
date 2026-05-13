import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  phase: number;
}

type Theme = 'light' | 'dark';

const PARTICLE_DENSITY_MOBILE = 80;
const PARTICLE_DENSITY_DESKTOP = 150;
const CONNECTION_DISTANCE = 120;
const MOBILE_BREAKPOINT = 768;

function getParticleCount(width: number): number {
  if (width < MOBILE_BREAKPOINT) return PARTICLE_DENSITY_MOBILE;
  return Math.min(
    PARTICLE_DENSITY_DESKTOP,
    Math.floor(PARTICLE_DENSITY_DESKTOP * (width / 1440))
  );
}

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2,
    speedX: (Math.random() - 0.5) * 0.8,
    speedY: -(0.2 + Math.random() * 0.8),
    opacity: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, theme: Theme) {
  const rAFRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const themeRef = useRef<Theme>(theme);
  const pausedRef = useRef(false);
  const cssSizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);

  themeRef.current = theme;

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const isDark = themeRef.current === 'dark';
    const particleColor = isDark ? '255, 255, 255' : '30, 41, 59';
    const lineRgb = isDark ? '147, 197, 253' : '107, 114, 128';

    const particles = particlesRef.current;
    const distSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    const { w, h } = cssSizeRef.current;

    const elapsed = timeRef.current ? (now - timeRef.current) / 16.67 : 1;
    timeRef.current = now;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!pausedRef.current) {
        const wobX = Math.sin(now * 0.001 + p.phase) * 0.4;
        const wobY = Math.cos(now * 0.0013 + p.phase) * 0.4;

        p.x += (p.speedX + wobX) * elapsed;
        p.y += (p.speedY + wobY) * elapsed;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < distSq) {
          const alpha = (1 - d2 / distSq) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lineRgb}, ${Math.max(0.02, alpha)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      cssSizeRef.current = { w: width, h: height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(getParticleCount(width), width, height);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    resize();
    window.addEventListener('resize', debouncedResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const animate = (now: number) => {
      draw(now);
      rAFRef.current = requestAnimationFrame(animate);
    };

    let startDelayTimer: ReturnType<typeof setTimeout>;

    if (prefersReducedMotion.matches) {
      pausedRef.current = true;
      draw(0);
    } else {
      pausedRef.current = false;
      startDelayTimer = setTimeout(() => {
        rAFRef.current = requestAnimationFrame(animate);
      }, 100);
    }

    let io: IntersectionObserver | null = null;
    let ioReady = false;
    const parent = canvas.parentElement;
    if (parent) {
      io = new IntersectionObserver(
        (entries) => {
          if (!ioReady) return;
          const visible = entries[0].isIntersecting;
          if (visible && !prefersReducedMotion.matches) {
            pausedRef.current = false;
            if (!rAFRef.current) {
              rAFRef.current = requestAnimationFrame(animate);
            }
          } else if (!visible) {
            pausedRef.current = true;
            if (rAFRef.current) {
              cancelAnimationFrame(rAFRef.current);
              rAFRef.current = 0;
            }
          }
        },
        { threshold: 0 }
      );
      io.observe(parent);
      requestAnimationFrame(() => { ioReady = true; });
    }

    return () => {
      clearTimeout(startDelayTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      io?.disconnect();
    };
  }, [canvasRef, draw]);

  return null;
}
