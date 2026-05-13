import { useRef } from 'react';
import { useParticles } from '../../hooks/useParticles';

type ParticleCanvasProps = {
  theme: 'light' | 'dark';
};

export default function ParticleCanvas({ theme }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticles(canvasRef, theme);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
