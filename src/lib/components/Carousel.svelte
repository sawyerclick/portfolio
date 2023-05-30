<div class="w-full text-center overflow-x-hidden">
	<ul
		class="w-full mx-auto flex px-6 py-4 gap-4 place-items-start overflow-x-auto scroll-smooth snap-mandatory snap-x scroll-pl-2 sm:scroll-pl-6 cursor-ew-resize"
	>
		<slot />
	</ul>
</div>

<style lang="postcss">
	ul {
		-webkit-overflow-scrolling: touch;
	}
	ul::-webkit-scrollbar {
		@apply h-2;
	}
	ul::-webkit-scrollbar-thumb {
		@apply bg-dark dark:bg-light rounded-xl;
	}
	:global(.dark) ul::-webkit-scrollbar-thumb {
		@apply bg-light;
	}
	ul::-webkit-scrollbar-track {
		@apply bg-transparent mx-2 sm:mx-6;
	}
</style>
