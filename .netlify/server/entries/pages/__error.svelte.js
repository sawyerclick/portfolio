import { c as create_ssr_component, v as validate_component } from "../../chunks/index-41e31554.js";
import { M as Meta } from "../../chunks/Meta-6753a13e.js";
import { I as Image } from "../../chunks/Picture-666084ea.js";
import "../../chunks/stores-23c3d2a2.js";
import "d3-interpolate";
import "../../chunks/site-c2672eee.js";
var RickRollPlaceholder = "/_app/assets/rickroll-38ef53d2.gif?format=jpg&width=400&blur=3";
var RickRollGif = "/_app/assets/rickroll-38ef53d2.gif?quality=75";
function load({ error, status }) {
  return {
    props: { err: `${status}: ${error.message}` }
  };
}
const _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { err = "Error loading page" } = $$props;
  if ($$props.err === void 0 && $$bindings.err && err !== void 0)
    $$bindings.err(err);
  return `${validate_component(Meta, "Meta").$$render($$result, {
    meta: {
      title: "Whoops...",
      description: "Something went wrong."
    }
  }, {}, {})}

<div class="${"w-screen h-screen fixed pointer-events-none z-10"}">${validate_component(Image, "Image").$$render($$result, {
    placeholder: RickRollPlaceholder,
    src: RickRollGif,
    alt: "A gif of the iconic Rick Astley dancing to his song 'Never Gonna Give You Up' in the titular music video",
    classes: "w-full h-full object-center object-cover"
  }, {}, {})}</div>

<main class="${"absolute flex flex-nowrap flex-col justify-center items-center w-screen h-screen p-12 text-center z-20"}"><h2 class="${"font-sans text-3xl sm:text-5xl font-bold mt-8 text-bg text-accent -skew-x-12"}">Whoops...
	</h2>
	<p class="${"font-sans font-bold mt-6 text-2xl sm:text-5xl text-bg text-accent -skew-x-12"}">something went wrong
	</p>
	<a sveltekit:prefetch href="${"/"}" class="${"styled-border font-sans mt-8 px-3 py-1 sm:text-2xl -skew-x-12"}">Go home?
	</a></main>

${``}`;
});
export { _error as default, load };
