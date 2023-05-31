/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
	const [projects, awards, openSource] = await Promise.all([
		fetch('/api/projects'),
		fetch('/api/awards'),
		fetch('/api/open-source')
	]);

	return {
		// specific page data
		projects: projects.ok && (await projects.json()),
		awards: awards.ok && (await awards.json()),
		openSource: openSource.ok && (await openSource.json())
	};
};
