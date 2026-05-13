import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { mockStats, type StatsData } from '../mock/stats';
import { mockGoals, type Goal } from '../mock/goals';
import { mockRecommendations, type Recommendation } from '../mock/recommendations';
import { mockWeeklyTrend, mockMonthlyTrend, type WeeklyTrend, type MonthlyTrend } from '../mock/trends';

interface DashboardData {
  stats: StatsData;
  goals: Goal[];
  recommendations: Recommendation[];
  weeklyTrend: WeeklyTrend[];
  monthlyTrend: MonthlyTrend[];
}

interface DashboardActions {
  toggleGoal: (id: string) => void;
}

type DashboardContextType = DashboardData & DashboardActions;

function createDefaultData(): DashboardData {
  return {
    stats: mockStats,
    goals: mockGoals.map(g => ({ ...g })),
    recommendations: mockRecommendations,
    weeklyTrend: mockWeeklyTrend,
    monthlyTrend: mockMonthlyTrend,
  };
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(createDefaultData);

  const toggleGoal = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  }, []);

  const value: DashboardContextType = {
    ...data,
    toggleGoal,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return ctx;
}
