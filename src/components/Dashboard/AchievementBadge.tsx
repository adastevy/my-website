import type { ReactNode } from 'react';
import type { AchievementItem } from '../../services/analytics';

const ICON_SVGS: Record<string, ReactNode> = {
  'book-open': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  flame: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  trophy: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  star: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

interface AchievementBadgeProps {
  achievement: AchievementItem;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { name, description, icon, unlocked, progress, target, unlocked_at } = achievement;
  const percent = Math.min(Math.round((progress / target) * 100), 100);
  const IconSvg = ICON_SVGS[icon] ?? ICON_SVGS['star'];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
        unlocked
          ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
      }`}
    >
      <div
        className={`flex-shrink-0 mt-0.5 ${
          unlocked
            ? 'text-purple-600 dark:text-purple-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {IconSvg}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${unlocked ? 'text-purple-900 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300'}`}>
            {name}
          </span>
          {unlocked && (
            <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded-full">
              已解锁
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        {unlocked ? (
          unlocked_at && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formatDate(unlocked_at)}
            </p>
          )
        ) : (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{progress}/{target}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 dark:bg-purple-400 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
