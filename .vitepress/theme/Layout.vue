<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { computed } from "vue";
import Home from "./components/Home.vue";
import Page from "./components/Page.vue";
import Post from "./components/Post.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

const { page, frontmatter, site } = useData();
const route = useRoute();

const nav = [
  { label: "blog", href: "/", matches: (path: string) => path === "/" || path.startsWith("/blog/") },
  { label: "about", href: "/about", matches: (path: string) => path === "/about" },
];
const current = computed(() => nav.find((item) => item.matches(route.path))?.href);
</script>

<template>
  <div class="site">
    <header class="site-header">
      <a class="site-title" href="/">{{ site.title }}</a>
      <nav class="site-nav" aria-label="网站">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          :aria-current="item.href === current ? 'page' : undefined"
        >
          {{ item.label }}
        </a>
        <ThemeToggle />
      </nav>
    </header>

    <main class="site-main">
      <section v-if="page.isNotFound" class="not-found">
        <h1>404</h1>
        <p>这个页面不存在。<a href="/">回到首页</a></p>
      </section>
      <Home v-else-if="frontmatter.layout === 'home'" />
      <Page v-else-if="frontmatter.layout === 'page'" />
      <Post v-else />
    </main>
  </div>
</template>
