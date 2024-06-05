import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import path from "path";

export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, path.resolve(process.cwd(), '..'), '');
  const backend_url = mode == "production" ? `backend:${env.BACKEND_PORT}` : `localhost:${env.BACKEND_PORT}`;
  const docs_url = mode == "production" ? `docs:${env.DOCS_PORT}` : `localhost:${env.DOCS_PORT}`;

  return {
    server: {
      fs: {
        allow: [".."]
      },
      proxy: {
        '/notifications/events': {
          changeOrigin: true,
          target: `http://${backend_url}/notifications/events`,
          rewrite: (path) => path.replace(/^\/notifications^\/events/, '')
        },

        // websocket
        '/socket/': {
          changeOrigin: true,
          target: `ws://${backend_url}`,
          ws: true,
          rewrite: (path) => path.replace(/^\/socket/, '')
        },

        "/docs": {
          target: `http://${docs_url}/`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/docs/, '')
        }
      }
    },
    plugins: [sveltekit()],
  }
});
