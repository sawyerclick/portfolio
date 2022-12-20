<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { SunIcon, MoonIcon } from 'svelte-feather-icons';
	import { hasNav, theme } from '$lib/stores';
	import animate from '$lib/actions/animate';

	/** @type {String} */
	export let size = '26';

	let scrollY = 0;

	onMount(() => {
		hasNav.set(true);
		document.body.classList.add('has-nav');
		return () => hasNav.set(false);
	});

	$: scrolledOnHome = scrollY > 15 && !!$page.url.pathname;
</script>

<svelte:window bind:scrollY />

<nav
	class="sm:px-4 header pr-2 px-2 w-full fixed bottom-0 z-50 transition-all duration-500 ease-out"
	class:translate-y-full={scrolledOnHome}
	class:opacity-0={scrolledOnHome}
>
	<h1>
		<a
			sveltekit:prefetch
			href="/#home"
			class="inline-block uppercase text-shadow pt-2 leading-none font-bold tracking-tighter font-sans text-3xl xs:text-5xl text-primary -skew-x-12 duration-150 ease-out dark:text-accent hover:transition-all hover:skew-x-12"
		>
			{$page.data.title}
		</a>
	</h1>

	<div>
		<p>
			<a
				href={$page.data.job.link}
				target="_blank"
				rel="external noreferrer"
				class="styled-border inline-block text-base sm:text-lg w-full font-light leading-tight m-0 md:w-2/5"
			>
				develops data viz at {$page.data.job.company} &#8599;
			</a>
		</p>

		<div class="flex justify-between items-center">
			<ul class="inline-block">
				{#each Object.values($page.data.socials) as { title, url, icon }}
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
				<svelte:component this={$theme === 'dark' ? SunIcon : MoonIcon} size="26" />
			</button>
		</div>
	</div>
</nav>
