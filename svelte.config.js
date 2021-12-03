/** @type {import('@sveltejs/kit').Config} */
import { mdsvex } from 'mdsvex';
import { imagetools } from 'vite-imagetools';
import path from 'path';
import dsv from '@rollup/plugin-dsv';
import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';

const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig),
		sveltePreprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$actions: path.resolve('./src/actions'),
					$assets: path.resolve('./src/assets'),
					$data: path.resolve('./src/data'),
					$lib: path.resolve('./src/lib'),
					$blog: path.resolve('./src/blog'),
					$utils: path.resolve('./src/utils'),
					$stores: path.resolve('./src/stores.js'),
					$styles: path.resolve('./src/styles')
				}
			},
			plugins: [dsv(), imagetools({ force: true })]
		}
	}
};

export default config;
