<script>
	export let project;
	let imgHeight = 0;
</script>

<a
	class="project relative w-full rounded-lg p-4 text-blue shadow-none border-1 border-transparent transition-all hover:-translate-y-2 hover:shadow-lg hover:border-blue"
	href={project.site}
	target="_blank"
	title={project.title}
>
	<div class="flex justify-center items-end flex-row flex-wrap">
		<div
			class="h-full w-full overflow-hidden z-0 transition-all duration-300"
			bind:clientWidth={imgHeight}
		>
			<img
				alt="A screenshot of {project.title}"
				src="/images/portfolio/{project.img}"
				style="height:{imgHeight}px;"
				loading="lazy"
				class="object-contain object-bottom"
			/>
		</div>
		<h3 class="font-serif hed text-2xl w-full m-0 mt-2 transition-all duration-200">
			{project.title}
		</h3>
		<div
			class="strip {project.publication} font-mono text-sm w-full flex justify-between items-center py-1 px-0 m-0 leading-none border-t-1 border-b-1"
		>
			<span>{project.publication} // {project.publishedDate.replace(' ', '')}</span>
		</div>
		<p class="font-mono text-base m-0 mt-1 w-full">{project.description}</p>
	</div>
</a>

<style>
	a.project {
		transition-duration: 300ms;
	}
	a.project:hover .img-wrapper {
		filter: grayscale(0);
	}
	.img-wrapper {
		filter: grayscale(0.7);
	}
</style>
