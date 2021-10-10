/** @type {import('@sveltejs/kit').Config} */
import path from 'path';
import svg from 'vite-plugin-svgstring';
import dsv from '@rollup/plugin-dsv';
import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

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
		adapter: adapter({ pages: 'docs' }),
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$posts: path.resolve('./src/posts'),
					$lib: path.resolve('./src/lib'),
					$data: path.resolve('./src/data'),
					$actions: path.resolve('./src/actions'),
					$utils: path.resolve('./src/utils'),
					$stores: path.resolve('./src/stores.js'),
					$styles: path.resolve('./src/styles')
				}
			},
			plugins: [dsv(), svg()]
		}
	}
};

export default config;
