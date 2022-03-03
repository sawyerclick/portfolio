<script>
	import Picture from './furniture/Picture.svelte';
	export let project;

	let { link, img, alt, title, publication, date, description } = project;
</script>

<a
	class="group styled-border block h-full text-primary shadow-md relative z-100 p-0 grayscale-[80%] hover:z-40 hover:grayscale-0"
	href={link}
	target="_blank"
	title={description}
>
	<div class="flex justify-center items-end flex-row flex-wrap group">
		<div
			class="picture-wrapper h-60 w-full object-center object-cover overflow-hidden z-0 duration-150 group-hover:transition-all
			group-focus:transition-all"
		>
			<Picture slug={img} {alt} />
		</div>
		<div
			class="absolute pointer-events-none h-full w-full flex justify-start items-end translate-x-2 p-3 opacity-0 will-change-transform transition-all duration-150 ease-out  group-hover:opacity-100 group-hover:translate-x-0 
			group-hover:-skew-x-3 group-focus:opacity-100 group-focus:translate-x-0
			group-focus:-skew-x-3 "
		>
			<h3
				class="antialiased pointer-events-auto font-semibold tracking-tighter text-sm text-center leading-none bg-accent p-2 border border-primary text-primary shadow-md dark:text-accent dark:bg-primary dark:border-accent"
			>
				{title}
			</h3>
		</div>
		<!-- <span transition:slide|local class="text-left w-full px-4 my-0 z-20"> -->
		<!-- <ul>
				<li
					class="publication inline-block px-1.5 py-0.5 leading-none mr-1.5 rounded-sm font-mono text-sm border-1 border-primary dark:border-accent"
				>
					{publication}
				</li>
				<li
					class="date inline-block px-1.5 py-0.5 leading-none mr-1.5 rounded-sm font-mono text-sm text-primary border-1 border-primary dark:border-accent"
				>
					{date}
				</li>
			</ul> -->
		<!-- <p class="font-mono text-base leading-5 m-0 p-0 w-full">
			{description}
		</p> -->
		<!-- </span> -->
	</div>
</a>
