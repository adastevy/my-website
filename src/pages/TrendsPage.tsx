import WeeklyTrendChart from '../components/Dashboard/WeeklyTrendChart';
import MonthlyTrendChart from '../components/Dashboard/MonthlyTrendChart';

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">学习趋势</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        追踪你的学习时长变化，保持持续进步
      </p>
      <WeeklyTrendChart />
      <MonthlyTrendChart />
    </div>
  );
}
