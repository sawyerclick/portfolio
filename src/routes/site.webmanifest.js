import site from '$lib/data/site';

export const get = async () => {
	return {
		body: {
			name: site.title,
			short_name: site.title,
			description: site.description,
			start_url: '/',
			icons: [
				{
					src: '/android-chrome-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'any maskable'
				},
				{
					src: '/android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any maskable'
				}
			],
			theme_color: '#ff00ff',
			background_color: '#f8f8f8',
			display: 'standalone'
		}
	};
};
