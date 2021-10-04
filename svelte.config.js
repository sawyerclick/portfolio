/** @type {import('@sveltejs/kit').Config} */
import path from 'path';
import svg from 'vite-plugin-svgstring';
import dsv from '@rollup/plugin-dsv';
import adapter from '@sveltejs/adapter-netlify';
import sveltePreprocess from 'svelte-preprocess';

const config = {
	preprocess: sveltePreprocess({
		postcss: true
	}),
	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$lib: path.resolve('./src/lib'),
					$Icon: path.resolve('./src/lib/helpers/Icon.svelte'),
					$data: path.resolve('./src/data'),
					$actions: path.resolve('./src/actions'),
					$stores: path.resolve('./src/stores.js')
				}
			},
			plugins: [dsv(), svg()]
		}
	}
};

export default config;
