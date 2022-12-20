import site from '$lib/site';

export const trailingSlash = 'never';

/** @type {import('./$types').LayoutLoad} */
export const load = () => {
	return {
		...site
	};
};
