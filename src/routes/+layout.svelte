<script lang="ts">
	import '$lib/styles/app.postcss';
	import { gsap } from 'gsap';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger';
	import Meta from '$lib/components/furniture/Meta.svelte';
	// import Masthead from '$lib/components/Masthead.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	gsap.registerPlugin(ScrollTrigger);
</script>

<svelte:head>
	<link rel="preload" href="/fonts/grandmasterclash.otf" as="font" type="font/otf" />
	<link rel="preload" href="/fonts/esteban-latin-400-normal.woff" as="font" type="font/woff2" />
	<link rel="preload" href="/fonts/esteban-latin-ext-400-normal.woff" as="font" type="font/woff2" />
</svelte:head>

<Meta />

<!-- <FollowMouse /> -->

<div class="flex flex-col min-h-svh">
	<main class="z-10 flex-1">
		<slot />
	</main>

	<Footer />
</div>
