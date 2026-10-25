<script setup lang="ts">
import { siBluesky, siGithub } from "simple-icons";

const links = [
  { label: "GitHub", href: "https://github.com/RottenSea", icon: siGithub },
  { label: "Bluesky", href: "https://bsky.app/profile/rottenth.bsky.social", icon: siBluesky },
];
</script>

<template>
  <ul class="social-links">
    <li v-for="link in links" :key="link.href">
      <!-- Matches what VitePress and the markdown plugin in config.ts do for external Markdown links. -->
      <a :href="link.href" target="_blank" rel="noreferrer">
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path :d="link.icon.path" />
        </svg>
        {{ link.label }}<span class="visually-hidden">（在新标签页打开）</span>
      </a>
    </li>
  </ul>
</template>
