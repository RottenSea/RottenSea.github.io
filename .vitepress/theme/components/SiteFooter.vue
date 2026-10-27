<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

/** When the site went live: 2026-05-20 10:49:12 UTC+8. */
const LAUNCHED_AT = Date.parse("2026-05-20T02:49:12Z");

// Unknown on the server, so the page renders "--" and the count starts once it is mounted.
const uptime = ref("--");

const pad = (n: number) => String(n).padStart(2, "0");

function update() {
  const elapsed = Date.now() - LAUNCHED_AT;
  if (elapsed < 0) {
    uptime.value = "还没开始呢";
    return;
  }
  const seconds = Math.floor(elapsed / 1000);
  const days = Math.floor(seconds / 86400);
  const clock = `${pad(Math.floor((seconds % 86400) / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  uptime.value = days > 0 ? `${days}d ${clock}` : clock;
}

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <footer class="site-footer">
    uptime <span class="uptime">{{ uptime }}</span>
  </footer>
</template>

<style scoped>
.site-footer {
  color: var(--text-muted-soft);
  font-family: var(--body-sm-family);
  font-size: var(--body-sm-size);
  line-height: var(--body-sm-lh);
  margin-top: var(--space-section);
  padding: var(--space-xl);
  text-align: center;
}

.uptime {
  font-family: var(--font-mono);
}
</style>
