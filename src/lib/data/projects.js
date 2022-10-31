import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d) => {
	d.slug = slugify(d.title, { lowercase: true });
});

const pinned = projects.filter(({ pinned }) => pinned);

const recent = projects.filter(
	({ show, img, type, pinned }) => !pinned && type === 'graphics' && show && img
);

export default { pinned, recent };
