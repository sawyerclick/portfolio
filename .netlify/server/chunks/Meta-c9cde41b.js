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
  M: () => Meta
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("./index-c7c5c175.js");
var import_stores_5ca0d853 = require("./stores-5ca0d853.js");
var import_d3_interpolate = require("d3-interpolate");
var import_site_d2dd8573 = require("./site-d2dd8573.js");
const serializeSchema = (schema) => `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`;
const Meta = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d;
  let url;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = (0, import_index_c7c5c175.d)(import_stores_5ca0d853.p, (value) => $page = value);
  let { meta = false } = $$props;
  if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
    $$bindings.meta(meta);
  url = $page.url.toString();
  $$unsubscribe_page();
  return `${$$result.head += `<meta charset="${"utf-8"}" data-svelte="svelte-1wrmxio"><meta name="${"viewport"}" content="${"width=device-width, initial-scale=1"}" data-svelte="svelte-1wrmxio"><meta http-equiv="${"Content-Type"}" content="${"text/html; charset=utf-8"}" data-svelte="svelte-1wrmxio"><meta http-equiv="${"Content-Language"}" content="${"en"}" data-svelte="svelte-1wrmxio"><meta name="${"robots"}" content="${"index,follow"}" data-svelte="svelte-1wrmxio">${$$result.title = `<title>${(0, import_index_c7c5c175.e)((meta == null ? void 0 : meta.title) || import_site_d2dd8573.s.title)}</title>`, ""}<meta name="${"title"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta name="${"description"}"${(0, import_index_c7c5c175.b)("content", (meta == null ? void 0 : meta.description) || import_site_d2dd8573.s.description, 0)} data-svelte="svelte-1wrmxio"><meta name="${"author"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta name="${"keywords"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.keywords.join(","), 0)} data-svelte="svelte-1wrmxio"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-1wrmxio"><meta property="${"og:url"}"${(0, import_index_c7c5c175.b)("content", url, 0)} data-svelte="svelte-1wrmxio"><meta property="${"og:title"}"${(0, import_index_c7c5c175.b)("content", (meta == null ? void 0 : meta.title) || import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta property="${"og:description"}"${(0, import_index_c7c5c175.b)("content", (meta == null ? void 0 : meta.description) || import_site_d2dd8573.s.description, 0)} data-svelte="svelte-1wrmxio"><meta itemprop="${"image"}"${(0, import_index_c7c5c175.b)("content", ((_a = meta == null ? void 0 : meta.img) == null ? void 0 : _a.src) || import_site_d2dd8573.s.img.src, 0)} data-svelte="svelte-1wrmxio"><meta property="${"og:image:alt"}"${(0, import_index_c7c5c175.b)("content", ((_b = meta == null ? void 0 : meta.img) == null ? void 0 : _b.alt) || import_site_d2dd8573.s.img.alt, 0)} data-svelte="svelte-1wrmxio"><meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-1wrmxio"><meta name="${"twitter:creator"}" content="${"@sawyerdabear"}" data-svelte="svelte-1wrmxio"><meta property="${"twitter:url"}"${(0, import_index_c7c5c175.b)("content", url, 0)} data-svelte="svelte-1wrmxio"><meta name="${"twitter:title"}"${(0, import_index_c7c5c175.b)("content", (meta == null ? void 0 : meta.title) || import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta name="${"twitter:description"}"${(0, import_index_c7c5c175.b)("content", (meta == null ? void 0 : meta.description) || import_site_d2dd8573.s.description, 0)} data-svelte="svelte-1wrmxio"><meta name="${"twitter:image"}"${(0, import_index_c7c5c175.b)("content", ((_c = meta == null ? void 0 : meta.img) == null ? void 0 : _c.src) || import_site_d2dd8573.s.img.src, 0)} data-svelte="svelte-1wrmxio"><meta property="${"twitter:image:alt"}"${(0, import_index_c7c5c175.b)("content", ((_d = meta == null ? void 0 : meta.img) == null ? void 0 : _d.alt) || import_site_d2dd8573.s.img.alt, 0)} data-svelte="svelte-1wrmxio"><meta content="${"apple-touch-icon.png"}" data-svelte="svelte-1wrmxio"><link rel="${"icon"}" href="${"favicon.ico"}" data-svelte="svelte-1wrmxio"><link rel="${"apple-touch-icon"}" sizes="${"180x180"}" href="${"apple-touch-icon.png"}" data-svelte="svelte-1wrmxio"><link rel="${"icon"}" type="${"image/png"}" sizes="${"32x32"}" href="${"favicon-32x32.png"}" data-svelte="svelte-1wrmxio"><link rel="${"icon"}" type="${"image/png"}" sizes="${"16x16"}" href="${"favicon-16x16.png"}" data-svelte="svelte-1wrmxio"><link rel="${"manifest"}" href="${"site.webmanifest"}" data-svelte="svelte-1wrmxio"><link rel="${"manifest"}" href="${"manifest.json"}" data-svelte="svelte-1wrmxio"><link itemprop="${"url"}" rel="${"canonical"}"${(0, import_index_c7c5c175.b)("href", url, 0)} data-svelte="svelte-1wrmxio"><link rel="${"alternate"}"${(0, import_index_c7c5c175.b)("href", url, 0)} hreflang="${"x-default"}" data-svelte="svelte-1wrmxio"><meta name="${"application-name"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta name="${"msapplication-starturl"}"${(0, import_index_c7c5c175.b)("content", url, 0)} data-svelte="svelte-1wrmxio"><meta name="${"theme-color"}" content="${"#ff00ff"}" data-svelte="svelte-1wrmxio"><meta name="${"mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-1wrmxio"><meta name="${"application-name"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><meta name="${"apple-mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-1wrmxio"><meta name="${"apple-mobile-web-app-status-bar-style"}" content="${"black-translucent"}" data-svelte="svelte-1wrmxio"><meta name="${"apple-mobile-web-app-title"}"${(0, import_index_c7c5c175.b)("content", import_site_d2dd8573.s.title, 0)} data-svelte="svelte-1wrmxio"><!-- HTML_TAG_START -->${serializeSchema({
    "@context": "https://schema.org/",
    "@type": "Person",
    "@id": `${$page.url.origin}/about`,
    url: $page.url,
    name: import_site_d2dd8573.s.title,
    description: import_site_d2dd8573.s.description,
    image: $page.url.origin + import_site_d2dd8573.s.img.src,
    email: import_site_d2dd8573.s.email,
    alumniOf: "Columbia University",
    jobTitle: import_site_d2dd8573.s.job.title,
    worksFor: {
      "@type": "Organization",
      name: import_site_d2dd8573.s.job.company
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "TX",
      addressCountry: "United States"
    },
    sameAs: [import_site_d2dd8573.s.socials.github.url, import_site_d2dd8573.s.socials.twitter.url, import_site_d2dd8573.s.socials.linkedIn.url]
  })}<!-- HTML_TAG_END -->`, ""}`;
});
