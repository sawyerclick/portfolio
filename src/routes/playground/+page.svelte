<script>
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { viewport } from '$lib/stores';

	// import Separator from '$lib/components/furniture/Separator.svelte';
	// import timeline from '$lib/actions/timeline';
	import clamp from '$lib/utils/clamp';
	import { timeFormat } from 'd3';

	let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<!-- <div class="absolute inset-0 w-full h-full">
	<Canvas>
		<Scene />
	</Canvas>
</div> -->

<div class="flex flex-col flex-nowrap relative content-well">
	<header class="full px-2 flex flex-col-reverse min-h-svh">
		<h1
			class="grid place-content-center p-4 gap-1 transition-transform duration-700 ease-out flex-1"
			style:transform="scale({clamp(scrollY / $viewport.height + 1, [1, 1.5])})"
		>
			<span
				class="font-gothic text-4xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-10xl leading-none text-center uppercase text-dark dark:text-light"
				>Sawyer Click</span
			>
			<span class="sr-only">is a</span>
			<span
				class="text-sm sm:text-base md:text-lg text-center md:text-right -translate-y-1 uppercase leading-tight text-dark dark:text-light"
				>Sr. data viz developer</span
			>
		</h1>
		<!-- <Separator /> -->

		<div
			class="flex flex-row flex-nowrap justify-between font-light uppercase text-sm pt-2 leading-none"
		>
			<address>
				<a
					href="geo:29.8833,-97.9414"
					target="_blank"
					class="not-italic flex flex-row flex-nowrap items-center gap-3"
				>
					<span aria-hidden="true" class="text-6xl -rotate-45">❦</span>
					<span>San Marcos, Texas</span>
				</a>
			</address>

			<time
				class="text-right flex flex-row flex-nowrap items-center gap-3"
				datetime={new Date().toISOString()}
			>
				<span class="sr-only">Today's date:</span>
				<span>{timeFormat('%A')(new Date())}, {timeFormat('%B %d, %Y')(new Date())}</span>
				<span aria-hidden="true" class="text-6xl -scale-x-100 rotate-45">❦</span>
			</time>
		</div>
	</header>

	<div class="flex flex-col full content-well">
		<section
			class="full rounded-t-3xl my-12 flex flex-col gap-8 p-8 min-h-screen bg-blue-500 content-well"
		>
			<div>
				<h2 id="projects" class="font-gothic text-6xl leading-none text-center">Projects</h2>
				<ul
					aria-describedby="projects"
					class="border-2 border-dark dark:border-light grid grid-cols-4"
				>
					{#each Array.from({ length: 4 }) as _, i}
						<li class="p-4 grid place-content-center">{i}</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="my-12 flex flex-col gap-8 min-h-screen">
			<h2 id="open-source" class="font-gothic text-6xl leading-none text-center">Open Source</h2>
			<ul
				aria-describedby="open-source"
				class="border-2 border-dark dark:border-light grid grid-cols-4"
			>
				{#each Array.from({ length: 4 }) as _, i}
					<li class="bg-primary p-4 grid place-content-center">{i}</li>
				{/each}
			</ul>
		</section>

		<section class="my-12 flex flex-col gap-8 min-h-screen">
			<h2 id="mentionables" class="font-gothic text-6xl leading-none text-center">Mentionables</h2>
			<ul
				aria-describedby="mentionables"
				class="border-2 border-dark dark:border-light grid grid-cols-4"
			>
				{#each Array.from({ length: 4 }) as _, i}
					<li class="bg-primary p-4 grid place-content-center">{i}</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
