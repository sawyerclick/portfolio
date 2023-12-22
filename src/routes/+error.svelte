<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	// @ts-ignore
	import RickRollGif from '$lib/assets/rickroll.gif?quality=75';

	$: console.error($page.status, $page?.error?.message);
</script>

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
	<h1 class="font-gothic text-light text-[10vw]">Whoops...</h1>
	<p class="lowercase font-serif font-bold mt-6 text-xl sm:text-3xl text-light">
		Something went wrong.
	</p>
	<a
		class="styled text-white font-serif mt-6 px-3 py-1 sm:text-2xl"
		href="/"
		data-sveltekit-preload-data="hover"
	>
		Go home?
	</a>
</main>

{#if dev}
	<dialog
		open
		class="w-full h-auto p-2 m-0 leading-none font-serif text-lg whitespace-pre-wrap text-light font-bold bg-red-600 z-50 fixed top-0"
	>
		{$page.status}: {$page?.error?.message}
	</dialog>
{/if}
