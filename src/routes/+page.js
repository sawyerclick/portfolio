export const load = async ({ fetch }) => {
	const projects = await fetch('/api/projects');
	const awards = await fetch('/api/awards');
	const openSource = await fetch('/api/open-source');

	return {
		projects: projects.ok && (await projects.json()),
		awards: awards.ok && (await awards.json()),
		openSource: openSource.ok && (await openSource.json())
	};
};
