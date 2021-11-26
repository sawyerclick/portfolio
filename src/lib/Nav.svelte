<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { ChevronDownIcon, ExternalLinkIcon } from 'svelte-feather-icons';
	import Icons from './Icons.svelte';
	import gsap from 'gsap';

	let scrollY = 0,
		chevronDownEl = null;

	onMount(() => {
		gsap.to(chevronDownEl, { y: -10, repeat: -1, yoyo: true, ease: 'power1.out' });
	});

	$: isScrolled = scrollY > 25;
</script>

<svelte:window bind:scrollY />

<div
	class="sm:pl-4 header pr-2 pl-2 w-full fixed bottom-0 z-10 border-blue"
	class:border-t={isScrolled}
	class:bg-grey={isScrolled}
>
	<h1 class="text-shadow py-2 leading-none font-extralight" class:text-4xl={isScrolled}>
		{#if isScrolled}
			<a sveltekit:prefetch href="/#home">Sawyer Click</a>
		{:else}
			Sawyer Click
		{/if}
	</h1>

	{#if !isScrolled}
		<div transition:slide|local>
			<a
				href="https://www.businessinsider.com/category/sawyer-click"
				target="_blank"
				class="styled-border block md:text-3xl text-2xl w-3/5 font-medium leading-none bg-grey m-0"
			>
				develops interactive graphics at Business Insider
				<ExternalLinkIcon size="14" />
			</a>

			<div class="py-3 flex items-center justify-between">
				<Icons />

				<div class="inline" bind:this={chevronDownEl}>
					<ChevronDownIcon size="42" />
				</div>
			</div>
		</div>
	{/if}
</div>
