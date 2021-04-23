<script>
	import Meta from './Meta.svelte';
	import Landing from './Landing.svelte';
	import Icons from './Icons.svelte';
	import Project from './Project.svelte';
	import Blog from './Blog.svelte';
	import projects from '../data/graphics.json';

	let y;
	let landingHeight;
	$: blog = false;
</script>

<svelte:window bind:scrollY={y} />

<Meta />

<nav class:invisible={y < landingHeight}>
	<a href="#">
		<h1>Sawyer Click</h1>
	</a>
	<div>
		<Icons />
	</div>
</nav>

<div bind:clientHeight={landingHeight}>
	<Landing />
</div>

<div id="graphics">
	{#each projects as project}
		<Project {project} />
	{/each}
</div>

{#if blog}
	<Blog />
{/if}

<style type="text/scss">
	#graphics {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		flex-flow: wrap row;
	}
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		opacity: 1;
		background-color: var(--gray);
		border-bottom: 1px solid var(--blue);
		z-index: 1;
		padding: 0 0.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: all 0.3s ease-in;
		&.invisible {
			height: 0;
			opacity: 0;
			pointer-events: none;
		}
		a {
			text-decoration: none;
			box-shadow: none;
			border-bottom: 0;
			h1 {
				margin: 0.25rem 0.5rem;
			}
		}
	}
</style>
