import { json } from '@sveltejs/kit';
import site from '$lib/site';

export const GET = async () => {
	return json({
		name: site.title,
		short_name: site.tag || site.title,
		description: site.description,
		start_url: '/',
		icons: [
			{
				src: '/favicon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable any'
			},
			{
				src: '/favicon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable any'
			}
		],
		theme_color: site.colors.theme,
		background_color: site.colors.background,
		display: 'minimal-ui'
	});
};
