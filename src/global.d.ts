/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Link {
	href: URL;
	text: string;
}

type publications =
	| 'The DataFace'
	| 'Insider'
	| 'The Wall Street Journal'
	| 'NBC News'
	| 'Freelance';

type type = 'graphics' | 'words';

// Project in projects.yaml
interface Project {
	title: string;
	description: string;
	date: Date;
	tags: string[];
	link: URL;
	img: string;
	alt: string;
	publication: publications;
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
