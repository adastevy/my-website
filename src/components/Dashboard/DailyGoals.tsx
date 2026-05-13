import { useDashboard } from '../../context/DashboardContext';

export default function DailyGoals() {
  const { goals, toggleGoal } = useDashboard();

  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (total === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        今日暂无目标，去添加一个吧
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">每日目标</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          已完成 {completed}/{total}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-5">
        <div
          className="h-full bg-purple-500 dark:bg-purple-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {goals.map((goal) => (
          <li key={goal.id}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-800"
              />
              <span
                className={`text-sm transition-colors ${
                  goal.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}
              >
                {goal.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
