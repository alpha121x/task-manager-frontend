// src/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const token = localStorage.getItem('token')
    
    // If no token and trying to access protected routes
    if (!token && to.path !== '/login' && to.path !== '/signup') {
      return navigateTo('/login')
    }
    
    // If has token and trying to access login/signup
    if (token && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/dashboard')
    }
  }
})