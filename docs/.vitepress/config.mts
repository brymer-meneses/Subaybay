import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "src",
  base: "/docs/",
  title: "UPB Subaybay Manual",
  description: "a documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Glossary", link: "/glossary" },
    ],

    sidebar: [
      {
        items: [
          { text: "Glossary", link: "/glossary" },
          { text: "Navigation Guide", link: "/navigation" },
        ],
      },
      {
        text: "Functionality Guides",
        items: [
          {
            text: "Request Management",
            link: "/functionality-guides/request-management",
          },
          {
            text: "User Management",
            link: "/functionality-guides/user-management",
          },
          {
            text: "Request Information",
            link: "/functionality-guides/request-info",
          },
          { text: "Chatting", link: "/functionality-guides/chat" },
        ],
      },
      {
        text: "Examples",
        link: "/examples/examples-directory",
        items: [],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
