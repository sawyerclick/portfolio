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
  F: () => Footer
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("./index-c7c5c175.js");
const Footer = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  return `<footer class="${"text-center pt-0 max-w-full relative z-50 before:contents-[''] before:h-12 before:w-full before:block before:relative before:top-0 before:inset-x-0 before:bg-gradient-to-t before:from-accent before:dark:from-primary before:z-50"}"><div class="${"bg-accent dark:bg-primary w-full h-full pt-4"}"><p class="${"font-sans text-xs -skew-x-12 max-w-xs mx-auto"}">Made with \u2661 by <a href="${"https://www.twitter.com/sawyerdabear"}">Sawyer Click\u2197</a> in Dripping
			Springs, Texas
		</p></div></footer>`;
});
