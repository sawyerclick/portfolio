import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d) => {
	d.slug = slugify(d.title, { lowercase: true });
});

export const get = async ({ params: { slug } }) => {
	return {
		body: projects.find((d) => d.slug === slug) || {}
	};
};
