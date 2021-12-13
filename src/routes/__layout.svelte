<script>
	import { hasNav } from '$stores';
	import '$styles/app.postcss';
	import '$styles/font.css';

	// import FollowMouse from '$lib/FollowMouse.svelte';
</script>

<!-- <FollowMouse /> -->

<div class="page-wrapper" class:has-nav={$hasNav}>
	<slot />
</div>
