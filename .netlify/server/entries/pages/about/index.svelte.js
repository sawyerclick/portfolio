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
  default: () => About
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("../../../chunks/index-c7c5c175.js");
var import_Footer_dd4547bd = require("../../../chunks/Footer-dd4547bd.js");
var import_site_d2dd8573 = require("../../../chunks/site-d2dd8573.js");
var post = "";
const About = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  return `<main id="${"post"}" class="${"post p-8 mt-0 max-w-2xl m-auto min-h-screen"}"><a href="${"/"}" class="${"inline-block font-light leading-none styled-border px-2 py-2 text-sm hover:-skew-x-12 hover:transition-all focus:transition-all focus:-skew-x-12"}">\u2190 home
	</a>

	<h2 class="${"font-semibold tracking-tight mt-8 text-5xl"}">Hi! I&#39;m Sawyer.</h2>

	<p class="${"body"}">I&#39;m a data and graphics journalist living in Dripping Springs, Texas. My speciality is weaving
		narratives into data-driven graphics and front-end development. I work at <a class="${"text-link"}" rel="${"external"}"${(0, import_index_c7c5c175.b)("href", import_site_d2dd8573.s.job.link, 0)}>${(0, import_index_c7c5c175.e)(import_site_d2dd8573.s.job.company)}</a>
		as a ${(0, import_index_c7c5c175.e)(import_site_d2dd8573.s.job.title)}.
	</p>

	<p class="${"body"}">I&#39;ve worked at Business Insider, The Wall Street Journal and NBC News. I&#39;ve briefly freelanced
		for <a class="${"text-link"}" href="${"https://www.dallasnews.com/joppa"}" rel="${"external"}">The Dallas Morning News</a>
		and
		<a class="${"text-link"}" href="${"https://observablehq.com/@sawyerclick/impds-complaints-allegations-and-demographics"}" rel="${"external"}">NYU&#39;s Criminal Justice Lab</a>.
	</p>

	<p class="${"body"}">Here are a few of my skills:</p>

	<ul class="${"list-chevron marker:text-secondary list-inside"}">${(0, import_index_c7c5c175.f)(["Svelte", "D3.js", "GSAP", "Python/Pandas", "SQL", "QGIS/Mapshaper"], (skill) => {
    return `<li><!-- HTML_TAG_START -->${skill}<!-- HTML_TAG_END --></li>`;
  })}</ul>

	<p class="${"body"}">Here are a few of my interests:</p>

	<ul class="${"list-chevron marker:text-secondary list-inside"}">${(0, import_index_c7c5c175.f)(["Mechanical keyboards", "Reading", "Punk music"], (interest) => {
    return `<li><!-- HTML_TAG_START -->${interest}<!-- HTML_TAG_END --></li>`;
  })}</ul>

	${(0, import_index_c7c5c175.v)(import_Footer_dd4547bd.F, "Footer").$$render($$result, {}, {}, {})}</main>`;
});
