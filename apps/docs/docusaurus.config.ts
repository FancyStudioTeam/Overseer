import type { Config } from "@docusaurus/types";
import { themes } from "prism-react-renderer";

export default (<Config>{
  baseUrl: "/",
  favicon: "images/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: ["./src/css/custom.css"],
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      items: [
        {
          label: "Documentation",
          position: "left",
          sidebarId: "tutorialSidebar",
          type: "docSidebar",
        },
        /*{
          label: "Blog",
          position: "left",
          to: "/blog",
        },*/
        {
          position: "right",
          type: "localeDropdown",
        },
      ],
      title: "Overseer Docs",
    },
    prism: {
      theme: themes.vsDark,
    },
  },
  title: "Overseer Docs",
  url: "https://overseerdocs.pages.dev/",
});
