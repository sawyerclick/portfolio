import { json } from '@sveltejs/kit';
import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d: Project) => {
	d.slug = slugify(d.title, { lower: true });
});

export const GET = async () => {
	return json({
		all: projects,
		feature: projects[0],
		recent: projects.filter((d: Project) => !d.pinned && d.type === 'graphics' && d.show && d.img)
	});
};
