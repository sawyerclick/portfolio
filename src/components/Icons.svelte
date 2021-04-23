<script>
	import Icon from './helpers/Icon.svelte';
</script>

<a href="https://www.github.com/SawyerClick" title="Github">
	<Icon
		name="github"
		strokeWidth="2px"
		stroke="var(--blue)"
		width="1.75rem"
		height="1.75rem"
	/>
</a>
<a href="https://www.twitter.com/sawyerdabear" title="Twitter">
	<Icon
		name="twitter"
		strokeWidth="2px"
		stroke="var(--blue)"
		width="1.75rem"
		height="1.75rem"
	/>
</a>
<a href="mailto:sawyer@hey.com?Subject=Hi%20Sawyer" title="Email">
	<Icon
		name="mail"
		strokeWidth="2px"
		stroke="var(--blue)"
		width="1.75rem"
		height="1.75rem"
	/>
</a>

<style lang="scss">
	a {
		text-decoration: none;
		border-bottom: none;
	}
	:global(svg.feather) {
		margin: 0 0.5rem;
	}
	:global(svg.feather:first-of-type) {
		margin-left: 0;
	}
	:global(svg.feather:hover) {
		stroke: var(--pink);
	}
</style>
