export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard'
} as const

export const publicRoutes = [routes.login, routes.signup]
