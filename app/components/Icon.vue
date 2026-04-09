<template>
  <span class="icon">
    <component
      :is="icon"
      :filled="filled"
      class="size-[1em] align-middle"
      :class="{ 'icon--filled': !filled, 'mb-[0.125em]': autoAlign }"
    />
  </span>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  filled?: boolean
  autoAlign?: boolean
}>()
</script>
