import dsv from '@rollup/plugin-dsv';
import yaml from '@rollup/plugin-yaml';
import { sveltekit } from '@sveltejs/kit/vite';
import { autoType } from 'd3';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [dsv({ processRow: autoType }), yaml(), sveltekit()]
};

export default config;
