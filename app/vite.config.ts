import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const url = mode == "production" ? "backend:8080" : "localhost:8080";
  return {
    server: {
      fs: {
        allow: [".."]
      },
      proxy: {
        '/notifications/events': {
          changeOrigin: true,
          target: `http://${url}/notifications/events`,
          rewrite: (path) => path.replace(/^\/notifications^\events/, '')
        },

        // websocket
        '/socket/': {
          changeOrigin: true,
          target: `ws://${url}`,
          rewrite: (path) => path.replace(/^\/socket/, '')
        },

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