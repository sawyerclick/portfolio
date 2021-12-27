<script>
	import { slide } from 'svelte/transition';
	import Picture from './furniture/Picture.svelte';
	export let project;

	let { link, img, alt, title, publication, date, description } = project;
</script>

<a
	class="group styled-border block h-full text-primary shadow-lg relative z-100 p-0 hover:z-40 hover:-translate-y-2"
	href={link}
	target="_blank"
	{title}
>
	<div class="flex justify-center items-end flex-row flex-wrap">
		<div
			class="picture-wrapper h-60 w-full object-center object-cover overflow-hidden z-0 hover:transition-all focus:transition-all duration-150"
		>
			<Picture slug={img} {alt} />
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
		<!-- <h3
				class="font-sans font-semibold leading-none tracking-tighter text-xl w-full m-0 transition-all duration-200"
			>
				{title}
			</h3> -->
		<!-- <p class="font-mono text-base leading-5 m-0 p-0 w-full">
				{description}
			</p> -->
		<!-- </span> -->
	</div>
</a>
