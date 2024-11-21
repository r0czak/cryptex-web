import { createApp } from 'vue'
import './assets/css/main.css'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'
import router from './router'
import { AUTH0_CONFIG } from './config/auth0.config'

const auth0Instance = createAuth0({
  domain: AUTH0_CONFIG.domain,
  clientId: AUTH0_CONFIG.clientId,
  authorizationParams: AUTH0_CONFIG.authorizationParams,
})

// Make auth0 instance globally available
window.auth0Instance = auth0Instance

const app = createApp(App)
app.use(auth0Instance)
app.use(router)
app.mount('#app')
