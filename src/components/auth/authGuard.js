import { permissionService } from '../../services/auth/permission.service'
import { authService } from '../../services/auth/auth.service'

export const authGuard = async (to, from, next) => {
  // Allow access to callback page
  if (to.path === '/callback') {
    next()
    return
  }

  // Redirect root to login
  if (to.path === '/') {
    next('/login')
    return
  }

  // Handle authenticated users trying to access login page
  if (to.path === '/login' && authService.getIsAuthenticated()) {
    try {
      const permissions = await permissionService.getPermissions()

      if (permissions.includes('write:admin_role')) {
        next('/admin-dashboard')
      } else if (permissions.includes('write:user_role')) {
        next('/user-dashboard')
      } else {
        next('/login')
      }
    } catch (error) {
      console.error('Auth guard error:', error)
      next('/login')
    }
    return
  }

  // Check authentication for protected routes
  if (to.meta.requiresAuth && !authService.getIsAuthenticated()) {
    next('/login')
    return
  }

  // Check permissions for protected routes
  if (to.meta.permissions) {
    try {
      const permissions = await permissionService.getPermissions()

      if (hasPermission(permissions, to.meta.permissions)) {
        next()
      } else {
        next('/login')
      }
    } catch (error) {
      console.error('Auth guard error:', error)
      next('/login')
    }
    return
  }

  // Allow access to login page when not authenticated
  if (to.path === '/login' && !authService.getIsAuthenticated()) {
    next()
    return
  }

  // For all other routes, redirect to login if not authenticated
  if (!authService.getIsAuthenticated()) {
    next('/login')
    return
  }

  // Allow access to all other routes for authenticated users
  next()
}

function hasPermission(permissions, requiredPermissions) {
  return requiredPermissions.some((permission) => permissions.includes(permission))
}
