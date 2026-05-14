import StatsCards from '../components/Dashboard/StatsCards';
import LearningCalendar from '../components/Dashboard/LearningCalendar';
import AchievementList from '../components/Dashboard/AchievementList';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">学习数据</h2>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningCalendar />
        <AchievementList />
      </div>
    </div>
  );
}
