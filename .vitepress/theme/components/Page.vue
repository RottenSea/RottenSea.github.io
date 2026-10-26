<script setup lang="ts">
import { useData } from "vitepress";
import ArticleHeader from "./ArticleHeader.vue";

const { frontmatter } = useData();
</script>

<template>
  <article>
    <ArticleHeader :title="frontmatter.title" />
    <Content class="prose" />
  </article>
</template>
