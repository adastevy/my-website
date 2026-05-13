import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

const BAR_COLORS = ['#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'];

export default function MonthlyTrendChart() {
  const { monthlyTrend } = useDashboard();

  if (!monthlyTrend || monthlyTrend.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        数据加载失败，请刷新重试
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">本月学习趋势</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyTrend}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="week" tick={{ fontSize: 13 }} className="text-gray-600 dark:text-gray-400" />
          <YAxis tick={{ fontSize: 13 }} className="text-gray-600 dark:text-gray-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tw-bg-opacity, 1)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
            {monthlyTrend.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
