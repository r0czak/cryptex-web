export const AUTH_BE_CONFIG = {
  baseURL: import.meta.env.VITE_SPRING_BASE_API,
  endpoints: {
    signin: import.meta.env.VITE_SPRING_BASE_API + '/api/v1/auth/signin',
  },
}
