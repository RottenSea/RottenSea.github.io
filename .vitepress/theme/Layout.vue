<script setup lang="ts">
import { useData, useRoute } from "vitepress";
import { computed } from "vue";
import Design from "./components/Design.vue";
import Home from "./components/Home.vue";
import NotFound from "./components/NotFound.vue";
import Page from "./components/Page.vue";
import Post from "./components/Post.vue";
import SiteFooter from "./components/SiteFooter.vue";
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
  <div class="site" :class="{ 'site-wide': frontmatter.layout === 'design' }">
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
      <Design v-else-if="frontmatter.layout === 'design'" />
      <Post v-else />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.site {
  margin-inline: auto;
  max-width: 42.5rem;
  padding-inline: var(--space-lg);
  padding-block: var(--space-xl) calc(var(--space-xl) * 2);
}

/* The design page shows specimens drawn at 700px, wider than the reading column. */
.site-wide {
  max-width: calc(700px + 2 * var(--space-lg));
}

.site-header {
  align-items: center;
  border-bottom: var(--border-hairline);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  justify-content: space-between;
  margin-bottom: var(--space-xxl);
  padding-bottom: var(--space-md);
}

.site-title {
  color: var(--text-ink);
  font-family: var(--title-md-family);
  font-size: var(--title-md-size);
  font-weight: var(--title-md-weight);
  line-height: var(--title-md-lh);
  letter-spacing: var(--title-md-ls);
  text-decoration: none;
}

.site-nav {
  align-items: center;
  display: flex;
  gap: var(--space-md);
}

.site-nav a {
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition-tint);
}

.site-nav a:hover,
.site-nav a[aria-current="page"] {
  color: var(--text-ink);
}

.site-nav a[aria-current="page"] {
  text-decoration-line: underline;
}
</style>
