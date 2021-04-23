<script>
	export let project;
	let imgHeight = 0;
</script>

<a class="project" href={project.site} target="_blank" title={project.title}>
	<div class="hed-wrapper">
		<div class="img-wrapper" bind:clientWidth={imgHeight}>
			<img
				alt="A screenshot of {project.title}"
				src="assets/images/portfolio/assets/images/portfolio/{project.img}"
				style="height:{imgHeight}px;"
			/>
		</div>
		<h3 class="serif hed">{project.title}</h3>

		<div class="strip {project.affiliation}">
			<div class="outlet">
				<span
					>{project.affiliationProper} // {project.publishedDate.replace(
						' ',
						''
					)} // {project.skills}</span
				>
			</div>
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
			justify-content: flex-start;
			padding: 0;
			margin: 0;
			line-height: 1;
			width: 100%;
			div {
				&.outlet {
					margin-right: 0.25rem;
				}
				&.date {
					margin-left: 0.25rem;
				}
			}
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
			filter: grayscale(0.6);
			transition: all 0.3s;
			img {
				object-fit: contain;
			}
		}
		.hed {
			font-size: 1.5rem;
			width: 100%;
			margin: 0.5rem 0;
			transition: all 0.2s;
			border-bottom: 0.15rem solid var(--blue);
		}
		.desc {
			font-size: 1rem;
			line-height: 1.2;
			margin: 0;
		}
	}
</style>
