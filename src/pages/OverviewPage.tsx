import StatsCards from '../components/Dashboard/StatsCards';
import DailyGoals from '../components/Dashboard/DailyGoals';
import WeeklyTrendChart from '../components/Dashboard/WeeklyTrendChart';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">学习总览</h2>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyGoals />
        <WeeklyTrendChart />
      </div>
    </div>
  );
}
