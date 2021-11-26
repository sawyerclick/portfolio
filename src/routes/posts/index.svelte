<script context="module">
	export async function load({ page, fetch }) {
		const res = await fetch('/api/posts.json');
		const { posts } = await res.json();
		const slug = page.path;
		return {
			props: {
				posts,
				slug
			}
		};
	}
</script>

<script>
	import { timeFormat, timeParse } from 'd3-time-format';
	import Meta from '$lib/Meta.svelte';
	const parse = (time) => timeFormat('%Y-%m')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));
	export let posts = [],
		slug;
</script>

<Meta
	meta={{
		title: 'Posts',
		description: "Thoughts, musings and otherwise dumb ideas I've had.",
		slug
	}}
/>

<main class="max-w-lg mx-auto px-6">
	<nav class="left-2 top-2 static block text-center mt-12">
		<a class="styled-border text-lg" href="/" sveltekit:prefetch>home</a>
	</nav>

	<h1 class="font-serif text-5xl text-center mt-6 font-black tracking-wider">Sawyer's musings</h1>

	<ul class="font-mono mt-4 w-full">
		{#each posts as { slug, created }}
			<li class="text-lg w-full font-light ">
				<a href="/posts/{slug}" class="styled-border w-full flex justify-between">
					<span>&gt;&nbsp;<b>{slug}</b></span>
					<span>{parse(created)}</span>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style lang="postcss">
	a:hover * {
		color: var(--pink);
	}
</style>
