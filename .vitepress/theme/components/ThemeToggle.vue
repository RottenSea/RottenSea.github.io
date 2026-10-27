<script setup lang="ts">
import { Moon, Sun } from "@lucide/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { THEME_STORAGE_KEY } from "../../shared";

type Theme = "light" | "dark";

// Unknown while rendering on the server, so the icon appears once the page is mounted.
const theme = ref<Theme | null>(null);
const hovering = ref(false);

const systemTheme = (): Theme => (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

// Until the reader picks a theme, the page follows the system, including later changes to it.
let systemQuery: MediaQueryList | undefined;
const followSystem = () => {
  if (savedTheme()) return;
  theme.value = systemTheme();
  document.documentElement.dataset.theme = theme.value;
};

onMounted(() => {
  theme.value = savedTheme() ?? systemTheme();
  systemQuery = matchMedia("(prefers-color-scheme: dark)");
  systemQuery.addEventListener("change", followSystem);
});

onUnmounted(() => systemQuery?.removeEventListener("change", followSystem));

const next = computed<Theme>(() => (theme.value === "dark" ? "light" : "dark"));

// The icon shows the current theme; hovering with a mouse previews the one a click switches to.
const shown = computed(() => (hovering.value ? next.value : theme.value));

const label = computed(() => (theme.value ? `切换到${next.value === "dark" ? "深色" : "浅色"}主题` : "切换主题"));

function toggle() {
  const value = next.value;
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    // Without storage the choice lasts until the page is reloaded.
  }
  theme.value = value;
  hovering.value = false;
}

// Touch screens fire pointerenter on tap and never leave, which would leave the preview stuck.
function startPreview(event: PointerEvent) {
  if (event.pointerType === "mouse") hovering.value = true;
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    @click="toggle"
    @pointerenter="startPreview"
    @pointerleave="hovering = false"
  >
    <Moon v-if="shown === 'dark'" class="theme-toggle-icon" aria-hidden="true" />
    <Sun v-else-if="shown === 'light'" class="theme-toggle-icon" aria-hidden="true" />
  </button>
</template>

<style scoped>
.theme-toggle {
  align-items: center;
  border-radius: var(--radius-md);
  color: var(--text-body);
  cursor: pointer;
  display: inline-flex;
  height: var(--icon-button-size);
  justify-content: center;
  transition: var(--transition-tint);
  width: var(--icon-button-size);
}

.theme-toggle:hover {
  background-color: var(--surface-soft);
}

.theme-toggle-icon {
  height: 1.125rem;
  width: 1.125rem;
}
</style>
