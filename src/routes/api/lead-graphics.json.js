import projects from '$lib/data/projects';

export const get = async () => {
	const pinned = projects.filter(({ pinned }) => pinned === 'TRUE');
	const recent = projects.filter(
		({ lead, img, type, pinned }) =>
			pinned === 'FALSE' && type === 'graphics' && lead === 'TRUE' && img
	);

	return { body: { pinned, recent } };
};
