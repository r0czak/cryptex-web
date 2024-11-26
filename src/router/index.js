import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '../components/auth/authGuard'

const routes = [
  {
    path: '/',
    name: 'Root',
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../views/LoginPage.vue'),
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/CallBackPage.vue'),
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['write:admin_role'],
    },
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: () => import('../views/user/UserDashboard.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['write:user_role'],
    },
  },
  {
    path: '/crypto-wallets',
    name: 'CryptoWallets',
    component: () => import('../views/WalletPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/trades',
    name: 'Trades',
    component: () => import('../views/WalletPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/WalletPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/WalletPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['write:admin_role'],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  authGuard(to, from, next)
})

export default router
