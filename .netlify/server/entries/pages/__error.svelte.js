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
  default: () => _error,
  load: () => load
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("../../chunks/index-c7c5c175.js");
var import_Meta_c9cde41b = require("../../chunks/Meta-c9cde41b.js");
var import_Picture_2208c9cc = require("../../chunks/Picture-2208c9cc.js");
var import_stores_5ca0d853 = require("../../chunks/stores-5ca0d853.js");
var import_d3_interpolate = require("d3-interpolate");
var import_site_d2dd8573 = require("../../chunks/site-d2dd8573.js");
var RickRollPlaceholder = "/_app/assets/rickroll-38ef53d2.gif?format=jpg&width=400&blur=3";
var RickRollGif = "/_app/assets/rickroll-38ef53d2.gif?quality=75";
function load({ error, status }) {
  return {
    props: { err: `${status}: ${error.message}` }
  };
}
const _error = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { err = "Error loading page" } = $$props;
  if ($$props.err === void 0 && $$bindings.err && err !== void 0)
    $$bindings.err(err);
  return `${(0, import_index_c7c5c175.v)(import_Meta_c9cde41b.M, "Meta").$$render($$result, {
    meta: {
      title: "Whoops...",
      description: "Something went wrong."
    }
  }, {}, {})}

<div class="${"w-screen h-screen fixed pointer-events-none z-10"}">${(0, import_index_c7c5c175.v)(import_Picture_2208c9cc.I, "Image").$$render($$result, {
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
