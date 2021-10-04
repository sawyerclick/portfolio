import { readable } from 'svelte/store';
import {onMount} from 'svelte'

export const scrollY = readable(0, (set) => {
	let ticking = false;
	let lastScrollY = 0;

	const updateScrollY = () => {
		set(lastScrollY);
		ticking = false;
	};

	const onScroll = () => {
		lastScrollY = window.scrollY;
		if (!ticking) {
			requestAnimationFrame(updateScrollY);
			ticking = true;
		}
	};

	if (typeof document !== 'undefined') document.addEventListener('scroll', onScroll);

	return () => {
		if (typeof document !== 'undefined') document.removeEventListener('scroll', onScroll);
	};
});

export const innerHeight = readable(0, (set) => {
	let ticking = false;
	let lastInnerHeight = 0;

	const updateInnerHeight = () => {
		set(lastInnerHeight);
		ticking = false;
	};

	const onResize = () => {
		lastInnerHeight = window.innerHeight;
		if (!ticking) {
			requestAnimationFrame(updateInnerHeight);
			ticking = true;
		}
  };
  
  onMount(onResize)

	if (typeof document !== 'undefined') document.addEventListener('resize', onResize);

	return () => {
		if (typeof document !== 'undefined') document.removeEventListener('resize', onResize);
	};
});
