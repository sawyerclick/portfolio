<script lang="ts">
	import { timeFormat } from 'd3';
	import { page } from '$app/stores';
	import { prefersReducedMotion, theme } from '$lib/stores';
	import Separator from './furniture/Separator.svelte';
	import { browser } from '$app/environment';

	let height = 188;

	// marquee stuff
	const marqueeInterval = 5000;
	const marquees = [
		{ noun: 'pixels', verb: 'push' },
		{ noun: 'data', verb: 'chart' },
		{ noun: 'stories', verb: 'tell' },
		{ noun: 'juice', verb: 'squeeze' },
		{ noun: 'code', verb: 'ship' }
	];
	let activeMarqueeIndex = 0;
	const marqueeTimer = setInterval(() => {
		activeMarqueeIndex = activeMarqueeIndex === marquees.length - 1 ? 0 : activeMarqueeIndex + 1;
	}, marqueeInterval);

	// time stuff
	let todaysDate = new Date();
	const todaysDateTimer = setInterval(() => (todaysDate = new Date()), 1000);

	// optionally stop timers based on user pref
	$: if ($prefersReducedMotion) {
		clearInterval(marqueeTimer);
	}

	$: if (browser) {
		document.documentElement.style.setProperty('--masthead-height', `${height}px`);
	}
</script>

<header id="hero" class="px-8" bind:offsetHeight={height}>
	<div class="sticky top-0 inset-x-0 bg-light dark:bg-dark z-50 pt-4">
		<div class="grid grid-cols-9 grid-rows-1 gap-3 overflow-hidden">
			<div class="col-start-4 col-end-7 text-center">
				<a
					class="lowercase row-start-1 sticky top-0 italic font-gothic text-6xl leading-none tracking-tight"
					href="/"
					data-sveltekit-preload-data="hover">Sawyer Click</a
				>
				<p class="sr-only">Data viz reporter</p>
			</div>

			<div class="col-start-1 col-end-3 row-start-1 flex items-center">
				<p class="ear">
					<!-- TODO: scramble letter effect -->
					{#key activeMarqueeIndex}
						<span class="font-gothic">&OpenCurlyDoubleQuote;</span>All the
						<span>{marquees[activeMarqueeIndex].noun}</span>
						fit to
						<span>{marquees[activeMarqueeIndex].verb}</span>.<span class="font-gothic"
							>&CloseCurlyDoubleQuote;</span
						>
					{/key}
				</p>
			</div>

			<div class="col-start-8 col-end-10 row-start-1 flex gap-3 items-center justify-end">
				<button
					class="text-lg leading-none p-3"
					aria-label="Toggle {$theme === 'light' ? 'dark' : 'light'} mode"
					on:click={() => {
						theme.set($theme === 'light' ? 'dark' : 'light');
					}}
				>
					{$theme === 'light' ? '☽' : '☀︎'}
				</button>

				<time class="ear" aria-label="Today's date" datetime={timeFormat('%Y-%m-%d')(todaysDate)}>
					{timeFormat('%A, %B %d, %Y')(todaysDate)}
				</time>
			</div>
		</div>

		<Separator class="my-4" />
	</div>

	<h1 class="font-black mx-auto text-center leading-none uppercase italic hed banner">
		{#if $page.url.pathname === '/'}
			<span class="sr-only">Sawyer Click is a </span>
			Data viz developer at <a class="styled" href="https://thedataface.com">The DataFace</a>
		{:else}
			{@html $page.data.title}
		{/if}
	</h1>

	<Separator class="my-4" />
</header>
