import { json } from '@sveltejs/kit';
import slugify from 'slugify';
import projects from '$lib/data/projects.yaml';

export const GET = async ({ params: { slug } }) => {
	return new json(projects.find((d) => slugify(d.title, { lowercase: true }) === slug) || {});
};
