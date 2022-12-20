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
		document.documentElement.classList.toggle('dark', value === 'dark');
	}
});

// prefers reduced motion
export const prefersReducedMotion = readable(false, (set) => {
	const mediaQueryList = browser
		? window.matchMedia('(prefers-reduced-motion: no-preference)')
		: {};

	const onChange = () => set(!mediaQueryList.matches);

	if (browser) {
		mediaQueryList.addListener(onChange);
		onChange();
	}

	return () => {
		if (browser) mediaQueryList.removeListener(onChange);
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
