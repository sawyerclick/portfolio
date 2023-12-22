import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	onwarn: (warning, handler) => {
		if (warning.code === 'css-unused-selector') return;
		handler(warning);
	},

	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),
		prerender: {
			crawl: true,
			origin: 'https://sawyer.codes'
		}
	}
};

export default config;
