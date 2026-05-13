type HeroContentProps = {
  theme: 'light' | 'dark';
};

export default function HeroContent({ theme: _theme }: HeroContentProps) {
  const handleCTA = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
        张三
      </h1>
      <p className="mt-4 text-lg sm:text-xl md:text-2xl text-purple-600 dark:text-purple-400 font-medium">
        全栈开发工程师
      </p>
      <p className="mt-3 max-w-lg text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
        热爱构建优雅、高性能的 Web 体验，专注于 React 和 TypeScript 技术栈。
      </p>
      <button
        type="button"
        onClick={handleCTA}
        className="pointer-events-auto mt-8 px-6 py-3 text-sm sm:text-base font-medium rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        查看我的项目
      </button>
    </div>
  );
}
