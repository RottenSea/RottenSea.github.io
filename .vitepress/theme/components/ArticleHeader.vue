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
  gap: var(--space-sm);
  margin-bottom: var(--space-xxl);
}

h1 {
  font-family: var(--display-md-family);
  font-size: var(--display-md-size);
  font-weight: var(--display-md-weight);
  line-height: var(--display-md-lh);
  letter-spacing: var(--display-md-ls);
}
</style>
