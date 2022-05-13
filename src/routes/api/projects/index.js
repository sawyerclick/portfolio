import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d) => {
	d.slug = slugify(d.title, { lowercase: true });
});

export const get = async () => {
	return {
		body: {
			all: projects,
			pinned: projects.filter(({ pinned }) => pinned),
			recent: projects.filter(
				({ lead, img, type, pinned }) => !pinned && type === 'graphics' && lead && img
			)
		}
	};
};
