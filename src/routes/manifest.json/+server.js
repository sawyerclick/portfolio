import { json } from '@sveltejs/kit';
import site from '$lib/data/site';

export const GET = async () => {
	return json({
		name: site.title,
		short_name: site.title,
		description: site.description,
		dir: 'auto',
		lang: 'en-US',
		display: 'minimal-ui',
		orientation: 'any',
		scope: '/',
		start_url: '.',
		background_color: site.colors.background,
		theme_color: site.colors.theme,
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
		]
	});
};
