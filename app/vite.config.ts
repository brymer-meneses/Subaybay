import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const root = path.resolve(process.cwd(), '..');
  const env = loadEnv(mode, root, '');

  return {
    server: { 
      fs: { 
        allow: [".."]
      },
      proxy: {
        "/docs": {
          target: env.DOCS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/docs/, '')
        }
      }
    },
    plugins: [sveltekit()],
  }
});