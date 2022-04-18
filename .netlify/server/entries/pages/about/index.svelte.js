import { c as create_ssr_component, a as add_attribute, e as escape, d as each, v as validate_component } from "../../../chunks/index-41e31554.js";
import { F as Footer } from "../../../chunks/Footer-502035ad.js";
import { s as site } from "../../../chunks/site-c2672eee.js";
var post = "";
const About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main id="${"post"}" class="${"post p-8 mt-0 max-w-2xl m-auto min-h-screen"}"><a href="${"/"}" class="${"inline-block font-light leading-none styled-border px-2 py-2 text-sm hover:-skew-x-12 hover:transition-all focus:transition-all focus:-skew-x-12"}">\u2190 home
	</a>

	<h2 class="${"font-semibold tracking-tight mt-8 text-5xl"}">Hi! I&#39;m Sawyer.</h2>

	<p class="${"body"}">I&#39;m a data and graphics journalist living in Dripping Springs, Texas. My speciality is weaving
		narratives into data-driven graphics and front-end development. I work at <a class="${"text-link"}" rel="${"external"}"${add_attribute("href", site.job.link, 0)}>${escape(site.job.company)}</a>
		as a ${escape(site.job.title)}.
	</p>

	<p class="${"body"}">I&#39;ve worked at Business Insider, The Wall Street Journal and NBC News. I&#39;ve briefly freelanced
		for <a class="${"text-link"}" href="${"https://www.dallasnews.com/joppa"}" rel="${"external"}">The Dallas Morning News</a>
		and
		<a class="${"text-link"}" href="${"https://observablehq.com/@sawyerclick/impds-complaints-allegations-and-demographics"}" rel="${"external"}">NYU&#39;s Criminal Justice Lab</a>.
	</p>

	<p class="${"body"}">Here are a few of my skills:</p>

	<ul class="${"list-chevron marker:text-secondary list-inside"}">${each(["Svelte", "D3.js", "GSAP", "Python/Pandas", "SQL", "QGIS/Mapshaper"], (skill) => {
    return `<li><!-- HTML_TAG_START -->${skill}<!-- HTML_TAG_END --></li>`;
  })}</ul>

	<p class="${"body"}">Here are a few of my interests:</p>

	<ul class="${"list-chevron marker:text-secondary list-inside"}">${each(["Mechanical keyboards", "Reading", "Punk music"], (interest) => {
    return `<li><!-- HTML_TAG_START -->${interest}<!-- HTML_TAG_END --></li>`;
  })}</ul>

	${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</main>`;
});
export { About as default };
