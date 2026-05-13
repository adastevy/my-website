export interface StatsData {
  todayHours: number;
  activeCourses: number;
  completionRate: number;
  streakDays: number;
}

export const mockStats: StatsData = {
  todayHours: 2.5,
  activeCourses: 12,
  completionRate: 78,
  streakDays: 7,
};
