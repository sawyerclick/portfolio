<script>
	import '$lib/styles/app.postcss';
	import '$lib/styles/font.css';
	import { page } from '$app/stores';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';
	// import FollowMouse from '$lib/components/FollowMouse.svelte';
	gsap.registerPlugin(ScrollTrigger);


</script>

<Meta />

<!-- <FollowMouse /> -->

{#if $page.data.nav}
	<Nav />
{/if}

<div id="smooth-wrapper">
	<main id="smooth-content" class="z-10 min-h-screen">
		<slot />
		{#if $page.data.footer}
			<Footer />
		{/if}
	</main>
</div>
