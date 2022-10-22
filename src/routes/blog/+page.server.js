// throw new Error("@migration task: Update +page.server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");

import pMap from 'p-map';
import { basename } from 'path';

export const GET = async () => {
	const modules = Object.entries(import.meta.glob('../../blog/*.svelte.md'));

	const posts = await pMap(modules, async ([filename, module]) => {
		const { metadata } = await module();

		return {
			...metadata,
			slug: basename(filename, '.svelte.md')
		};
	});

	posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return posts;
};
