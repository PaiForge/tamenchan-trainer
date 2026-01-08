import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ["@pai-forge/riichi-mahjong"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
