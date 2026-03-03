// src/middleware/auth.ts
import { publicRoutes, routes } from '~/modules/core/routes'

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) {
    return
  }

  const token = localStorage.getItem('token')
  const isPublic = publicRoutes.includes(to.path as (typeof publicRoutes)[number])

  if (!token && !isPublic) {
    return navigateTo(routes.login)
  }

  if (token && isPublic) {
    return navigateTo(routes.dashboard)
  }
})
