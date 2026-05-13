export const ROUTES = {
  overview: '/overview',
  recommendations: '/recommendations',
  trends: '/trends',
  goals: '/goals',
} as const;

export const NAV_ITEMS = [
  { label: '总览', path: ROUTES.overview },
  { label: 'AI推荐', path: ROUTES.recommendations },
  { label: '趋势', path: ROUTES.trends },
  { label: '目标', path: ROUTES.goals },
] as const;
