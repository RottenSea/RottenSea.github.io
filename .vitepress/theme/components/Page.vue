<script setup lang="ts">
import { useData } from "vitepress";

const { frontmatter } = useData();
</script>

<template>
  <article class="page">
    <header class="post-header">
      <h1>{{ frontmatter.title }}</h1>
    </header>

    <Content class="prose" />
  </article>
</template>
