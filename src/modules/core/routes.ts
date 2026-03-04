export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  teams: '/teams'
} as const

export const publicRoutes = [routes.login, routes.signup]
