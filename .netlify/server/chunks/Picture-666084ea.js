import { c as create_ssr_component, e as escape, a as add_attribute, n as null_to_empty } from "./index-41e31554.js";
var Image_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "img.svelte-n36gdo{transition:var(--transition,filter cubic-bezier(.4,0,.2,1) .3s)}img[data-loaded=false].svelte-n36gdo{filter:var(--filter,blur(10px))}",
  map: null
};
let loadingExists$1;
const loadAttributes$1 = (el) => {
  el.src = el.dataset.src;
  el.srcset = el.dataset.srcset;
  el.dataset.loaded = true;
};
if (typeof window !== "undefined") {
  loadingExists$1 = "loading" in HTMLImageElement.prototype;
  if (!loadingExists$1) {
    new IntersectionObserver((entries, observer) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          loadAttributes$1(target);
          observer.unobserve(target);
        }
      });
    }, { rootMargin: "200px 200px" });
  }
}
const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { loading = "lazy" } = $$props;
  let { alt = "" } = $$props;
  let { placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+fOvJAAI7AMKHxaZiQAAAABJRU5ErkJggg==" } = $$props;
  let { src = placeholder } = $$props;
  let { srcset = src } = $$props;
  let { sizes = "" } = $$props;
  let { draggable = true } = $$props;
  let { decoding = "async" } = $$props;
  let { classes = "" } = $$props;
  let { width = "100%" } = $$props;
  let { height = "100%" } = $$props;
  let { el = void 0 } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.srcset === void 0 && $$bindings.srcset && srcset !== void 0)
    $$bindings.srcset(srcset);
  if ($$props.sizes === void 0 && $$bindings.sizes && sizes !== void 0)
    $$bindings.sizes(sizes);
  if ($$props.draggable === void 0 && $$bindings.draggable && draggable !== void 0)
    $$bindings.draggable(draggable);
  if ($$props.decoding === void 0 && $$bindings.decoding && decoding !== void 0)
    $$bindings.decoding(decoding);
  if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0)
    $$bindings.classes(classes);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  $$result.css.add(css$1);
  return `


<img class="${escape(classes) + " svelte-lazy-loader svelte-n36gdo"}"${add_attribute("src", loading === "lazy" ? placeholder : src, 0)}${add_attribute("srcset", loading === "lazy" ? placeholder : srcset, 0)}${add_attribute("sizes", sizes, 0)}${add_attribute("alt", alt, 0)}${add_attribute("height", height, 0)}${add_attribute("width", width, 0)}${add_attribute("loading", loading, 0)}${add_attribute("decoding", decoding, 0)}${add_attribute("draggable", draggable, 0)}${add_attribute("data-src", src, 0)}${add_attribute("data-srcset", srcset || src, 0)} data-loaded="${"false"}"${add_attribute("this", el, 0)}>`;
});
var Picture_svelte_svelte_type_style_lang = "";
const css = {
  code: "picture.svelte-q4q00o{transition:var(--transition,filter cubic-bezier(.4,0,.2,1) .3s)}picture[data-loaded=false].svelte-q4q00o{filter:var(--filter,blur(10px))}",
  map: null
};
let loadingExists;
const loadAttributes = (el) => {
  const imgEl = el.querySelector("img");
  imgEl.src = imgEl.dataset.src;
  const sourceEls = el.querySelectorAll("source");
  sourceEls.forEach((sourceEl) => sourceEl.srcset = sourceEl.dataset.srcset);
  el.dataset.loaded = true;
};
if (typeof window !== "undefined") {
  loadingExists = "loading" in HTMLImageElement.prototype;
  if (!loadingExists) {
    new IntersectionObserver((entries, observer) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          loadAttributes(target);
          observer.unobserve(target);
        }
      });
    }, { rootMargin: "200px 200px" });
  }
}
const Picture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { loading = "lazy" } = $$props;
  let { alt = "" } = $$props;
  let { placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+fOvJAAI7AMKHxaZiQAAAABJRU5ErkJggg==" } = $$props;
  let { src = placeholder } = $$props;
  let { draggable = true } = $$props;
  let { decoding = "async" } = $$props;
  let { classes = "" } = $$props;
  let { width = "100%" } = $$props;
  let { height = "100%" } = $$props;
  let { el = void 0 } = $$props;
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.draggable === void 0 && $$bindings.draggable && draggable !== void 0)
    $$bindings.draggable(draggable);
  if ($$props.decoding === void 0 && $$bindings.decoding && decoding !== void 0)
    $$bindings.decoding(decoding);
  if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0)
    $$bindings.classes(classes);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  $$result.css.add(css);
  return `


<picture class="${escape(null_to_empty(classes)) + " svelte-q4q00o"}" data-loaded="${"false"}"${add_attribute("this", el, 0)}>${slots.default ? slots.default({}) : ``}
	<img${add_attribute("src", loading === "lazy" ? placeholder : src, 0)}${add_attribute("alt", alt, 0)}${add_attribute("height", height, 0)}${add_attribute("width", width, 0)}${add_attribute("loading", loading, 0)}${add_attribute("decoding", decoding, 0)}${add_attribute("draggable", draggable, 0)}${add_attribute("data-src", src, 0)}>
</picture>`;
});
export { Image as I, Picture as P };
