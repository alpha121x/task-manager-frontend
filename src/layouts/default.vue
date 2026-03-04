<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
    <div class="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
    <div class="pointer-events-none absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-200/45 blur-3xl" />
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>
