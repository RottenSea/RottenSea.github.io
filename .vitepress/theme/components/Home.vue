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
        <time class="post-card-date" :datetime="post.published">{{ post.date }}</time>
        <p v-if="post.description">{{ post.description }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.home-intro {
  display: grid;
  gap: var(--space-md);
  margin-bottom: var(--space-xxl);
}

.post-list {
  display: grid;
  gap: var(--space-xl);
}

.post-card {
  display: grid;
  gap: var(--space-xs);
}

.post-card-title {
  font-family: var(--display-sm-family);
  font-size: var(--display-sm-size);
  font-weight: var(--display-sm-weight);
  line-height: var(--display-sm-lh);
  letter-spacing: var(--display-sm-ls);
}

.post-card-title a {
  color: var(--text-ink);
  text-decoration: none;
}

.post-card-title a:hover {
  text-decoration-line: underline;
}

.post-card-date {
  color: var(--text-muted);
  font-family: var(--caption-family);
  font-size: var(--caption-size);
  font-weight: var(--caption-weight);
  line-height: var(--caption-lh);
  letter-spacing: var(--caption-ls);
}
</style>
