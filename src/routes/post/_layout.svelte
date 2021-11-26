<script context="module">
	export async function load({ page }) {
		return {
			props: {
				slug: page.path
			}
		};
	}
</script>

<script>
	import { timeFormat, timeParse } from 'd3-time-format';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Meta from '$lib/Meta.svelte';
	import Nav from '$lib/Nav.svelte';

	import '$styles/font.css';
	import '$styles/app.postcss';
	import '$styles/post.postcss';

	export let title;
	export let created;
	export let updated;
	export let description;
	export let coverImagesUrl;
	export let relatedProjects;
	export let slug;

	const parse = (time) => timeFormat('%B %e, %Y')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));
</script>

<Meta meta={{ title, description, slug }} />

<Nav />

<main id="post" class="blog p-8 mt-4 max-w-2xl m-auto">
	<article>
		<section class="mb-8">
			<Breadcrumbs />
			<h1 class="text-5xl my-4">{title}</h1>
			<div class="font-mono relative border-t-1 border-b-1 border-blue">
				<a href="https://twitter.com/sawyerdabear">Sawyer Click</a>
				<span class="pointer-events-none">\\</span>
				<time datetime={created}>
					{parse(created)}
				</time>
			</div>
		</section>
		<section>
			<slot />
		</section>
	</article>
</main>
