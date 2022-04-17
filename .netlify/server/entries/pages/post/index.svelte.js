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
  default: () => Post
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("../../../chunks/index-c7c5c175.js");
var import_Meta_c9cde41b = require("../../../chunks/Meta-c9cde41b.js");
var import_Footer_dd4547bd = require("../../../chunks/Footer-dd4547bd.js");
var import_stores_5ca0d853 = require("../../../chunks/stores-5ca0d853.js");
var import_d3_interpolate = require("d3-interpolate");
var import_site_d2dd8573 = require("../../../chunks/site-d2dd8573.js");
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: "a.svelte-qj49d7:hover .svelte-qj49d7{color:var(--secondary)}",
  map: null
};
const Post = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  $$result.css.add(css);
  return `${(0, import_index_c7c5c175.v)(import_Meta_c9cde41b.M, "Meta").$$render($$result, {
    meta: {
      title: "Post",
      description: "Thoughts, musings and otherwise dumb ideas I've had."
    }
  }, {}, {})}

<main class="${"max-w-lg mx-auto px-6 pt-12 min-h-screen"}"><article><header class="${"mb-8"}"><h1 class="${"text-xl font-semibold font-sans m-0 text-center text-shadow sm:text-6xl"}">musings
			</h1></header>

		${posts.length > 0 ? `<ul class="${"font-mono w-full flex flex-wrap gap-4"}">${(0, import_index_c7c5c175.f)(posts, ({ slug, date }) => {
    return `<li class="${"text-lg w-full font-light"}"><a href="${"/post/" + (0, import_index_c7c5c175.e)(slug)}" class="${"styled-border w-full flex justify-between svelte-qj49d7"}"><span class="${"svelte-qj49d7"}">&gt;\xA0<b class="${"svelte-qj49d7"}">${(0, import_index_c7c5c175.e)(slug)}</b></span>
							<time${(0, import_index_c7c5c175.b)("datetime", date, 0)} class="${"svelte-qj49d7"}">${(0, import_index_c7c5c175.e)(date.slice(0, 10))}
							</time></a>
					</li>`;
  })}</ul>` : `<p class="${"text-center"}">Nothing to see here. Move along.</p>`}</article></main>

${(0, import_index_c7c5c175.v)(import_Footer_dd4547bd.F, "Footer").$$render($$result, {}, {}, {})}`;
});
