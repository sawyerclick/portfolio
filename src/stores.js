import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

export const lazy = writable(false);

// lazyload images
export const lazyLoad = (entries, observer) => {
	entries.forEach((entry) => {
		if (entry.target.tagName === 'IMG') {
			if (entry.isIntersecting && entry.target.src !== entry.target.dataset.src) {
				entry.target.src = entry.target.dataset.src;
				observer.unobserve(entry.target);
			}
		} else if (entry.target.tagName === 'PICTURE') {
			console.log(entry.target);
			if (entry.isIntersecting && entry.target.srcset !== entry.target.dataset.srcset) {
				entry.target.srcset = entry.target.dataset.srcset;
				observer.unobserve(entry.target);
			}
		}
	});
};

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
