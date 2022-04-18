import { c as create_ssr_component, b as subscribe, e as escape, a as add_attribute } from "./index-41e31554.js";
import { p as page } from "./stores-23c3d2a2.js";
import "d3-interpolate";
import { s as site } from "./site-c2672eee.js";
const serializeSchema = (schema) => `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`;
const Meta = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let url;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { meta = {} } = $$props;
  if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
    $$bindings.meta(meta);
  url = $page.url.toString();
  $$unsubscribe_page();
  return `${$$result.head += `<meta charset="${"utf-8"}" data-svelte="svelte-1c3wnio"><meta name="${"viewport"}" content="${"width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86"}" data-svelte="svelte-1c3wnio"><meta http-equiv="${"Content-Type"}" content="${"text/html; charset=utf-8"}" data-svelte="svelte-1c3wnio"><meta http-equiv="${"Content-Language"}" content="${"en"}" data-svelte="svelte-1c3wnio"><meta name="${"robots"}" content="${"index,follow"}" data-svelte="svelte-1c3wnio">${$$result.title = `<title>${escape(meta?.title || site.title)}</title>`, ""}<meta name="${"title"}"${add_attribute("content", site.title, 0)} data-svelte="svelte-1c3wnio"><meta name="${"description"}"${add_attribute("content", meta?.description || site.description, 0)} data-svelte="svelte-1c3wnio"><meta name="${"author"}"${add_attribute("content", site.title, 0)} data-svelte="svelte-1c3wnio"><meta name="${"keywords"}"${add_attribute("content", site.keywords.join(","), 0)} data-svelte="svelte-1c3wnio"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-1c3wnio"><meta property="${"og:url"}"${add_attribute("content", url, 0)} data-svelte="svelte-1c3wnio"><meta property="${"og:title"}"${add_attribute("content", meta?.title || site.title, 0)} data-svelte="svelte-1c3wnio"><meta property="${"og:description"}"${add_attribute("content", meta?.description || site.description, 0)} data-svelte="svelte-1c3wnio"><meta property="${"og:locale"}" content="${"en-US"}" data-svelte="svelte-1c3wnio"><meta itemprop="${"image"}"${add_attribute("content", meta?.img?.src || site.img.src, 0)} data-svelte="svelte-1c3wnio"><meta property="${"og:image:alt"}"${add_attribute("content", meta?.img?.alt || site.img.alt, 0)} data-svelte="svelte-1c3wnio"><meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-1c3wnio"><meta name="${"twitter:creator"}" content="${"@sawyerdabear"}" data-svelte="svelte-1c3wnio"><meta property="${"twitter:url"}"${add_attribute("content", url, 0)} data-svelte="svelte-1c3wnio"><meta name="${"twitter:title"}"${add_attribute("content", meta?.title || site.title, 0)} data-svelte="svelte-1c3wnio"><meta name="${"twitter:description"}"${add_attribute("content", meta?.description || site.description, 0)} data-svelte="svelte-1c3wnio"><meta name="${"twitter:image"}"${add_attribute("content", meta?.img?.src || site.img.src, 0)} data-svelte="svelte-1c3wnio"><meta property="${"twitter:image:alt"}"${add_attribute("content", meta?.img?.alt || site.img.alt, 0)} data-svelte="svelte-1c3wnio"><meta content="${"apple-touch-icon.png"}" data-svelte="svelte-1c3wnio"><link rel="${"icon"}" href="${"favicon.ico"}" data-svelte="svelte-1c3wnio"><link rel="${"apple-touch-icon"}" sizes="${"180x180"}" href="${"apple-touch-icon.png"}" data-svelte="svelte-1c3wnio"><link rel="${"icon"}" type="${"image/png"}" sizes="${"32x32"}" href="${"favicon-32x32.png"}" data-svelte="svelte-1c3wnio"><link rel="${"icon"}" type="${"image/png"}" sizes="${"16x16"}" href="${"favicon-16x16.png"}" data-svelte="svelte-1c3wnio"><link rel="${"manifest"}" href="${"site.webmanifest"}" data-svelte="svelte-1c3wnio"><link rel="${"manifest"}" href="${"manifest.json"}" data-svelte="svelte-1c3wnio"><link itemprop="${"url"}" rel="${"canonical"}"${add_attribute("href", url, 0)} data-svelte="svelte-1c3wnio"><link rel="${"alternate"}"${add_attribute("href", url, 0)} hreflang="${"x-default"}" data-svelte="svelte-1c3wnio"><meta name="${"application-name"}"${add_attribute("content", site.title, 0)} data-svelte="svelte-1c3wnio"><meta name="${"msapplication-starturl"}"${add_attribute("content", url, 0)} data-svelte="svelte-1c3wnio"><meta name="${"theme-color"}"${add_attribute("content", site.colors.background, 0)} data-svelte="svelte-1c3wnio"><meta name="${"mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-1c3wnio"><meta name="${"application-name"}"${add_attribute("content", site.title, 0)} data-svelte="svelte-1c3wnio"><meta name="${"apple-mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-1c3wnio"><meta name="${"apple-mobile-web-app-status-bar-style"}" content="${"black-translucent"}" data-svelte="svelte-1c3wnio"><meta name="${"apple-mobile-web-app-title"}"${add_attribute("content", site.title, 0)} data-svelte="svelte-1c3wnio"><!-- HTML_TAG_START -->${serializeSchema({
    "@context": "https://schema.org/",
    "@type": "Person",
    "@id": `${$page.url.origin}/about`,
    url: $page.url,
    name: site.title,
    description: site.description,
    image: $page.url.origin + site.img.src,
    email: site.email,
    alumniOf: "Columbia University",
    jobTitle: site.job.title,
    worksFor: {
      "@type": "Organization",
      name: site.job.company
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "TX",
      addressCountry: "United States"
    },
    sameAs: [site.socials.github.url, site.socials.twitter.url, site.socials.linkedIn.url]
  })}<!-- HTML_TAG_END -->`, ""}`;
});
export { Meta as M };
