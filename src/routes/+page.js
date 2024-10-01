import projects from '$lib/data/projects/index';
import openSource from '$lib/data/open-source/index';
import mentionables from '$lib/data/mentionables/index';

/** @type {import('./$types').PageLoad} */
export const load = async () => {
	return {
		projects: { all: projects, pinned: projects.pinned, recent: projects.recent },
		mentionables,
		openSource
	};
};
