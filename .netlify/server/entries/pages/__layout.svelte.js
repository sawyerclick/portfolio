import { c as create_ssr_component, v as validate_component } from "../../chunks/index-41e31554.js";
import { M as Meta } from "../../chunks/Meta-6753a13e.js";
import "../../chunks/stores-23c3d2a2.js";
import "d3-interpolate";
import "../../chunks/site-c2672eee.js";
var app = "";
var font = "";
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Meta, "Meta").$$render($$result, {}, {}, {})}



${slots.default ? slots.default({}) : ``}`;
});
export { _layout as default };
