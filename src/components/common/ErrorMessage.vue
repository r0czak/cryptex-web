<template>
  <div class="error-message" role="alert">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button v-if="retryAction" @click="retryAction">Retry</button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'An error occurred',
  },
  message: {
    type: String,
    required: true,
  },
  retryAction: {
    type: Function,
    default: null,
  },
})
</script>
