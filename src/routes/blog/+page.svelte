<script>
	import Meta from '$lib/components/furniture/Meta.svelte';
	export let posts = [];
</script>

<Meta
	meta={{
		title: 'Post',
		description: "Thoughts, musings and otherwise dumb ideas I've had."
	}}
/>

<main class="max-w-lg mx-auto px-6 pt-12 min-h-screen">
	<article>
		<header class="mb-8">
			<h1 class="text-xl font-semibold font-sans m-0 text-center text-shadow sm:text-6xl">
				musings
			</h1>
		</header>

		{#if posts.length > 0}
			<ul class="font-mono w-full flex flex-wrap gap-4">
				{#each posts as { slug, date }}
					<li class="text-lg w-full font-light">
						<a href="/blog/{slug}" class="styled-border w-full flex justify-between">
							<span>&gt;&nbsp;<b>{slug}</b></span>
							<time datetime={date}>
								{date.slice(0, 10)}
							</time>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-center">Nothing to see here. Move along.</p>
		{/if}
	</article>
</main>

<style lang="postcss">
	a:hover * {
		color: var(--secondary);
	}
</style>
