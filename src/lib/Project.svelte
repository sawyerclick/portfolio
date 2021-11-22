<script>
	import { fly, slide } from 'svelte/transition';
	// import { TagIcon } from 'svelte-feather-icons';
	import Picture from './Picture.svelte';
	export let project;

	let { link, img, alt, title, publication, date, description } = project;

	const tags = project.tags.split(',');

	let hover = false;
	const activateHover = () => (hover = true);
	const disableHover = () => (hover = false);
</script>

<a
	href={link}
	target="_blank"
	{title}
	on:mouseover={activateHover}
	on:focus={activateHover}
	on:mouseout={disableHover}
	on:blur={disableHover}
>
	<div class="flex justify-center items-end flex-row flex-wrap">
		<div
			class="h-60 w-full object-center object-cover overflow-hidden z-0 transition-all duration-300"
		>
			<Picture name={img.includes('https://') ? img : img.split('.')[0]} {alt} />
		</div>
		<!-- {#if hover} -->
		<span transition:slide|local class="text-left w-full">
			<h3 class="font-serif text-3xl w-full m-0 mt-3 mb-2 transition-all duration-200">
				{title}
			</h3>
			<div
				class="strip {publication} font-mono text-base w-full flex justify-between items-center py-1 px-0 m-0 leading-none border-t-1 border-b-1 border-blue"
			>
				<span>{publication} // {date.replace(' ', '')}</span>
			</div>
			<p class="font-mono text-lg leading-5 m-0 mt-2 w-full">
				{description}
			</p>
		</span>
		<!-- {/if} -->
	</div>
</a>
