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
  default: () => Routes
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("../../chunks/index-c7c5c175.js");
var import_site_d2dd8573 = require("../../chunks/site-d2dd8573.js");
var import_stores_5ca0d853 = require("../../chunks/stores-5ca0d853.js");
var import_Picture_2208c9cc = require("../../chunks/Picture-2208c9cc.js");
var import_d3_scale = require("d3-scale");
var import_d3_random = require("d3-random");
var import_d3_force = require("d3-force");
var import_d3_force_boundary = require("d3-force-boundary");
var import_d3_interpolate = require("d3-interpolate");
var import_Footer_dd4547bd = require("../../chunks/Footer-dd4547bd.js");
var import_projects_3b51f19c = require("../../chunks/projects-3b51f19c.js");
var import_slugify = require("slugify");
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = import_index_c7c5c175.h) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if ((0, import_index_c7c5c175.i)(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = import_index_c7c5c175.h) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || import_index_c7c5c175.h;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
const ArrowRightIcon = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { size = "24" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${(0, import_index_c7c5c175.b)("width", size, 0)}${(0, import_index_c7c5c175.b)("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${(0, import_index_c7c5c175.b)("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-arrow-right " + (0, import_index_c7c5c175.e)(customClass)}"><line x1="${"5"}" y1="${"12"}" x2="${"19"}" y2="${"12"}"></line><polyline points="${"12 5 19 12 12 19"}"></polyline></svg>`;
});
const ExternalLinkIcon = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { size = "24" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${(0, import_index_c7c5c175.b)("width", size, 0)}${(0, import_index_c7c5c175.b)("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${(0, import_index_c7c5c175.b)("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-external-link " + (0, import_index_c7c5c175.e)(customClass)}"><path d="${"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}"></path><polyline points="${"15 3 21 3 21 9"}"></polyline><line x1="${"10"}" y1="${"14"}" x2="${"21"}" y2="${"3"}"></line></svg>`;
});
const MoonIcon = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { size = "24" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${(0, import_index_c7c5c175.b)("width", size, 0)}${(0, import_index_c7c5c175.b)("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${(0, import_index_c7c5c175.b)("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-moon " + (0, import_index_c7c5c175.e)(customClass)}"><path d="${"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"}"></path></svg>`;
});
const SunIcon = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { size = "24" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${(0, import_index_c7c5c175.b)("width", size, 0)}${(0, import_index_c7c5c175.b)("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${(0, import_index_c7c5c175.b)("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-sun " + (0, import_index_c7c5c175.e)(customClass)}"><circle cx="${"12"}" cy="${"12"}" r="${"5"}"></circle><line x1="${"12"}" y1="${"1"}" x2="${"12"}" y2="${"3"}"></line><line x1="${"12"}" y1="${"21"}" x2="${"12"}" y2="${"23"}"></line><line x1="${"4.22"}" y1="${"4.22"}" x2="${"5.64"}" y2="${"5.64"}"></line><line x1="${"18.36"}" y1="${"18.36"}" x2="${"19.78"}" y2="${"19.78"}"></line><line x1="${"1"}" y1="${"12"}" x2="${"3"}" y2="${"12"}"></line><line x1="${"21"}" y1="${"12"}" x2="${"23"}" y2="${"12"}"></line><line x1="${"4.22"}" y1="${"19.78"}" x2="${"5.64"}" y2="${"18.36"}"></line><line x1="${"18.36"}" y1="${"5.64"}" x2="${"19.78"}" y2="${"4.22"}"></line></svg>`;
});
const hasNav = writable(false);
const theme = writable("dark");
theme.subscribe((value) => {
});
readable(false, (set) => {
  const query = "(prefers-reduced-motion: no-preference)";
  const mediaQueryList = typeof window !== "undefined" ? window.matchMedia(query) : {};
  const onChange = () => set(!mediaQueryList.matches);
  if (typeof window !== "undefined") {
    mediaQueryList.addListener(onChange);
    onChange();
  }
  return () => {
    if (typeof window !== "undefined")
      mediaQueryList.removeListener(onChange);
  };
});
const Nav = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let scrolledOnHome;
  let $page, $$unsubscribe_page;
  let $theme, $$unsubscribe_theme;
  $$unsubscribe_page = (0, import_index_c7c5c175.d)(import_stores_5ca0d853.p, (value) => $page = value);
  $$unsubscribe_theme = (0, import_index_c7c5c175.d)(theme, (value) => $theme = value);
  let { size = "26" } = $$props;
  (0, import_index_c7c5c175.o)(() => hasNav.set(false));
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  scrolledOnHome = !!$page.url.pathname;
  $$unsubscribe_page();
  $$unsubscribe_theme();
  return `

<nav class="${"sm:px-4 header pr-2 px-2 w-full fixed bottom-0 z-50"}"><h1><a sveltekit:prefetch href="${"/#home"}" class="${[
    "inline-block uppercase text-shadow pt-2 leading-none font-semibold tracking-tighter font-sans text-3xl xs:text-5xl text-primary -skew-x-12 duration-150 ease-out dark:text-accent hover:transition-all hover:skew-x-12",
    (!scrolledOnHome ? "text-xl" : "") + " " + (scrolledOnHome ? "pb-2" : "")
  ].join(" ").trim()}">Sawyer Click
		</a></h1>

	${scrolledOnHome ? `<div><a${(0, import_index_c7c5c175.b)("href", import_site_d2dd8573.s.job.link, 0)} target="${"_blank"}" rel="${"external"}" class="${"styled-border inline-block text-base sm:text-lg w-full font-light leading-tight m-0 md:w-2/5"}">develops data viz at ${(0, import_index_c7c5c175.e)(import_site_d2dd8573.s.job.company)}
				${(0, import_index_c7c5c175.v)(ExternalLinkIcon, "ExternalLinkIcon").$$render($$result, { size: "14" }, {}, {})}</a>

			<div class="${"flex justify-between items-center"}"><ul class="${"inline-block"}">${(0, import_index_c7c5c175.f)(Object.values(import_site_d2dd8573.s.socials), ({ title, url, icon }) => {
    return `<li class="${"inline-block mx-1 last-of-type:mr-0 first-of-type:ml-0"}"><a class="${"inline-block styled-border leading-none px-2.5 py-1.5"}"${(0, import_index_c7c5c175.b)("href", url, 0)}${(0, import_index_c7c5c175.b)("title", title, 0)}>${(0, import_index_c7c5c175.v)(icon || import_index_c7c5c175.m, "svelte:component").$$render($$result, { size }, {}, {})}</a>
						</li>`;
  })}</ul>

				<button class="${"styled-border inline-block z-50 text-xl mb-2"}" aria-label="${(0, import_index_c7c5c175.e)($theme === "dark" ? "light" : "dark") + " mode"}">${$theme === "dark" ? `${(0, import_index_c7c5c175.v)(SunIcon, "SunIcon").$$render($$result, { size: "26" }, {}, {})}` : `${(0, import_index_c7c5c175.v)(MoonIcon, "MoonIcon").$$render($$result, { size: "26" }, {}, {})}`}</button></div></div>` : `
		<button class="${"styled-border block fixed right-4 bottom-2 z-50 text-xl leading-none px-1 py-0.5"}" aria-label="${(0, import_index_c7c5c175.e)($theme === "dark" ? "light" : "dark") + " mode"}">${$theme === "dark" ? `${(0, import_index_c7c5c175.v)(SunIcon, "SunIcon").$$render($$result, { size: "16" }, {}, {})}` : `${(0, import_index_c7c5c175.v)(MoonIcon, "MoonIcon").$$render($$result, { size: "16" }, {}, {})}`}</button>`}</nav>`;
});
var Picture_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".picture-wrapper img{height:100%;object-fit:cover;width:100%}",
  map: null
};
const Picture_1 = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { alt = "hello world" } = $$props;
  let { slug = "cloudkitchens-map" } = $$props;
  const sizes = [400, 600, 800, 1e3];
  const formats = ["avif", "webp", "jpeg"];
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css$1);
  return `${(0, import_index_c7c5c175.v)(import_Picture_2208c9cc.P, "Picture").$$render($$result, {
    placeholder: "/images/thumbnails/" + slug + "/blurred.jpeg",
    src: "/images/thumbnails/" + slug + "/400.jpeg",
    alt,
    loading: "lazy",
    decoding: "async",
    draggable: "false",
    classes: "object-cover object-center w-full h-full m-auto"
  }, {}, {
    default: () => {
      return `${(0, import_index_c7c5c175.f)(formats, (format) => {
        return `${(0, import_index_c7c5c175.f)(sizes, (size) => {
          return `<source data-srcset="${"/images/thumbnails/" + (0, import_index_c7c5c175.e)(slug) + "/" + (0, import_index_c7c5c175.e)(size) + "." + (0, import_index_c7c5c175.e)(format)}" type="${"image/" + (0, import_index_c7c5c175.e)(format)}">`;
        })}`;
      })}`;
    }
  })}`;
});
const Project = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { project } = $$props;
  const { link, img, alt, title, description } = project;
  if ($$props.project === void 0 && $$bindings.project && project !== void 0)
    $$bindings.project(project);
  return `<a class="${"group styled-border block h-full text-primary shadow-md relative z-100 p-0 grayscale-[80%] hover:z-40 hover:grayscale-0"}"${(0, import_index_c7c5c175.b)("href", link, 0)} target="${"_blank"}"${(0, import_index_c7c5c175.b)("title", description, 0)}><div class="${"flex justify-center items-end flex-row flex-wrap group"}"><div class="${"picture-wrapper h-60 w-full object-center object-cover overflow-hidden z-0 duration-150 group-hover:transition-all group-focus:transition-all"}">${(0, import_index_c7c5c175.v)(Picture_1, "Picture").$$render($$result, { slug: img, alt }, {}, {})}</div>
		<div class="${"absolute pointer-events-none h-full w-full flex justify-start items-end translate-x-2 p-3 opacity-0 will-change-transform transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0"}"><h3 class="${"pointer-events-auto font-semibold tracking-tighter text-lg text-center leading-none bg-accent p-2 border border-primary !text-primary shadow-md dark:!text-accent dark:bg-primary dark:border-accent"}">${(0, import_index_c7c5c175.e)(title)}</h3></div>
		
		
		
		</div></a>`;
});
const Grid = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  return `<ul class="${"w-full mx-auto grid px-6 py-4 gap-4 lg:gap-6 place-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}">${slots.default ? slots.default({}) : ``}</ul>`;
});
const Canvas = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let { width = 0 } = $$props;
  let { height = 0 } = $$props;
  let { center = false } = $$props;
  let { contextName = "canvas" } = $$props;
  let canvas;
  let pendingInvalidation = false;
  (0, import_index_c7c5c175.o)(() => {
  });
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.center === void 0 && $$bindings.center && center !== void 0)
    $$bindings.center(center);
  if ($$props.contextName === void 0 && $$bindings.contextName && contextName !== void 0)
    $$bindings.contextName(contextName);
  {
    (0, import_index_c7c5c175.s)(contextName, {
      register(fn) {
      },
      deregister(fn) {
      },
      invalidate() {
        if (pendingInvalidation)
          return;
        pendingInvalidation = true;
      }
    });
  }
  return `<canvas${(0, import_index_c7c5c175.b)("this", canvas, 0)}></canvas>
${slots.default ? slots.default({}) : ``}`;
});
const CanvasWrapper = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  let gravityStrengthScale;
  let centerPosition;
  let forces;
  let simulation;
  let width = 0;
  let height = 0;
  const graphics = (0, import_index_c7c5c175.a)("graphics");
  graphics.forEach((d) => d.r = Math.floor((0, import_d3_random.randomUniform)(40, 70)()));
  const dots = [
    ...graphics,
    {
      r: 200,
      publication: "myself",
      img: "me.jpeg"
    }
  ];
  let usedForceNames = [];
  gravityStrengthScale = (0, import_d3_scale.scalePow)().exponent(2).range([0, 1]).domain([0, 250]);
  centerPosition = [width / 2, height / 2];
  forces = [
    ["center", (0, import_d3_force.forceCenter)(...centerPosition)],
    ["x", (0, import_d3_force.forceX)(centerPosition[0]).strength((d) => gravityStrengthScale(d.r))],
    ["y", (0, import_d3_force.forceY)(centerPosition[1]).strength((d) => gravityStrengthScale(d.r))],
    ["charge", (0, import_d3_force.forceManyBody)().strength(0)],
    [
      "boundary",
      null
    ],
    ["collide", (0, import_d3_force.forceCollide)().radius((d) => d.r + 10)]
  ];
  simulation = (0, import_d3_force.forceSimulation)().nodes(dots).on("tick", () => [...dots]);
  {
    {
      forces.forEach(([name, force]) => simulation.force(name, force));
      const newForceNames = forces.map(([name]) => name);
      let oldForceNames = usedForceNames.filter((force) => !newForceNames.includes(force));
      oldForceNames.forEach((name) => simulation.force(name, null));
      usedForceNames = newForceNames;
      simulation.alpha(1).velocityDecay(0.85);
      simulation.restart();
    }
  }
  return `<div class="${"wrapper z-0 opacity-40 flex flex-col w-full h-full dark:mix-blend-lighten"}"><figure class="${"flex-1"}">${(0, import_index_c7c5c175.v)(Canvas, "Canvas").$$render($$result, { width, height }, {}, {
    default: () => {
      return `${``}`;
    }
  })}</figure></div>`;
});
var Carousel_svelte_svelte_type_style_lang = "";
const css = {
  code: "ul.svelte-12nif11::-webkit-scrollbar{height:.5rem}ul.svelte-12nif11::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity));border-radius:.75rem}.dark ul.svelte-12nif11::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(248 248 248/var(--tw-bg-opacity))}ul.svelte-12nif11::-webkit-scrollbar-track{background-color:initial;margin-left:.5rem;margin-right:.5rem}@media(min-width:640px){ul.svelte-12nif11::-webkit-scrollbar-track{margin-left:1.5rem;margin-right:1.5rem}}",
  map: null
};
const Carousel = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"w-full text-center overflow-x-hidden"}"><ul class="${"w-full mx-auto flex px-6 py-4 gap-4 place-items-start overflow-x-auto scroll-smooth snap-mandatory snap-x scroll-pl-2 sm:scroll-pl-6 [-webkit-overflow-scrolling:touch] svelte-12nif11"}">${slots.default ? slots.default({}) : ``}</ul>
</div>`;
});
var openSource = [
  {
    title: "svelte-lazy-loader",
    github: "https://github.com/sawyerclick/svelte-lazy-loader",
    link: "https://svelte-lazy-loader.sawyer.codes",
    description: "A component library for effortlessly loading media using a shared IntersectionObserver instance if native lazy-loading doesn't exist."
  },
  {
    title: "CMSvelte",
    github: "https://github.com/sawyerclick/CMSvelte",
    link: "https://sawyerclick.github.io/CMSvelte",
    description: "A Svelte starter template built with newsroom CMS's in mind. Dynamically create inline graphics based on the placement of figure elements with defined data-chart attributes."
  }
];
var awards = [
  {
    awardLink: "https://www.deadlineclub.org/2021-awards-winners/",
    awardName: "The Deadline Club's Newspaper or Digital Enterprise Reporting",
    projectLink: "https://www.nbcnews.com/specials/h2a-visa-program-for-farmworkers-surging-under-trump-and-labor-violations/",
    projectName: "Lured to America \u2013 Then Trapped"
  },
  {
    awardLink: "https://pudding.cool/process/pudding-cup-2020/",
    awardName: "The Pudding's Pudding Cup 2020, Honorable Mention",
    projectLink: "https://sawyerclick.github.io/punk/",
    projectName: "Is Punk Dead?"
  },
  {
    awardLink: "https://www.amazon.com/Storm-Upon-Us-Conspiracy-Everything/dp/1612199291",
    awardName: "Mike Rothschild's The Storm Is Upon Us: How QAnon Became a Movement, Cult, and Conspiracy Theory of Everything",
    projectLink: "https://www.businessinsider.com/every-qanon-message-q-drop-analyzed-2020-10",
    projectName: "We analyzed every message ever posted by 'Q,' the enigmatic persona that started the QAnon conspiracy theory"
  },
  {
    awardLink: "https://pudding.cool/process/pudding-cup-2021/",
    awardName: "The Pudding's Pudding Cup 2021, Honorable Mention",
    projectLink: "https://like-a-ritual.netlify.app/",
    projectName: "An Like a Ritual: An Audiovisual Ode to Title Fight "
  },
  {
    awardLink: "https://www.asme.media/american-society-of-magazine-editors-announces-finalists-for-2022-national-magazine-awards",
    awardName: "ASME's 2022 National Magazine Awards for Lifestyle Journalism, finalist",
    projectLink: "https://www.insider.com/lgbtq-cartoon-characters-kids-database-2021-06?page=see-the-data",
    projectName: "259 LGBTQ Characters in Cartoons That Bust the Myth That Kids Can't Handle Inclusion"
  }
];
const Routes = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  (0, import_index_c7c5c175.s)("graphics", [...import_projects_3b51f19c.p.pinned, ...import_projects_3b51f19c.p.recent]);
  let pageWidth = 300;
  return `

${(0, import_index_c7c5c175.v)(Nav, "Nav").$$render($$result, {}, {}, {})}

<main class="${"z-10 min-h-screen"}"><div id="${"home"}" class="${"h-screen min-h-screen flex justify-start items-end relative"}" style="${"height:100vh;"}"><div class="${"absolute inset-0 h-full min-h-screen w-full after:absolute after:z-1 after:right-0 after:bottom-0 after:left-0 after:h-24 after:w-full after:bg-gradient-to-t after:from-accent dark:after:from-primary"}">${(0, import_index_c7c5c175.v)(CanvasWrapper, "CanvasWrapper").$$render($$result, {}, {}, {})}</div></div>

	<section id="${"pinned"}" class="${"my-24"}"><header class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h2 class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Selected works
			</h2></header>

		${(0, import_index_c7c5c175.v)(Grid, "Grid").$$render($$result, {}, {}, {
    default: () => {
      return `${(0, import_index_c7c5c175.f)(import_projects_3b51f19c.p.pinned, (project) => {
        return `<li class="${"project relative w-full h-full"}">${(0, import_index_c7c5c175.v)(Project, "Project").$$render($$result, { project }, {}, {})}
				</li>`;
      })}`;
    }
  })}</section>

	<section id="${"recent"}" class="${"my-24"}"><header class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Recent works
			</h>
			<span class="${"sm:w-50 font-light text-right italic text-xs leading-none -skew-x-12"}">scroll for more
				${(0, import_index_c7c5c175.v)(ArrowRightIcon, "ArrowRightIcon").$$render($$result, { size: "14" }, {}, {})}</span></header>

		${(0, import_index_c7c5c175.v)(Carousel, "Carousel").$$render($$result, {}, {}, {
    default: () => {
      return `${(0, import_index_c7c5c175.f)(import_projects_3b51f19c.p.recent, (project) => {
        return `<li class="${"project snap-center shrink-0 max-w-[88vw] min-w-[150px] sm:snap-start"}">${(0, import_index_c7c5c175.v)(Project, "Project").$$render($$result, { project }, {}, {})}
				</li>`;
      })}`;
    }
  })}</section>

	<section id="${"open-source"}" class="${"my-24"}"><header class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h2 class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Open source
			</h2></header>

		${(0, import_index_c7c5c175.v)(Grid, "Grid").$$render($$result, {}, {}, {
    default: () => {
      return `${(0, import_index_c7c5c175.f)(openSource, ({ title, github, description }) => {
        return `<li class="${"h-full"}"><a class="${"styled-border no-hover-style block h-full text-xs group hover:text-secondary"}"${(0, import_index_c7c5c175.b)("href", github, 0)} target="${"_blank"}" rel="${"noopener noreferrer"}"><div class="${"flex justify-between items-center"}"><h3 class="${"my-2 pointer-events-auto font-bold tracking-tighter text-lg leading-none text-primary dark:text-accent group-hover:text-secondary"}">${(0, import_index_c7c5c175.e)(title)}</h3>
							${(0, import_index_c7c5c175.v)(import_site_d2dd8573.G, "GithubIcon").$$render($$result, { size: "1.75x" }, {}, {})}</div>
						<p class="${"body my-1"}">${(0, import_index_c7c5c175.e)(description)}</p></a>
				</li>`;
      })}`;
    }
  })}</section>

	<section id="${"awards"}" class="${"mt-24"}"><header class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h2 class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Awards &amp; more
			</h2></header>
		<div class="${"flex flex-col mx-0 px-6"}">${(0, import_index_c7c5c175.f)(awards, ({ awardLink, awardName, projectLink, projectName }, i) => {
    return `<article class="${"mt-6 flex flex-col sm:flex-row items-center"}"><div class="${"p-2"}"><a class="${"styled-border block body text-center sm:text-left"}"${(0, import_index_c7c5c175.b)("href", projectLink, 0)} target="${"_blank"}">${(0, import_index_c7c5c175.e)(projectName)}
						</a></div>
					<span class="${"font-bold text-2xl -skew-x-12 text-primary dark:text-white"}"><!-- HTML_TAG_START -->${"&#8595;"}<!-- HTML_TAG_END --></span>
					<div class="${"p-2"}"><a class="${"styled-border block body text-center sm:text-left"}"${(0, import_index_c7c5c175.b)("href", awardLink, 0)} target="${"_blank"}">${(0, import_index_c7c5c175.e)(awardName)}
						</a></div>

					${i < awards.length - 1 && pageWidth < 640 ? `<hr class="${"mt-6 w-64 max-w-[90%] m-auto border-primary dark:border-accent"}">` : ``}
				</article>`;
  })}</div></section></main>

${(0, import_index_c7c5c175.v)(import_Footer_dd4547bd.F, "Footer").$$render($$result, {}, {}, {})}`;
});
