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
  default: () => _layout
});
module.exports = __toCommonJS(stdin_exports);
var import_index_c7c5c175 = require("../../chunks/index-c7c5c175.js");
var import_Meta_c9cde41b = require("../../chunks/Meta-c9cde41b.js");
var import_stores_5ca0d853 = require("../../chunks/stores-5ca0d853.js");
var import_d3_interpolate = require("d3-interpolate");
var import_site_d2dd8573 = require("../../chunks/site-d2dd8573.js");
var app = "";
var font = "";
const _layout = (0, import_index_c7c5c175.c)(($$result, $$props, $$bindings, slots) => {
  return `${(0, import_index_c7c5c175.v)(import_Meta_c9cde41b.M, "Meta").$$render($$result, {}, {}, {})}



${slots.default ? slots.default({}) : ``}`;
});
