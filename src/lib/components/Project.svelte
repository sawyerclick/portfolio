<script>
	import Picture from './furniture/Picture.svelte';
	export let project;

	const { link, img, alt, title, description } = project;
</script>

<a
	class="group styled-border block h-full text-primary shadow-md relative z-100 p-0 grayscale-[80%] hover:z-40 hover:grayscale-0"
	href={link}
	target="_blank noreferrer"
	title={description}
>
	<div class="flex justify-center items-end flex-row flex-wrap group">
		<div
			class="picture-wrapper h-60 w-full object-center object-cover overflow-hidden z-0 duration-150 group-hover:transition-all
			group-focus:transition-all"
		>
			<Picture src={img} {alt} width="380" height="240" />
		</div>
		<div
			class="absolute pointer-events-none h-full w-full flex justify-between items-end translate-x-2 p-3 opacity-0 will-change-transform transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0"
		>
			<h3
				class="pointer-events-auto font-semibold tracking-tighter text-lg text-center leading-none bg-accent p-2 border border-primary !text-primary shadow-md dark:!text-accent dark:bg-primary dark:border-accent"
			>
				{title}
			</h3>
			<!-- <a
				class="pointer-events-auto font-semibold tracking-tighter text-lg text-center leading-none bg-accent p-2 border border-primary !text-primary shadow-md dark:!text-accent dark:bg-primary dark:border-accent styled"
				href="/"
				title="Read more about my role in this project">&plus;</a
			> -->
		</div>
	</div>
</a>
