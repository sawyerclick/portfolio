import adapter from '@sveltejs/adapter-netlify';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// extensions: mdsvexConfig.extensions,
	preprocess: [
		sveltePreprocess({
			postcss: true,
			preserve: ['ld+json']
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

export default config;
