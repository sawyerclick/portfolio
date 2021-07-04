<script>
	import IntersectionObserver from './helpers/IntersectionObserver.svelte';
	export let project;
	let imgHeight = 0;
</script>

<a class="project" href={project.site} target="_blank" title={project.title}>
	<div class="hed-wrapper">
		<div class="img-wrapper" bind:clientWidth={imgHeight}>
			<IntersectionObserver once={true} let:intersecting>
				{#if intersecting}
					<img
						alt="A screenshot of {project.title}"
						src="assets/images/portfolio/{project.img}"
						style="height:{imgHeight}px;"
						loading="lazy"
					/>
				{/if}
			</IntersectionObserver>
		</div>
		<h3 class="serif hed">{project.title}</h3>
		<div class="strip {project.affiliation}">
			<span
				>{project.affiliationProper} // {project.publishedDate.replace(
					' ',
					''
				)}</span
			>
		</div>
		<p class="sans desc">{project.description}</p>
	</div>
</a>

<style lang="scss">
	a.project {
		position: relative;
		width: calc(33% - 2rem);
		border-radius: 0.5rem;
		margin: 1rem;
		padding: 0.5rem;
		border: unset;
		color: var(--blue);
		box-shadow: none;
		transition: all 0.3s;
		@media screen and (max-width: 750px) {
			width: calc(50% - 2rem);
		}
		@media screen and (max-width: 500px) {
			width: 100%;
		}
		&:hover {
			transform: translateY(-0.5rem);
			.img-wrapper {
				filter: grayscale(0);
			}
		}
		.strip {
			font-family: var(--sans);
			font-size: 12px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 2px 0;
			margin: 0;
			line-height: 1;
			width: 100%;
			color: var(--blue);
			// background-color: rgba(52, 101, 127, 0.7);
			border-top: 1px solid var(--blue);
			border-bottom: 1px solid var(--blue);
		}
		.hed-wrapper {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			flex-flow: wrap row;
		}
		.img-wrapper {
			height: 100%;
			overflow: hidden;
			width: 100%;
			z-index: -1;
			filter: grayscale(0.7);
			transition: all 0.3s;
			img {
				object-fit: contain;
			}
		}
		.hed {
			font-size: 1.5rem;
			width: 100%;
			margin: 0.5rem 0 0;
			transition: all 0.2s;
		}
		.desc {
			font-size: 1rem;
			line-height: 1.2;
			margin: 0.25rem 0 0;
			width: 100%;
		}
	}
</style>
