<script>
	import { GithubIcon, TwitterIcon, MailIcon, Edit3Icon } from 'svelte-feather-icons';

	export let size = '26';
</script>

<ul class="inline-block">
	<li class="inline-block mx-1 py-2 last-of-type:mr-0 first-of-type:ml-0">
		<a
			class="inline-block styled-border profile-icon"
			href="https://www.github.com/SawyerClick"
			title="Github"
		>
			<GithubIcon {size} />
		</a>
	</li>
	<li class="inline-block mx-1 py-2 last-of-type:mr-0 first-of-type:ml-0">
		<a
			class="inline-block styled-border profile-icon"
			href="https://www.twitter.com/sawyerdabear"
			title="Twitter"
		>
			<TwitterIcon {size} />
		</a>
	</li>
	<li class="inline-block mx-1 py-2 last-of-type:mr-0 first-of-type:ml-0">
		<a class="inline-block styled-border profile-icon" href="mailto:sawyer@hey.com" title="Email">
			<MailIcon {size} />
		</a>
	</li>
</ul>
