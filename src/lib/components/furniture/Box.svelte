<script>
	export let top = true;
	export let right = true;
	export let bottom = true;
	export let left = true;

	let classes = '';
	export { classes as class };
</script>

<div
	class="p-3 border-black {classes}"
	class:border-t-2={top}
	class:border-r-2={right}
	class:border-b-2={bottom}
	class:border-l-2={left}
>
	<slot />
</div>
