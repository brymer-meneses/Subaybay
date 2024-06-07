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
        items: [
          { text: 'Glossary', link: '/glossary' },
          { text: 'Navigation Guide', link: '/page-guides/navigation' },
        ]
      },
      {
        text: 'Page Guides',
        items: [
          { text: 'Inbox', link: '/page-guides/inbox' },
          { text: 'Requests', link: '/page-guides/requests' },
          { text: 'Configuration', link: '/page-guides/configuration' },
          { text: 'Admin', link: '/page-guides/configuration' },
        ]
      },
      {
        text: 'Functionality Guides',
        items: [
          { text: 'Request Management', link: '/functionality-guides/request-management' },
          { text: 'User Management', link: '/functionality-guides/user-management' }
        ]
      },
      {
        text: 'Examples',
        link: '/examples/examples-directory',
        items: [
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
