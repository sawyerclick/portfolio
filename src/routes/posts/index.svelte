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

<main class="max-w-md mx-auto px-6">
	<div class="sm:fixed sm:mt-0 left-2 top-2 static block text-center mt-12">
		<a
			href="/"
			sveltekit:prefetch
			class="mx-auto font-mono inline-block text-lg leading-none font-light border-blue border rounded-sm p-1"
		>
			🏠 home
		</a>
	</div>
	<h1 class="font-serif text-4xl text-center mt-4 sm:mt-16 font-black tracking-wider">
		Sawyer's musings
	</h1>

	<ul class="font-mono mt-4 w-full">
		{#each posts as { slug, created }}
			<li class="text-lg w-full font-light">
				<a href="/posts/{slug}" class="w-full flex justify-between">
					<span>&gt; <b>{slug}</b></span>
					<span>{parse(created)}</span>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style lang="postcss">
	li a {
		@apply border-b-1 border-transparent;
	}
	a:hover {
		@apply no-underline border-pink;
	}
	a:hover * {
		color: var(--pink);
	}
</style>
