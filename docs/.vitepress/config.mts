import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'src',
  base: "/docs/",
  title: "UPB Subaybay Manual",
  description: "a documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Glossary', link: '/glossary' }
    ],

    sidebar: [
      {
        text: 'Page Guides',
        items: [
          { text: 'Inbox', link: '/guides/adming' },
          { text: 'Requests', link: '/guides/requests' },
          { text: 'Configuration', link: '/guides/configuration' },
          { text: 'Configuration', link: '/guides/configuration' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
