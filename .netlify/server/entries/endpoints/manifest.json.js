import { s as site } from "../../chunks/site-c2672eee.js";
import "../../chunks/index-41e31554.js";
const get = async () => {
  return {
    body: {
      name: site.title,
      short_name: site.title,
      description: site.description,
      dir: "auto",
      lang: "en-US",
      display: "minimal-ui",
      orientation: "any",
      scope: "/",
      start_url: ".",
      background_color: site.colors.background,
      theme_color: site.colors.theme,
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }
  };
};
export { get };
