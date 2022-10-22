import projects from '$lib/data/projects.yaml';
import slugify from 'slugify';

projects.forEach((d) => {
	d.slug = slugify(d.title, { lowercase: true });
});

export const GET = async ({ params: { slug } }) => {
	// throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
	// Suggestion (check for correctness before using):
	return new Response(projects.find((d) => d.slug === slug) || {});
	// return {
	// 	body: projects.find((d) => d.slug === slug) || {}
	// };
};
