import fs from 'fs';
import yaml from 'js-yaml';
import slugify from 'slugify';

main();

async function main() {
	const basepath = ;

	// const openSource = yaml.load(fs.readFileSync('./src/lib/data/open-source.yaml'));
	// console.log(openSource);

	// const awards = yaml.load(fs.readFileSync('./src/lib/data/mentionables.yaml'));
	// console.log(awards);
}

async function createMarkdownFile(path, markdown) {
	// make the project dirs
	fs.mkdirSync(`./src/routes/(article)/${path}`, {
		recursive: true
	});

	// write the file
	fs.writeFileSync(`./src/routes/(article)/${path}/+page.svelte.md`, markdown);
}

async function convertProjects() {
	const projects = yaml.load(fs.readFileSync('./src/lib/data/projects.yaml'));

	const projectKeySwaps = {
		tags: 'techstack',
		link: 'url',
		img: 'hero'
	};

	const projectStringCoercion = new Set(['title', 'description']);

	projects.forEach((project) => {
		// create a uniform slug
		const slug = slugify(project.title, { lower: true, strict: true });

		const frontmatter = Object.entries(project)
			.map(
				([key, value]) =>
					`${projectKeySwaps?.[key] || key}: ${
						projectStringCoercion.has(key) ? '"' + value + '"' : value
					}`
			)
			.join('\n');

		const markdown = `---\n${frontmatter}\n---\n\n# { title }\n\n{ description }\n`;

		createMarkdownFile(`project/${slug}`, markdown)
	});
}

async function convertMentionables() {
	const mentionables = yaml.load(fs.readFileSync('./src/lib/data/mentionables.yaml'));

	mentionables.forEach((mentionable) => {

		const slug 
		const frontmatter = {
			title: mentionable.award.text,
			description: '',
			date: '2023-01-01',
			hero: '',
			alt: '',
			award: mentionable.award,
			project: mentionable.project
		};

		const markdown = `---\n${yaml.dump(frontmatter)}---\n\n# { title }\n\n{ description }\n`;

		createMarkdownFile(`mentionable/${}`)
	});
}
