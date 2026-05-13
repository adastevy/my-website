import ParticleCanvas from './ParticleCanvas';
import HeroContent from './HeroContent';

type HeroProps = {
  theme: 'light' | 'dark';
};

export default function Hero({ theme }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden h-screen-dvh">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950" />

      <ParticleCanvas theme={theme} />

      <div className="absolute inset-0 flex items-center justify-center">
        <HeroContent theme={theme} />
      </div>
    </section>
  );
}
