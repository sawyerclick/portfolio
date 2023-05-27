<script>
	let classes = '';
	export { classes as class };

	let width = 300;

	// the width of an X
	const xWidth = 3.68;

	$: fits = width / xWidth;
</script>

<div
	class="flex flex-row gap-0 leading-none text-3xs font-gothic {classes}"
	role="separator"
	bind:clientWidth={width}
>
	<div class="contents" aria-hidden="true">
		{#each Array.from({ length: fits }) as _}
			x
		{/each}
	</div>
</div>
