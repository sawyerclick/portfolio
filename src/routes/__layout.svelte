<script>
	import '$lib/styles/app.postcss';
	import '$lib/styles/font.css';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	// import FollowMouse from '$lib/components/FollowMouse.svelte';
</script>

<Meta />

<!-- <FollowMouse /> -->

<slot />

<Footer />
