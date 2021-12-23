<script>
	import { theme } from '$stores';
	import '$styles/app.postcss';
	import '$styles/font.css';
	// import FollowMouse from '$lib/FollowMouse.svelte';
</script>

<!-- <FollowMouse /> -->

<button
	class="fixed top-0 right-0 z-50 text-xl transition-all duration-150 ease-out hover:scale-150 hover:right-1.5 hover:top-1.5"
	aria-label="{$theme === 'dark' ? 'light' : 'dark'} mode"
	on:click={() => theme.set($theme === 'dark' ? 'light' : 'dark')}
>
	{$theme === 'dark' ? '🌝' : '🌚'}
</button>

<slot />
