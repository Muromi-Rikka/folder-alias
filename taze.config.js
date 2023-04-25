import { defineConfig } from "taze";
export default defineConfig({
  // ignore packages from bumping
  exclude: ["@types/node"],
  // fetch latest package info from registry without cache
  force: true,
  packageMode: {
    "@types/node": "minor",
    "@types/vscode": "minor",
    typescript: "minor"
  }
});
