import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

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