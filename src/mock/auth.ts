// User type aligned with backend GET /api/users/me response
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  streak_days: number;
  level: number;
  created_at: string;
}
