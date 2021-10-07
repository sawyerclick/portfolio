<script>
	import '$styles/app.postcss';
	import '$styles/font.css';
	import '$styles/blog.postcss';
	import { timeFormat, timeParse } from 'd3-time-format';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Nav from '$lib/Nav.svelte';
	import Icon from '$Icon';
	export let title;
	export let created;
	export let updated;
	export let summary;
	export let coverImagesUrl;
	export let relatedProjects;

	const parse = (time) => timeFormat('%B %e, %Y')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));
</script>

<svelte:head>
	<title>{title} - Blog - Sawyer Click</title>
</svelte:head>

<Nav />

<main class="blog p-8 mt-4 max-w-2xl m-auto">
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
				<!-- <span class="float-right leading-snug hover:text-peach">
					<Icon name="share" width=".875rem" height=".875rem" stroke="var(--blue)" />
				</span> -->
			</div>
		</section>
		<section>
			<slot />
		</section>
	</article>
	<hr />
</main>
