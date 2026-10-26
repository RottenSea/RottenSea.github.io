<script setup lang="ts">
import { data as posts } from "../posts.data";
</script>

<template>
  <div>
    <Content class="home-intro" />

    <ol class="post-list">
      <li v-for="post in posts" :key="post.url" class="post-card">
        <h2 class="post-card-title">
          <a :href="post.url">{{ post.title }}</a>
        </h2>
        <time class="post-card-date" :datetime="post.date">{{ post.date }}</time>
        <p v-if="post.description">{{ post.description }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.home-intro {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.post-list {
  display: grid;
  gap: var(--space-8);
}

.post-card {
  display: grid;
  gap: var(--space-2);
}

.post-card-title {
  font: var(--typography-display-sm);
}

.post-card-title a {
  color: var(--color-text-ink);
  text-decoration: none;
}

.post-card-title a:hover {
  text-decoration-line: underline;
}

.post-card-date {
  color: var(--color-text-muted);
  font: var(--typography-caption-default);
}
</style>
