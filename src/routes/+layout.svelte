<script>
	import '$lib/styles/app.postcss';
	import '$lib/styles/font.css';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	onMount(() => {
		ScrollSmoother.create({
			smooth: 1,
			effects: true
		});
	});
	// import FollowMouse from '$lib/components/FollowMouse.svelte';
</script>

<Meta />

<!-- <FollowMouse /> -->
<slot />
<!-- <Footer /> -->
