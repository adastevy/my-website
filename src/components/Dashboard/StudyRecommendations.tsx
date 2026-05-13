import { useDashboard } from '../../context/DashboardContext';
import type { Priority } from '../../mock/recommendations';

const PRIORITY_STYLES: Record<Priority, { badge: string; text: string }> = {
  high: { badge: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  medium: { badge: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  low: { badge: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

export default function StudyRecommendations() {
  const { recommendations } = useDashboard();

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        暂无学习建议，请稍后再来
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => {
        const style = PRIORITY_STYLES[rec.priority];
        return (
          <div
            key={rec.id}
            className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {rec.title}
                </h4>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {rec.tag}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    预计 {rec.estimatedHours}h
                  </span>
                </div>
              </div>
              <span className={`shrink-0 inline-block px-2 py-0.5 text-xs rounded-full font-medium ${style.badge} ${style.text}`}>
                {PRIORITY_LABEL[rec.priority]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
