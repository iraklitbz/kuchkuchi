<template>
  <div class="flex min-h-screen flex-col bg-white font-sans text-zinc-800">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <!-- Cart drawer (global, always mounted) -->
    <CartDrawer />
  </div>
</template>
