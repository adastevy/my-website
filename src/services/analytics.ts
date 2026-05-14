import { apiFetch } from './apiClient';

export interface OverviewData {
  today_hours: number;
  active_courses: number;
  completion_rate: number;
  streak_days: number;
  total_hours: number;
  total_sessions: number;
}

export interface CalendarDay {
  date: string;
  duration_minutes: number;
  level: number;
}

export interface CalendarData {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface AchievementItem {
  key: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlocked_at: string | null;
}

export interface AchievementsData {
  achievements: AchievementItem[];
}

export async function fetchOverview(): Promise<OverviewData> {
  const res = await apiFetch('/api/analytics/overview');
  if (!res.ok) {
    throw new Error(`Failed to fetch overview: ${res.status}`);
  }
  return res.json();
}

export async function fetchCalendar(year: number, month: number): Promise<CalendarData> {
  const res = await apiFetch(`/api/analytics/calendar?year=${year}&month=${month}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch calendar: ${res.status}`);
  }
  return res.json();
}

export async function fetchAchievements(): Promise<AchievementsData> {
  const res = await apiFetch('/api/analytics/achievements');
  if (!res.ok) {
    throw new Error(`Failed to fetch achievements: ${res.status}`);
  }
  return res.json();
}
