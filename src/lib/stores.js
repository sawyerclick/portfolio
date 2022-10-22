import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';
import debounce from 'lodash.debounce';

export const hasNav = writable(false);

// theme tracker, default to dark
export const theme = writable(browser ? window.localStorage.getItem('theme') : 'dark');
theme.subscribe((value) => {
	if (browser) {
		// change classes and settings
		window.localStorage.setItem('theme', value);

		if (value === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
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

export const viewport = readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });
	if (browser) {
		onResize();
		window.addEventListener('resize', debounce(onResize, 50));
	}
	return () => {
		if (browser) window.removeEventListener('resize', onResize);
	};
});
