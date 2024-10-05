import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "IMDb to Notion",
  version: "1.0.0",
  icons: {
    32: "src/assets/icon.png",
  },
  permissions: ["storage", "activeTab", "nativeMessaging"],
  action: {
    default_popup: "index.html",
  },
  content_scripts: [
    {
      js: ["src/contentScript.ts"],
      matches: ["https://www.imdb.com/title/*"],
    },
  ],
  host_permissions: ["https://api.notion.com/v1/pages"],
  background: {
    service_worker: "src/background.ts",
  },
  externally_connectable: {
    matches: ["https://www.imdb.com/title/*"],
  },
  options_ui: {
    page: "options.html",
    open_in_tab: true,
  },
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
