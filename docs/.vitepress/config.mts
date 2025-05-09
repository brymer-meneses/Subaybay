import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "src",
  base: "/docs/",
  title: "UPB Subaybay Manual",
  description: "a documentation",
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Application",
        link: "../inbox",
        target: "_self",
      },
      {
        text: "Guides",
        items: [
          { text: "Glossary", link: "/glossary" },
          { text: "Navigation Guide", link: "/navigation" },
          {
            text: "Functionality",
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
        ],
      },
      { text: "Examples", link: "/examples/examples-directory" },
    ],
    sidebar: [
      {
        text: "Glossary",
        collapsed: true,
        items: [
          { text: "Overview", link: "/glossary" },
          { text: "Application Pages", link: "/glossary/app-page" },
          { text: "Parts of a Request", link: "/glossary/request-parts" },
          {
            text: "Procedures on a Request",
            link: "/glossary/request-procedures",
          },
          { text: "Types of Requests", link: "/glossary/request-types" },
          { text: "Types of Inboxes", link: "/glossary/inbox-types" },
        ],
      },
      {
        text: "Navigation Guide",
        collapsed: true,
        items: [
          { text: "Overview", link: "/navigation" },
          { text: "Basics", link: "/navigation/basics" },
          { text: "Pages", link: "/navigation/pages" },
          { text: "Views", link: "/navigation/views" },
        ],
      },
      {
        text: "Functionality Guides",
        items: [
          {
            text: "Request Management",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/request-management",
              },
              {
                text: "Create a New Request",
                link: "/functionality-guides/request-management/create-new-request",
              },
              {
                text: "Pass to Next",
                link: "/functionality-guides/request-management/pass-to-next",
              },
              {
                text: "Finish and Archive",
                link: "/functionality-guides/request-management/completion",
              },
              {
                text: "Rollback",
                link: "/functionality-guides/request-management/rollback",
              },
              {
                text: "Reassign",
                link: "/functionality-guides/request-management/reassign",
              },
              {
                text: "Mark as Stale/Discontinue",
                link: "/functionality-guides/request-management/discontinue",
              },
              {
                text: "Edit Request Details",
                link: "/functionality-guides/request-management/edit-request-details",
              },
            ],
          },
          {
            text: "User Management",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/user-management",
              },
              {
                text: "Add User/Email",
                link: "/functionality-guides/user-management/add-user.md",
              },
              {
                text: "Remove User",
                link: "/functionality-guides/user-management/remove-user.md",
              },
              {
                text: "Add Admin",
                link: "/functionality-guides/user-management/add-admin.md",
              },
              {
                text: "Remove Admin",
                link: "/functionality-guides/user-management/remove-admin.md",
              },
            ],
          },
          {
            text: "Request Information",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/request-info",
              },
              {
                text: "Request Progress",
                link: "/functionality-guides/request-info/request-progress",
              },
              {
                text: "Request History",
                link: "/functionality-guides/request-info/request-history",
              },
              {
                text: "Request Statistics",
                link: "/functionality-guides/request-info/request-statistics",
              },
            ],
          },
          {
            text: "Chatting",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/chat",
              },
              {
                text: "Inbox Chat",
                link: "/functionality-guides/chat/inbox-chat",
              },
              {
                text: "Request Details Page Chat",
                link: "/functionality-guides/chat/request-details-chat",
              },
            ],
          },
          {
            text: "Request Types Management",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/functionality-guides/request-types-management",
              },
              {
                text: "Create Request Types",
                link: "/functionality-guides/request-types-management/create-request-type",
              },
              {
                text: "Edit Request Types",
                link: "/functionality-guides/request-types-management/edit-request-type",
              },
              {
                text: "Delete Request Types",
                link: "/functionality-guides/request-types-management/delete-request-type",
              },
            ],
          },
        ],
      },
      {
        text: "Examples",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/examples/examples-directory",
          },
          {
            text: "Passing to Completion",
            link: "/examples/passing-to-completion",
          },
          {
            text: "Making Corrections",
            link: "/examples/making-corrections",
          },
          {
            text: "Managing Request Types",
            link: "/examples/managing-request-types",
          },
          {
            text: "Managing Users",
            link: "/examples/managing-users",
          },
        ],
      },
      {
        text: "Maintenance",
        collapsed: true,
        items: [
          {
            text: "Environment Variables",
            link: "/maintenance/environment-variables",
          },
          {
            text: "Modifying Email Template",
            link: "/maintenance/modifying-email-template",
          },
          {
            text: "Redeployment",
            link: "/maintenance/redeployment",
          },
        ],
      },
    ],
    search: {
      provider: "local",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/brymer-meneses/Subaybay" },
    ],
  },
});
