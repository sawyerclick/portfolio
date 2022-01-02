<script>
	import { GithubIcon, TwitterIcon, MailIcon, Edit3Icon } from 'svelte-feather-icons';

	const links = [
		{
			title: 'Github',
			url: 'https://www.github.com/SawyerClick',
			icon: GithubIcon
		},
		{
			title: 'Twitter',
			url: 'https://www.twitter.com/sawyerdabear',
			icon: TwitterIcon
		},
		{
			title: 'Email',
			url: 'mailto:sawyer@hey.com',
			icon: MailIcon
		}
	];

	export let size = '26';
</script>

<ul class="inline-block">
	{#each links as { title, url, icon }}
		<li class="inline-block mx-1 last-of-type:mr-0 first-of-type:ml-0">
			<a class="inline-block styled-border leading-none px-2 py-1.5" href={url} {title}>
				<svelte:component this={icon} {size} />
			</a>
		</li>
	{/each}
</ul>
