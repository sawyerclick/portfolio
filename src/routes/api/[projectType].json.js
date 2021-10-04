import projects from '$data/projects.js';

export const get = async ({ params }) => {
	const { projectType } = params;

	const body = [...projects].filter((d) => d.type === projectType);

	return { body };
};
