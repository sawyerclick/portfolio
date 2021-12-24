<script>
	import { theme } from '$lib/stores';
	import '$lib/styles/app.postcss';
	import '$lib/styles/font.css';
	// import FollowMouse from '$lib/components/FollowMouse.svelte';
</script>

<!-- <FollowMouse /> -->

<button
	class="fixed top-0 right-0 z-50 text-xl  duration-150 ease-out hover:transition-all hover:scale-150 hover:right-1.5 hover:top-1.5"
	aria-label="{$theme === 'dark' ? 'light' : 'dark'} mode"
	on:click={() => theme.set($theme === 'dark' ? 'light' : 'dark')}
>
	{$theme === 'dark' ? '🌝' : '🌚'}
</button>

<slot />
