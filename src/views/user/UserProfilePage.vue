<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">User Profile</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Basic Information Card -->
      <div class="card bg-base-200">
        <div class="card-body">
          <h2 class="card-title">Basic Information</h2>
          <div class="space-y-4">
            <div>
              <label class="label">Name</label>
              <p class="font-medium">{{ user?.name }}</p>
            </div>
            <div>
              <label class="label">Email</label>
              <p class="font-medium">{{ user?.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- API Key Management Card -->
      <div class="card bg-base-200">
        <div class="card-body">
          <h2 class="card-title">API Key Management</h2>

          <!-- No API Key State -->
          <div v-if="!apiKey" class="space-y-4">
            <p class="text-sm opacity-80">
              Generate an API key to access our API endpoints programmatically.
            </p>
            <button class="btn btn-primary" @click="showGenerateKeyModal = true">
              Generate API Key
            </button>
          </div>

          <!-- Existing API Key State -->
          <div v-else class="space-y-4">
            <div>
              <label class="label">API Key</label>
              <div class="flex gap-2">
                <input
                  type="text"
                  :value="apiKey"
                  readonly
                  class="input input-bordered w-full font-mono text-sm"
                />
                <button
                  class="btn btn-square btn-ghost"
                  @click="copyApiKey"
                  :class="{ 'btn-success': copied }"
                >
                  <ClipboardIcon v-if="!copied" class="w-5 h-5" />
                  <CheckIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label class="label">Description</label>
              <p class="text-sm">{{ apiKeyDescription }}</p>
            </div>
            <div>
              <label class="label">Expires</label>
              <p class="text-sm">{{ formatDate(apiKeyExpiration) }}</p>
            </div>
            <button class="btn btn-error btn-outline" @click="showRevokeKeyModal = true">
              Revoke API Key
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate API Key Modal -->
    <dialog class="modal" :class="{ 'modal-open': showGenerateKeyModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Generate API Key</h3>
        <form @submit.prevent="generateApiKey" class="space-y-4">
          <div class="form-control">
            <label class="label">Description</label>
            <input
              v-model="newKeyDescription"
              type="text"
              class="input input-bordered"
              placeholder="e.g., Development key"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">Expiration Date</label>
            <Datepicker
              v-model="newKeyExpiration"
              :min-date="new Date(minDate)"
              :max-date="new Date(maxDate)"
              :dark="true"
              text-input
              required
              :teleport="true"
              :teleport-center="true"
            >
              <template #preset-date-range-button="{ label, value, presetDate }">
                <span
                  role="button"
                  :tabindex="0"
                  @click="presetDate(value)"
                  @keyup.enter.prevent="presetDate(value)"
                  @keyup.space.prevent="presetDate(value)"
                >
                  {{ label }}
                </span>
              </template>
            </Datepicker>
          </div>
          <div class="modal-action">
            <button type="button" class="btn" @click="showGenerateKeyModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary">Generate</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Revoke API Key Modal -->
    <dialog class="modal" :class="{ 'modal-open': showRevokeKeyModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Revoke API Key</h3>
        <p>Are you sure you want to revoke this API key? This action cannot be undone.</p>
        <div class="modal-action">
          <button class="btn" @click="showRevokeKeyModal = false">Cancel</button>
          <button class="btn btn-error" @click="revokeApiKey">Revoke</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { ClipboardIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { userService } from '../../services/user/user.service'
const { user } = useAuth0()

const apiKey = ref(null)
const apiKeyDescription = ref('')
const apiKeyExpiration = ref(null)
const showGenerateKeyModal = ref(false)
const showRevokeKeyModal = ref(false)
const newKeyDescription = ref('')
const newKeyExpiration = ref('')
const copied = ref(false)

const minDate = computed(() => {
  const today = new Date()
  return format(today, 'yyyy-MM-dd')
})

const maxDate = computed(() => {
  const today = new Date()
  const threeMonthsFromNow = new Date(today.setMonth(today.getMonth() + 3))
  return format(threeMonthsFromNow, 'yyyy-MM-dd')
})

const formatDate = (date) => {
  return format(new Date(date), 'PPP')
}

const copyApiKey = async () => {
  await navigator.clipboard.writeText(apiKey.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const getLocalISOString = (date) => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 19) // Remove milliseconds and Z
}

const generateApiKey = async () => {
  try {
    const response = await userService.generateApiKey({
      description: newKeyDescription.value,
      expiresAt: getLocalISOString(newKeyExpiration.value),
    })
    apiKey.value = response.apiKey
    apiKeyDescription.value = newKeyDescription.value
    apiKeyExpiration.value = newKeyExpiration.value
    showGenerateKeyModal.value = false
    newKeyDescription.value = ''
    newKeyExpiration.value = null
  } catch (error) {
    console.error('Error generating API key:', error)
  }
}

const revokeApiKey = async () => {
  try {
    await userService.revokeApiKey()
    apiKey.value = null
    apiKeyDescription.value = ''
    apiKeyExpiration.value = null
    showRevokeKeyModal.value = false
  } catch (error) {
    console.error('Error revoking API key:', error)
  }
}

const fetchApiKeyDetails = async () => {
  try {
    const response = await userService.getApiKey()
    apiKey.value = response.apiKey
    apiKeyDescription.value = response.description
    apiKeyExpiration.value = response.expiresAt
  } catch (error) {
    if (error.response?.status === 404) {
      // API key not found - this is an expected state
      apiKey.value = null
      apiKeyDescription.value = ''
      apiKeyExpiration.value = null
    } else {
      // Unexpected error
      console.error('Error fetching API key details:', error)
    }
  }
}

onMounted(() => {
  fetchApiKeyDetails()
})
</script>

<style>
/* Copy the datepicker styles from WalletSummary */
.dp__theme_dark {
  --dp-background-color: oklch(var(--b1));
  --dp-text-color: oklch(var(--t1));
  --dp-hover-color: oklch(var(--b3));
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: oklch(var(--p));
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgb(0 92 178 / 20%);
}

/* Add these new styles */
.dp__outer_menu_wrap {
  z-index: 9999 !important;
}

/* Ensure modal has lower z-index */
.modal {
  z-index: 999;
}

/* Style the datepicker input inside modal */
.modal .dp__main {
  position: static;
}

.modal .dp__outer_menu_wrap {
  position: fixed !important;
}
</style>
