<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import RickRollGif from '$lib/assets/rickroll.gif?quality=75';

	$: console.error($page.status, $page.error.message);
</script>

<Meta meta={{ title: 'Whoops...', description: 'Something went wrong.' }} />

<div class="w-screen h-screen fixed pointer-events-none z-10">
	<img
		class="w-full h-full object-center object-cover"
		src={RickRollGif}
		alt="A gif of the iconic Rick Astley dancing to his song 'Never Gonna Give You Up' in the titular music video"
		width="200"
		height="150"
		loading="eager"
		decoding="async"
		draggable="false"
	/>
</div>

<main
	class="absolute flex flex-nowrap flex-col justify-center items-center w-screen h-screen p-12 text-center z-20"
>
	<h2 class="font-gothic text-3xl sm:text-5xl font-bold mt-8 text-bg text-accent -skew-x-12">
		Whoops...
	</h2>
	<p class="font-gothic font-bold mt-6 text-2xl sm:text-5xl text-bg text-accent -skew-x-12">
		something went wrong
	</p>
	<a
		sveltekit:prefetch
		href="/"
		class="styled-border font-gothic mt-8 px-3 py-1 sm:text-2xl -skew-x-12"
	>
		Go home?
	</a>
</main>

{#if dev}
	<pre
		class="w-full p-2 leading-tight font-mono text-lg whitespace-pre-wrap text-accent font-bold bg-red-600 z-50 fixed top-0">
		{$page.status}: {$page.error.message}
	</pre>
{/if}
