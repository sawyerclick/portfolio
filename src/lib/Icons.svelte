<script>
	import { GithubIcon, TwitterIcon, MailIcon } from 'svelte-feather-icons';

	export let size = '26';
</script>

<ul class="inline">
	<li>
		<a class="styled-border profile-icon" href="https://www.github.com/SawyerClick" title="Github">
			<GithubIcon {size} />
		</a>
	</li>
	<li>
		<a
			class="styled-border profile-icon"
			href="https://www.twitter.com/sawyerdabear"
			title="Twitter"
		>
			<TwitterIcon {size} />
		</a>
	</li>
	<li>
		<a
			class="styled-border profile-icon"
			href="mailto:sawyer@hey.com?Subject=Hi%20Sawyer"
			title="Email"
		>
			<MailIcon {size} />
		</a>
	</li>
</ul>

<!-- <a href="/post" sveltekit:prefetch title="Posts">
	<Icon name="edit-3" {...props} />
</a> -->
<style lang="postcss">
	li {
		@apply inline-block mx-1 last-of-type:mr-0 first-of-type:ml-0;
	}
	:global(svg.feather) {
		@apply m-0 mb-2 transition-all duration-500;
	}
	:global(svg.feather:first-of-type) {
		margin-left: 0;
	}
</style>
