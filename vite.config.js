import { sveltekit } from '@sveltejs/kit/vite';
import dsv from '@rollup/plugin-dsv';
import yaml from '@rollup/plugin-yaml';
import { autoType } from 'd3';

/** @type {import('vite').UserConfig} */
export default {
	plugins: [dsv({ processRow: autoType }), yaml(), sveltekit()]
};
