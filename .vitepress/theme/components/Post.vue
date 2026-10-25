<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { frontmatter } = useData();

// Frontmatter dates arrive as ISO strings; the post shows the day only.
const day = (value: unknown) => (value ? new Date(value as string).toISOString().slice(0, 10) : "");
const date = computed(() => day(frontmatter.value.date));
const updated = computed(() => day(frontmatter.value.update));
</script>

<template>
  <article class="post">
    <header class="post-header">
      <h1>{{ frontmatter.title }}</h1>
      <p class="post-meta">
        <time :datetime="date">{{ date }}</time>
        <template v-if="updated && updated !== date">
          · 更新于 <time :datetime="updated">{{ updated }}</time>
        </template>
      </p>
    </header>

    <Content class="prose" />
  </article>
</template>
