<script>
	import Picture from './Picture.svelte';
	export let project;
</script>

<a href={project.site} target="_blank" title={project.title}>
	<div class="flex justify-center items-end flex-row flex-wrap">
		<div class="h-full w-full overflow-hidden z-0 transition-all duration-300">
			<Picture
				name={project.img.includes('https://') ? project.img : project.img.split('.')[0]}
				alt={project.alt}
			/>
		</div>
		<h3 class="font-serif text-3xl w-full m-0 mt-3 mb-2 transition-all duration-200">
			{project.title}
		</h3>
		<div
			class="strip {project.publication} font-mono text-base w-full flex justify-between items-center py-1 px-0 m-0 leading-none border-t-1 border-b-1"
		>
			<span>{project.publication} // {project.publishedDate.replace(' ', '')}</span>
		</div>
		<p class="font-mono text-lg leading-tight m-0 mt-2 w-full">
			{project.description}
		</p>
	</div>
</a>
