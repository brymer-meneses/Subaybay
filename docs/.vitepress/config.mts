import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "src",
  base: "/docs/",
  title: "UPB Subaybay Manual",
  description: "a documentation",
  ignoreDeadLinks: true,
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
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/request-management"
              },
              {
                text: "Create a New Request",
                link: "/functionality-guides/request-management/create-new-request"
              },
              {
                text: "Pass to Next",
                link: "/functionality-guides/request-management/pass-to-next"
              },
              {
                text: "Rollback",
                link: "/functionality-guides/request-management/rollback"
              },
              {
                text: "Mark as Stale/Discontinue",
                link: "/functionality-guides/request-management/discontinue"
              },
              {
                text: "Edit Request Details",
                link: "/functionality-guides/request-management/edit-request-details"
              }
            ]
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
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
