/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {}
		interface Locals {}
		interface PageData {}
		interface Platform {}
	}

	type ImageFormats = 'avif' | 'webp' | 'jpeg';

	type publications =
		| 'The DataFace'
		| 'Insider'
		| 'The Wall Street Journal'
		| 'NBC News'
		| 'Freelance';

	type type = 'graphics' | 'words';

	interface Link {
		url: URL;
		text: string;
	}

	// Project in projects.yaml
	interface Project {
		slug: string;
		title: string;
		description: string;
		date: Date;
		techstack: string[];
		github: URL | null;
		url: URL;
		img: string;
		alt: string;
		publication: publications;
		client: string | null;
		type: type;
		show: boolean;
		pinned: boolean;
		award: boolean;
	}

	interface Award {
		award: Link;
		project: Link;
	}

	interface OpenSource {
		title: string;
		github: URL;
		link: URL;
		description: string;
	}
}

declare module '$lib/data/projects.yaml' {
	const value: Project[];
	export default value;
}

declare module '$lib/data/mentionables.yaml' {
	const value: Award[];
	export default value;
}

declare module '$lib/data/opensource.yaml' {
	const value: OpenSource[];
	export default value;
}

export {};
