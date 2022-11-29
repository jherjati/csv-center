import path from "path";
import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import { partytownVite } from "@builder.io/partytown/utils";
import { VitePluginFonts } from "vite-plugin-fonts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePluginFonts({
      google: {
        families: ["Rubik"],
      },
    }),
    partytownVite({
      dest: path.join(__dirname, "dist", "~partytown"),
    }),
    VitePWA({
      includeAssets: [
        "icons/favicon.svg",
        "icons/favicon.ico",
        "robots.txt",
        "browserconfig.xml",
        "icons/safari-pinned-tab.svg",
      ],
      manifest: {
        name: "CSV Center",
        short_name: "One Stop CSV Solution",
        description:
          "Progressive web app to help your work with CSV file. Import, manage, query, and pull insights with ease.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      manifestFilename: "manifest.json",
    }),
    alias({
      entries: [
        { find: "react", replacement: "preact/compat" },
        { find: "react-dom", replacement: "preact/compat" },
      ],
    }),
  ],
});
