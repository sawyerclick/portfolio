import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	onwarn: (warning, handler) => {
		if (warning.code === 'css-unused-selector') return;
		handler(warning);
	},
	preprocess: [
		vitePreprocess({
			script: true,
			style: true
		})
	],
	kit: {
		adapter: adapter({}),
		prerender: {
			crawl: true,
			origin: 'https://sawyer.codes'
		}
	}
};

export default config;
