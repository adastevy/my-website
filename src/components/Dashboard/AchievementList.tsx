import { useState, useEffect, useCallback } from 'react';
import { fetchAchievements, type AchievementItem } from '../../services/analytics';
import AchievementBadge from './AchievementBadge';

interface AchievementListProps {
  className?: string;
}

export default function AchievementList({ className = '' }: AchievementListProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAchievements();
      setAchievements(data.achievements);
    } catch {
      setError('成就加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">成就</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">成就</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">成就</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {unlockedCount}/{achievements.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {achievements.map((ach) => (
          <AchievementBadge key={ach.key} achievement={ach} />
        ))}
      </div>
    </div>
  );
}
