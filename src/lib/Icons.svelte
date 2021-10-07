<script>
	import Icon from '$Icon';
</script>

<a href="https://www.github.com/SawyerClick" title="Github">
	<Icon name="github" strokeWidth="2px" stroke="var(--blue)" width="1.5rem" height="1.5rem" />
</a>
<a href="https://www.twitter.com/sawyerdabear" title="Twitter">
	<Icon name="twitter" strokeWidth="2px" stroke="var(--blue)" width="1.5rem" height="1.5rem" />
</a>
<a href="mailto:sawyer@hey.com?Subject=Hi%20Sawyer" title="Email">
	<Icon name="mail" strokeWidth="2px" stroke="var(--blue)" width="1.5rem" height="1.5rem" />
</a>

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
	:global(svg.feather:hover) {
		stroke: var(--pink);
	}
</style>
