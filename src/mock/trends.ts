export interface WeeklyTrend {
  day: string;
  hours: number;
}

export interface MonthlyTrend {
  week: string;
  hours: number;
}

export const mockWeeklyTrend: WeeklyTrend[] = [
  { day: '周一', hours: 1.5 },
  { day: '周二', hours: 3.0 },
  { day: '周三', hours: 2.0 },
  { day: '周四', hours: 4.5 },
  { day: '周五', hours: 3.0 },
  { day: '周六', hours: 2.5 },
  { day: '周日', hours: 1.0 },
];

export const mockMonthlyTrend: MonthlyTrend[] = [
  { week: '第1周', hours: 12 },
  { week: '第2周', hours: 18 },
  { week: '第3周', hours: 15 },
  { week: '第4周', hours: 20 },
];
