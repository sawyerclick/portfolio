import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// extensions: mdsvexConfig.extensions,
	preprocess: [
		vitePreprocess({
			script: true,
			style: true
		})
	],
	kit: {
		adapter: adapter(),
		prerender: {
			crawl: true,
			origin: 'https://sawyer.codes'
		}
	}
};
