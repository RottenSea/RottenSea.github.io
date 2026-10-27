<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { formatDate, toInstant } from "../../shared";
import ArticleHeader from "./ArticleHeader.vue";

const { frontmatter } = useData();

const published = computed(() => toInstant(frontmatter.value.date));
const date = computed(() => formatDate(frontmatter.value.date));
const revised = computed(() => toInstant(frontmatter.value.update));
const updated = computed(() => formatDate(frontmatter.value.update));
</script>

<template>
  <article>
    <ArticleHeader :title="frontmatter.title">
      <p class="post-meta">
        <time :datetime="published">{{ date }}</time>
        <template v-if="updated && updated !== date">
          · 更新于 <time :datetime="revised">{{ updated }}</time>
        </template>
      </p>
    </ArticleHeader>

    <Content class="prose" />
  </article>
</template>

<style scoped>
.post-meta {
  color: var(--text-muted);
  font-family: var(--caption-family);
  font-size: var(--caption-size);
  font-weight: var(--caption-weight);
  line-height: var(--caption-lh);
  letter-spacing: var(--caption-ls);
}
</style>
