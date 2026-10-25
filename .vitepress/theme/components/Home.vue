<script setup lang="ts">
import { data as posts } from "../posts.data";
</script>

<template>
  <div class="home">
    <Content class="home-intro" />

    <ol class="post-list">
      <li v-for="post in posts" :key="post.url" class="post-card">
        <h2 class="post-card-title">
          <a :href="post.url">{{ post.title }}</a>
        </h2>
        <time class="post-card-date" :datetime="post.date">{{ post.date }}</time>
        <p v-if="post.description" class="post-card-description">{{ post.description }}</p>
      </li>
    </ol>
  </div>
</template>
