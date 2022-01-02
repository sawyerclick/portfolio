<script>
	import { onDestroy, onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { hasNav } from '$lib/stores';
	import {
		GithubIcon,
		TwitterIcon,
		MailIcon,
		ExternalLinkIcon,
		SunIcon,
		MoonIcon
	} from 'svelte-feather-icons';
	import { theme } from '$lib/stores';

	let scrollY = 0;
	onMount(() => {
		hasNav.set(true);
		document.body.classList.add('has-nav');
	});

	onDestroy(() => {
		hasNav.set(false);
	});

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

	$: showExpanded = scrollY === 0 && $page.path === '/';
</script>

<svelte:window bind:scrollY />

<nav class="sm:px-4 header pr-2 px-2 w-full fixed bottom-0 z-50">
	<a
		sveltekit:prefetch
		href="/#home"
		class="inline-block uppercase text-shadow py-2 leading-none font-semibold tracking-tighter font-sans text-5xl text-primary -skew-x-12 duration-150 ease-out dark:text-accent hover:transition-all hover:tracking-widest"
		class:text-xl={!showExpanded}
	>
		Sawyer Click
	</a>

	{#if showExpanded}
		<div transition:slide|local={{ easing: quintOut, duration: 400 }}>
			<a
				href="https://www.businessinsider.com/category/sawyer-click"
				target="_blank"
				rel="external"
				class="styled-border inline-block text-base sm:text-lg w-full font-light leading-tight m-0 md:w-2/5"
			>
				develops data viz at Business Insider
				<ExternalLinkIcon size="14" />
			</a>

			<div class="flex justify-between items-center">
				<ul class="inline-block">
					{#each links as { title, url, icon }}
						<li class="inline-block mx-1 last-of-type:mr-0 first-of-type:ml-0">
							<a class="inline-block styled-border leading-none px-2.5 py-1.5" href={url} {title}>
								<svelte:component this={icon} {size} />
							</a>
						</li>
					{/each}
				</ul>

				<button
					class="styled-border inline-block z-50 text-xl mb-2"
					aria-label="{$theme === 'dark' ? 'light' : 'dark'} mode"
					on:click={() => theme.set($theme === 'dark' ? 'light' : 'dark')}
				>
					{#if $theme === 'dark'}
						<SunIcon size="26" />
					{:else}
						<MoonIcon size="26" />
					{/if}
				</button>
			</div>
		</div>
	{:else}
		<!-- <button
			class="block fixed right-4 bottom-2 -skew-x-12"
			in:fly={{ x: 50, delay: 300, easing: quintOut }}
		>
			<MenuIcon size="26" />
		</button> -->
		<button
			class="styled-border block fixed right-4 bottom-2 z-50 text-xl leading-none px-1 py-0.5"
			aria-label="{$theme === 'dark' ? 'light' : 'dark'} mode"
			on:click={() => theme.set($theme === 'dark' ? 'light' : 'dark')}
			in:fly={{ x: 50, delay: 300, easing: quintOut }}
		>
			{#if $theme === 'dark'}
				<SunIcon size="16" />
			{:else}
				<MoonIcon size="16" />
			{/if}
		</button>
	{/if}
</nav>
