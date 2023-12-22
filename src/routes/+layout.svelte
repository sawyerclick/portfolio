<script lang="ts">
	import '$lib/styles/app.postcss';
	import { page } from '$app/stores';
	import { gsap } from 'gsap';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger';
	import Meta from '$lib/components/furniture/Meta.svelte';
	// import Masthead from '$lib/components/Masthead.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	gsap.registerPlugin(ScrollTrigger);
</script>

<Meta />

<!-- <FollowMouse /> -->

{#if $page.data.masthead !== false && !$page.error}
	<!-- <Masthead /> -->
{/if}

<main class="z-10">
	<div class="min-h-screen-minus-masthead">
		<slot />
	</div>
</main>

<!-- {#if $page.data.footer !== false && !$page.error} -->
<Footer />
<!-- {/if} -->
