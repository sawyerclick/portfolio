/** @type {import('@sveltejs/kit').Config} */

import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import dsv from '@rollup/plugin-dsv';
import yaml from '@rollup/plugin-yaml';
import adapter from '@sveltejs/adapter-netlify';
import sveltePreprocess from 'svelte-preprocess';

const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [mdsvex(mdsvexConfig), sveltePreprocess({ postcss: true })],
	kit: {
		adapter: adapter(),
		prerender: {
			enabled: true,
			crawl: true,
			default: true
		},
		trailingSlash: 'never',
		vite: {
			plugins: [dsv(), yaml()]
		}
	}
};

export default config;
