<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<!-- The title of a post or page. Anything in the slot, such as the dates, goes under it. -->
<template>
  <header class="article-header">
    <h1>{{ title }}</h1>
    <slot />
  </header>
</template>

<style scoped>
.article-header {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-12);
}

h1 {
  font: var(--typography-display-md);
}
</style>
