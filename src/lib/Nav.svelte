<script>
	import { fly } from 'svelte/transition';
	import Icons from '$lib/Icons.svelte';
	import { scrollY, innerHeight } from '$stores';
</script>

{#if $scrollY > $innerHeight / 2}
	<nav
		in:fly={{ duration: 400, y: -100 }}
		out:fly={{ duration: 600, y: -100 }}
		class="fixed top-0 left-0 right-0 z-50 border-b-1 border-blue bg-gray flex justify-between items-center p-2 leading-none"
	>
		<a href="/" class="font-serif text-3xl">Sawyer Click</a>
		<div>
			<Icons />
		</div>
	</nav>
{/if}
