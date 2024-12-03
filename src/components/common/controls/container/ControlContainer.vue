<template>
  <div
    class="control-container bg-base-200 border border-base-300 rounded-box p-4"
    :class="{
      'flex items-center gap-4': horizontal,
      'flex flex-col': !horizontal,
    }"
  >
    <div v-if="label" class="text-sm opacity-70 mb-2">{{ label }}</div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },
})
</script>
