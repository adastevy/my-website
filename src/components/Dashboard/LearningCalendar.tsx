import { useState, useEffect, useCallback } from 'react';
import { fetchCalendar, type CalendarDay } from '../../services/analytics';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

const DAY_LABELS: Record<number, string> = {
  0: '无学习记录',
  1: '1-30 分钟',
  2: '31-60 分钟',
  3: '1-2 小时',
  4: '2 小时以上',
};

function getLevelClass(level: number): string {
  const map: Record<number, string> = {
    0: 'fill-gray-200 dark:fill-gray-700',
    1: 'fill-green-300 dark:fill-green-800',
    2: 'fill-green-400 dark:fill-green-600',
    3: 'fill-green-500 dark:fill-green-500',
    4: 'fill-green-600 dark:fill-green-300',
  };
  return map[level] ?? map[0];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日 周${WEEKDAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]}`;
}

interface TooltipInfo {
  x: number;
  y: number;
  date: string;
  minutes: number;
  level: number;
}

interface LearningCalendarProps {
  className?: string;
}

export default function LearningCalendar({ className = '' }: LearningCalendarProps) {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const data = await fetchCalendar(now.getFullYear(), now.getMonth() + 1);
      setDays(data.days);
    } catch {
      setError('数据加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">学习日历</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-[124px] bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">学习日历</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const totalWidth = 12 * (CELL_SIZE + CELL_GAP);
  const totalHeight = 7 * (CELL_SIZE + CELL_GAP);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">学习日历</h3>

      <div className="relative overflow-x-auto">
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="block"
          role="img"
          aria-label="学习日历热力图"
        >
          {days.map((day, i) => {
            const col = Math.floor(i / 7);
            const row = i % 7;
            const x = col * (CELL_SIZE + CELL_GAP);
            const y = row * (CELL_SIZE + CELL_GAP);

            return (
              <rect
                key={day.date}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                className={`${getLevelClass(day.level)} cursor-pointer transition-opacity hover:opacity-80`}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGRectElement).getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 8,
                    date: day.date,
                    minutes: day.duration_minutes,
                    level: day.level,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>少</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <div
            key={lvl}
            className={`w-3 h-3 rounded-sm ${getLevelClass(lvl).replace('fill-', 'bg-').replace('dark:fill-', 'dark:bg-')}`}
          />
        ))}
        <span>多</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <div>{formatDate(tooltip.date)}</div>
          <div>{tooltip.level === 0 ? '无学习记录' : `学习 ${tooltip.minutes} 分钟 — ${DAY_LABELS[tooltip.level]}`}</div>
        </div>
      )}
    </div>
  );
}
