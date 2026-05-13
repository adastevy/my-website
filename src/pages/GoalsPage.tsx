import DailyGoals from '../components/Dashboard/DailyGoals';
import { useDashboard } from '../context/DashboardContext';

export default function GoalsPage() {
  const { goals } = useDashboard();
  const completed = goals.filter((g) => g.completed).length;
  const total = goals.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">每日目标</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{total}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">总目标</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completed}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">已完成</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pct}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">完成率</div>
        </div>
      </div>

      <DailyGoals />
    </div>
  );
}
