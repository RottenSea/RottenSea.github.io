<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { formatDate } from "../../shared";
import ArticleHeader from "./ArticleHeader.vue";

const { frontmatter } = useData();

const date = computed(() => formatDate(frontmatter.value.date));
const updated = computed(() => formatDate(frontmatter.value.update));
</script>

<template>
  <article>
    <ArticleHeader :title="frontmatter.title">
      <p class="post-meta">
        <time :datetime="date">{{ date }}</time>
        <template v-if="updated && updated !== date">
          · 更新于 <time :datetime="updated">{{ updated }}</time>
        </template>
      </p>
    </ArticleHeader>

    <Content class="prose" />
  </article>
</template>

<style scoped>
.post-meta {
  color: var(--color-text-muted);
  font: var(--typography-caption-default);
}
</style>
