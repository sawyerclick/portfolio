import { writable } from 'svelte/store';
import { readable } from 'svelte/store';
import debounce from 'lodash.debounce';

export const viewport = readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });

	if (typeof window !== 'undefined') {
		onResize();
		window.addEventListener('resize', debounce(onResize, 250));
	}

	return () => {
		if (typeof window !== 'undefined') window.removeEventListener('resize', onResize);
	};
});

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

// prefers reduced motion
export const prefersReducedMotion = readable(false, (set) => {
	const query = '(prefers-reduced-motion: no-preference)';
	const mediaQueryList = typeof window !== 'undefined' ? window.matchMedia(query) : {};

	const onChange = () => set(!mediaQueryList.matches);

	if (typeof window !== 'undefined') {
		mediaQueryList.addListener(onChange);
		onChange();
	}

	return () => {
		if (typeof window !== 'undefined') mediaQueryList.removeListener(onChange);
	};
});
