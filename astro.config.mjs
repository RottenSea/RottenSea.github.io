// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  integrations: [react(), partytown()],
  fonts: [
    {
      name: "Noto Serif SC",
      cssVariable: "--font-noto-serif-sc",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/Noto_Serif_SC_woff2/NotoSerifSC-Medium.woff2",
            ],
            weight: 500,
            style: "normal",
          },
        ],
      },
    },
    {
      name: "Source Han Sans SC",
      cssVariable: "--font-source-han-sans-sc",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/SourceHanSansSC_woff2/SourceHanSansSC-Medium.woff2",
            ],
            weight: 500,
            style: "normal",
          },
        ],
      },
    },
  ],
});
