import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

export default function ProfileCard() {
  const { user } = useAuth();
  const { stats, goals } = useDashboard();

  if (!user) return null;

  const totalCompletedGoals = goals.filter((g) => g.completed).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 max-w-md mx-auto">
      {/* Avatar and name */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 border-2 border-purple-200 dark:border-purple-700">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
          <span className="inline-block mt-1 px-2.5 py-0.5 text-sm font-semibold rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            Lv.{user.level}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.streak_days}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">连续学习</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.streakDays}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">累计天数</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCompletedGoals}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">完成目标</p>
        </div>
      </div>
    </div>
  );
}
