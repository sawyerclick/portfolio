var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  get: () => get
});
module.exports = __toCommonJS(stdin_exports);
var import_site_d2dd8573 = require("../../chunks/site-d2dd8573.js");
var import_index_c7c5c175 = require("../../chunks/index-c7c5c175.js");
const get = async () => {
  return {
    body: {
      name: import_site_d2dd8573.s.title,
      short_name: import_site_d2dd8573.s.title,
      description: import_site_d2dd8573.s.description,
      dir: "auto",
      lang: "en-US",
      display: "minimal-ui",
      orientation: "any",
      scope: "/",
      start_url: "/",
      background_color: "#f8f8f8",
      theme_color: "#ff00ff",
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
