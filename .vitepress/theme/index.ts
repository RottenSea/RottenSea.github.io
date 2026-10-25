import type { Theme } from "vitepress";
import "@rottensea/ds-personal-website/index.css";
import "./style.css";
import SocialLinks from "./components/SocialLinks.vue";
import Layout from "./Layout.vue";

export default {
  Layout,
  enhanceApp({ app }) {
    // Usable in any Markdown page without an import.
    app.component("SocialLinks", SocialLinks);
  },
} satisfies Theme;
