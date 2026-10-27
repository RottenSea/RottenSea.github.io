<script setup lang="ts">
import { useData } from "vitepress";
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { data as groups } from "../specimens.data";
import ArticleHeader from "./ArticleHeader.vue";

const { frontmatter } = useData();
const frames = useTemplateRef<HTMLIFrameElement[]>("frames");

// The specimen pages read only data-theme, like the site, so each one gets the site's current theme.
function syncTheme(frame: HTMLIFrameElement) {
  const root = frame.contentDocument?.documentElement;
  if (root) root.dataset.theme = document.documentElement.dataset.theme ?? "light";
}

// Same-origin pages can be measured, so each iframe grows to its page's height,
// again whenever the page reflows (fonts arriving, a theme with different line breaks).
function setUp(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument;
  const win = frame.contentWindow as (Window & typeof globalThis) | null;
  if (!doc || !win || doc.URL === "about:blank") return;
  syncTheme(frame);
  // The iframe is border-box, so its height has to include its own borders.
  const fit = () => {
    const borders = frame.offsetHeight - frame.clientHeight;
    frame.style.height = `${doc.documentElement.scrollHeight + borders}px`;
  };
  // Fit once now; the observer only reports later changes, and only while the page is rendered.
  fit();
  new win.ResizeObserver(fit).observe(doc.body);
}

let themeObserver: MutationObserver | undefined;

onMounted(() => {
  // An iframe that finished loading before hydration missed its load event.
  for (const frame of frames.value ?? []) {
    if (frame.contentDocument?.readyState === "complete") setUp(frame);
  }
  themeObserver = new MutationObserver(() => frames.value?.forEach(syncTheme));
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
});

onBeforeUnmount(() => themeObserver?.disconnect());
</script>

<template>
  <article>
    <ArticleHeader :title="frontmatter.title" />
    <Content class="prose design-intro" />

    <section v-for="group in groups" :key="group.name" class="specimen-group">
      <h2>{{ group.name }}</h2>
      <figure v-for="specimen in group.specimens" :key="specimen.src" class="specimen">
        <figcaption>
          <span class="specimen-name">{{ specimen.name }}</span>
          <span class="specimen-subtitle">{{ specimen.subtitle }}</span>
        </figcaption>
        <iframe
          ref="frames"
          :src="specimen.src"
          :title="specimen.name"
          :style="{ height: `${specimen.height}px` }"
          loading="lazy"
          @load="setUp($event.target as HTMLIFrameElement)"
        />
      </figure>
    </section>
  </article>
</template>

<style scoped>
.design-intro {
  margin-bottom: var(--space-xxl);
}

.specimen-group {
  display: grid;
  gap: var(--space-xl);
  margin-bottom: var(--space-section);
}

.specimen-group h2 {
  font-family: var(--display-sm-family);
  font-size: var(--display-sm-size);
  line-height: var(--display-sm-lh);
  letter-spacing: var(--display-sm-ls);
}

.specimen {
  display: grid;
  gap: var(--space-sm);
}

figcaption {
  display: grid;
  gap: var(--space-xxs);
}

.specimen-name {
  color: var(--text-ink);
  font-family: var(--title-sm-family);
  font-size: var(--title-sm-size);
  font-weight: var(--title-sm-weight);
  line-height: var(--title-sm-lh);
}

.specimen-subtitle {
  color: var(--text-muted);
  font-family: var(--caption-family);
  font-size: var(--caption-size);
  line-height: var(--caption-lh);
}

iframe {
  border: var(--border-hairline);
  border-radius: var(--radius-lg);
  display: block;
  width: 100%;
}
</style>
