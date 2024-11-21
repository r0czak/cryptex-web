import { AUTH0_CONFIG } from '../../config/auth0.config'

export const authGuard = (to, from, next) => {
  // Get the Auth0 plugin instance from the Vue app
  const auth0 = window.auth0Instance

  if (to.meta.requiresAuth && !auth0.isAuthenticated.value) {
    next('/')
    return
  }

  if (to.meta.roles) {
    auth0
      .getAccessTokenSilently()
      .then((token) => {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userRoles = payload[AUTH0_CONFIG.authorizationParams.audience + '/roles'] || []

        if (to.meta.roles.some((role) => userRoles.includes(role))) {
          next()
        } else {
          next('/')
        }
      })
      .catch((error) => {
        console.error('Auth guard error:', error)
        next('/')
      })
  } else {
    next()
  }
}
