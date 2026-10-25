<script setup lang="ts">
import { useData } from "vitepress";
import Home from "./components/Home.vue";
import Post from "./components/Post.vue";

const { page, frontmatter, site } = useData();
</script>

<template>
  <div class="site">
    <header class="site-header">
      <a class="site-title" href="/">{{ site.title }}</a>
    </header>

    <main class="site-main">
      <section v-if="page.isNotFound" class="not-found">
        <h1>404</h1>
        <p>这个页面不存在。<a href="/">回到首页</a></p>
      </section>
      <Home v-else-if="frontmatter.layout === 'home'" />
      <Post v-else />
    </main>
  </div>
</template>
