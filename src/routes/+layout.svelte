<script>
	import '@fontsource/esteban';
	import '$lib/styles/app.postcss';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

	onMount(() => {
		ScrollSmoother.create({
			smooth: 1,
			effects: true,
			smoothTouch: 0.1
		});
	});
</script>

<Meta />

<!-- <FollowMouse /> -->

<!-- {#if $page.data.nav}
	<Nav />
{/if} -->

<div id="smooth-wrapper">
	<main id="smooth-content" class="z-10 min-h-screen">
		<slot />
		{#if $page.data.footer}
			<Footer />
		{/if}
	</main>
</div>
