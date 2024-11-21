import { ref } from 'vue'
import { authService } from './auth.service'
import { eventBus } from '../eventBus.service'

class PermissionService {
  constructor() {
    this.permissions = ref([])
    eventBus.subscribe('tokenCleared', () => {
      this.clearPermissions()
    })
  }

  async getPermissions() {
    const token = await authService.getToken()
    const payload = JSON.parse(atob(token.split('.')[1]))
    this.permissions.value = payload.permissions || []
    return this.permissions.value
  }

  clearPermissions() {
    this.permissions.value = []
  }
}

export const permissionService = new PermissionService()
