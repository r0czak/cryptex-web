const requiredEnvVars = [
  'VITE_AUTH0_DOMAIN',
  'VITE_AUTH0_CLIENT_ID',
  'VITE_AUTH0_AUDIENCE',
  'VITE_SPRING_BASE_API',
]

export function validateEnv() {
  const missingVars = requiredEnvVars.filter((envVar) => !import.meta.env[envVar])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}
