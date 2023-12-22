<script>
	import { page } from '$app/stores';
	$: segments = $page.url.pathname.slice(1).split('/').slice(0, -1);
</script>

<nav class="text-primary align-middle" aria-label="Breadcrumbs">
	<a data-sveltekit-preload-data="hover" href="/">Sawyer Click</a>
	<span>/</span>
	{#each segments as segment, i}
		<a href={'/' + segments.slice(0, i + 1).join('/')} data-sveltekit-preload-data="hover"
			>{segment}</a
		>
		<span>/</span>
	{/each}
</nav>

<style lang="postcss">
	nav * {
		@apply inline-block;
	}
	a {
		@apply font-gothic font-semibold uppercase tracking-widest leading-none mx-1 hover:underline;
	}
</style>
