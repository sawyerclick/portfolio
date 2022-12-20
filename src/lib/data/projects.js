import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d) => (d.slug = slugify(d.title, { lowercase: true })));

export default {
	pinned: projects.filter(({ pinned }) => pinned),
	recent: projects.filter(
		({ show, img, type, pinned }) => !pinned && type === 'graphics' && show && img
	)
};
