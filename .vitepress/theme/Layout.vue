<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { computed } from "vue";
import Home from "./components/Home.vue";
import NotFound from "./components/NotFound.vue";
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

    <main>
      <NotFound v-if="page.isNotFound" />
      <Home v-else-if="frontmatter.layout === 'home'" />
      <Page v-else-if="frontmatter.layout === 'page'" />
      <Post v-else />
    </main>
  </div>
</template>

<style scoped>
.site {
  margin-inline: auto;
  max-width: 42.5rem;
  padding-inline: var(--space-6);
  padding-block: var(--space-8) var(--space-16);
}

.site-header {
  align-items: center;
  border-bottom: var(--border-hairline);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: space-between;
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-4);
}

.site-title {
  color: var(--color-text-ink);
  font: var(--typography-title-md);
  text-decoration: none;
}

.site-nav {
  align-items: center;
  display: flex;
  gap: var(--space-4);
}

.site-nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-tint);
}

.site-nav a:hover,
.site-nav a[aria-current="page"] {
  color: var(--color-text-ink);
}

.site-nav a[aria-current="page"] {
  text-decoration-line: underline;
}
</style>
