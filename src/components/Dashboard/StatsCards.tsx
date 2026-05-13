import { useDashboard } from '../../context/DashboardContext';

const CARD_CONFIG = [
  { key: 'todayHours' as const, label: '今日学习', unit: 'h', color: 'from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500' },
  { key: 'activeCourses' as const, label: '进行中课程', unit: '门', color: 'from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500' },
  { key: 'completionRate' as const, label: '完成率', unit: '%', color: 'from-green-500 to-green-600 dark:from-green-400 dark:to-green-500' },
  { key: 'streakDays' as const, label: '连续学习', unit: '天', color: 'from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500' },
];

function formatValue(key: string, value: number | null | undefined): string {
  if (value == null) return '--';
  if (key === 'todayHours') return value.toFixed(1);
  return String(value);
}

export default function StatsCards() {
  const { stats } = useDashboard();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map(({ key, label, unit, color }) => {
        const raw = stats[key];
        const display = formatValue(key, raw);
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
