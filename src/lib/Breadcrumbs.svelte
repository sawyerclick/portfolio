<script>
	import { page } from '$app/stores';
	$: segments = $page.path.slice(1).split('/').slice(0, -1);
</script>

<nav class="text-blue align-middle" aria-label="Breadcrumbs">
	<a sveltekit:prefetch href="/">Sawyer Click</a>
	<span>/</span>
	{#each segments as segment, i}
		<a href={'/' + segments.slice(0, i + 1).join('/')} sveltekit:prefetch>{segment}</a>
		<span>/</span>
	{/each}
</nav>

<style lang="postcss">
	nav * {
		@apply inline-block;
	}
	a {
		@apply font-mono font-semibold uppercase tracking-widest leading-none mx-1 hover:underline;
	}
</style>
