<script>
	import Icon from '$lib/helpers/Icon.svelte';
	const size = '1.5rem';
	const width = size;
	const height = size;
	const strokeWidth = '2px';
	const stroke = 'var(--blue)';

	const props = {
		width,
		height,
		strokeWidth,
		stroke
	};
</script>

<a href="https://www.github.com/SawyerClick" title="Github">
	<Icon name="github" {...props} />
</a>
<a href="https://www.twitter.com/sawyerdabear" title="Twitter">
	<Icon name="twitter" {...props} />
</a>
<a href="mailto:sawyer@hey.com?Subject=Hi%20Sawyer" title="Email">
	<Icon name="mail" {...props} />
</a>

<!-- <a href="/posts" sveltekit:prefetch title="Posts">
	<Icon name="edit-3" {...props} />
</a> -->
<style lang="postcss">
	a {
		@apply no-underline border-none inline-block transition-all mx-1 last-of-type:mr-0 first-of-type:ml-0;
	}
	:global(svg.feather) {
		margin: 0 0.5rem;
	}
	:global(svg.feather:first-of-type) {
		margin-left: 0;
	}
	:global(svg.feather:not(.feather-chevron-down):hover) {
		stroke: var(--pink);
	}
</style>
