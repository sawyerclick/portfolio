<script>
	import '@fontsource/esteban';
	import '$lib/styles/app.postcss';
	import { page } from '$app/stores';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Masthead from '$lib/components/Masthead.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin);
</script>

<Meta />

<!-- <FollowMouse /> -->

{#if $page.data.masthead !== false && !$page.error}
	<Masthead />
{/if}

<main class="z-10">
	<div class="min-h-screen-minus-masthead">
		<slot />
	</div>
	{#if $page.data.footer !== false && !$page.error}
		<Footer />
	{/if}
</main>
