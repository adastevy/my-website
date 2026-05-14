export const ROUTES = {
  login: '/login',
  register: '/register',
  overview: '/overview',
  recommendations: '/recommendations',
  trends: '/trends',
  goals: '/goals',
  chat: '/chat',
  profile: '/profile',
} as const;

export const NAV_ITEMS = [
  { label: '学习数据', path: ROUTES.overview },
  { label: 'AI 对话建议', path: ROUTES.chat },
  { label: '学习目标', path: ROUTES.goals },
] as const;
