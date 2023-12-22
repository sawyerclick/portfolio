import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Target = string | Element | NodeList;

interface Tween {
	target: Target;
	type: 'from' | 'to' | 'fromTo' | 'set';
	position: number;
	[key: string]: any;
}

interface ScrollTriggerOptions {
	scrub?: number;
	start?: string;
}

interface TimelineOptions {
	ease?: string;
	start?: string;
	scrollTrigger?: ScrollTriggerOptions;
	tween?: Tween | Tween[];
	children?: boolean;
}

const DEFAULTS: TimelineOptions = {
	ease: 'power2.out',
	start: 'top center'
};

export default function timeline(
	node: Element,
	{ tween, children, scrollTrigger, ...args }: TimelineOptions
) {
	const timelineArgs = scrollTrigger
		? {
				scrollTrigger: { trigger: node, start: DEFAULTS.start, ...scrollTrigger },
				...args
		  }
		: { ...args };

	const timeline = gsap.timeline(timelineArgs);

	if (!Array.isArray(tween)) {
		tween = [tween] as Tween[];
	}

	tween.forEach((tw) => {
		let { target, type, position, ...args } = tw as Tween;

		if (typeof target === 'string') target = node.querySelectorAll(target);

		const targets = target || (children && Array.from(node.children)) || node;

		if (type === 'fromTo') {
			timeline[type](targets, { ...args.from }, { ease: DEFAULTS.ease, ...args }, position);
		} else {
			timeline[type](targets, { ease: DEFAULTS.ease, ...args }, position);
		}
	});

	return {
		destroy() {
			timeline.kill();
		}
	};
}
