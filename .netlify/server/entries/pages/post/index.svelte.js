import { c as create_ssr_component, v as validate_component, d as each, e as escape, a as add_attribute } from "../../../chunks/index-41e31554.js";
import { M as Meta } from "../../../chunks/Meta-6753a13e.js";
import { F as Footer } from "../../../chunks/Footer-502035ad.js";
import "../../../chunks/stores-23c3d2a2.js";
import "d3-interpolate";
import "../../../chunks/site-c2672eee.js";
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: "a.svelte-qj49d7:hover .svelte-qj49d7{color:var(--secondary)}",
  map: null
};
const Post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  $$result.css.add(css);
  return `${validate_component(Meta, "Meta").$$render($$result, {
    meta: {
      title: "Post",
      description: "Thoughts, musings and otherwise dumb ideas I've had."
    }
  }, {}, {})}

<main class="${"max-w-lg mx-auto px-6 pt-12 min-h-screen"}"><article><header class="${"mb-8"}"><h1 class="${"text-xl font-semibold font-sans m-0 text-center text-shadow sm:text-6xl"}">musings
			</h1></header>

		${posts.length > 0 ? `<ul class="${"font-mono w-full flex flex-wrap gap-4"}">${each(posts, ({ slug, date }) => {
    return `<li class="${"text-lg w-full font-light"}"><a href="${"/post/" + escape(slug)}" class="${"styled-border w-full flex justify-between svelte-qj49d7"}"><span class="${"svelte-qj49d7"}">&gt;\xA0<b class="${"svelte-qj49d7"}">${escape(slug)}</b></span>
							<time${add_attribute("datetime", date, 0)} class="${"svelte-qj49d7"}">${escape(date.slice(0, 10))}
							</time></a>
					</li>`;
  })}</ul>` : `<p class="${"text-center"}">Nothing to see here. Move along.</p>`}</article></main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
export { Post as default };
