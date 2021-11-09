import projects from '$data/projects';

export const get = async () => {
	const body = projects.filter(
		({ lead, img, type }) => type === 'graphics' && lead === 'TRUE' && img
	);

	return { body };
};
