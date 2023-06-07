<script>
	let classes = '';
	export { classes as class };

	export let light = false;
</script>

<hr class={classes} class:x-light={light} class:x-dark={!light} />

<style>
	hr {
		display: block;
		background-repeat: repeat-x;
		background-size: contain;
		width: 100%;
		height: 5px;
	}
	hr.x-light {
		background-image: url('/images/x-light.png');
	}
	hr.x-dark {
		background-image: url('/images/x-dark.png');
	}
</style>
