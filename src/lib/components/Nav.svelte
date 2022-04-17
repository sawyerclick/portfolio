<script>
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ExternalLinkIcon, SunIcon, MoonIcon } from 'svelte-feather-icons';
	import { hasNav, theme } from '$lib/stores';
	import site from '$lib/data/site.js';

	export let size = '26';

	let scrollY = 0;

	onMount(() => {
		hasNav.set(true);
		document.body.classList.add('has-nav');
	});

	onDestroy(() => hasNav.set(false));

	$: scrolledOnHome = !scrollY && !!$page.url.pathname;
</script>

<svelte:window bind:scrollY />

<nav class="sm:px-4 header pr-2 px-2 w-full fixed bottom-0 z-50">
	<h1>
		<a
			sveltekit:prefetch
			href="/#home"
			class="inline-block uppercase text-shadow pt-2 leading-none font-semibold tracking-tighter font-sans text-3xl xs:text-5xl text-primary -skew-x-12 duration-150 ease-out dark:text-accent hover:transition-all hover:skew-x-12"
			class:text-xl={!scrolledOnHome}
			class:pb-2={scrolledOnHome}
		>
			Sawyer Click
		</a>
	</h1>

	{#if scrolledOnHome}
		<div transition:slide|local={{ easing: quintOut, duration: 400 }}>
			<a
				href={site.job.link}
				target="_blank"
				rel="external"
				class="styled-border inline-block text-base sm:text-lg w-full font-light leading-tight m-0 md:w-2/5"
			>
				develops data viz at {site.job.company}
				<ExternalLinkIcon size="14" />
			</a>

			<div class="flex justify-between items-center">
				<ul class="inline-block">
					{#each Object.values(site.socials) as { title, url, icon }}
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
