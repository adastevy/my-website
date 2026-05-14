import { useState, useEffect, useCallback } from 'react';
import { fetchOverview, type OverviewData } from '../../services/analytics';

const CARD_CONFIG = [
  { key: 'today_hours' as const, label: '今日学习', unit: 'h', color: 'from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500' },
  { key: 'active_courses' as const, label: '进行中课程', unit: '门', color: 'from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500' },
  { key: 'completion_rate' as const, label: '完成率', unit: '%', color: 'from-green-500 to-green-600 dark:from-green-400 dark:to-green-500' },
  { key: 'streak_days' as const, label: '连续学习', unit: '天', color: 'from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500' },
];

function formatValue(key: string, value: number | null | undefined): string {
  if (value == null) return '--';
  if (key === 'today_hours') return value.toFixed(1);
  return String(value);
}

export default function StatsCards() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const overview = await fetchOverview();
      setData(overview);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARD_CONFIG.map(({ key }) => (
          <div
            key={key}
            className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 animate-pulse"
          >
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-t-xl -mx-5 -mt-5 mb-4" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map(({ key, label, unit, color }) => {
        const raw = data?.[key] ?? null;
        const display = error ? '--' : formatValue(key, raw);
        return (
          <div
            key={key}
            className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
            <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {display}
              {display !== '--' && (
                <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
