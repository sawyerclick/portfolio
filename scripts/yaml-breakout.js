import fs from 'fs';
import yaml from 'js-yaml';
import slugify from 'slugify';

main();

async function main() {
	const groups = ['mentionables', 'open-source', 'projects'];

	for (const group of groups) {
		const entries = yaml.load(fs.readFileSync(`./src/lib/data/${group}.yaml`));

		for (const entry of entries) {
			let slug = '';

			switch (group) {
				case 'mentionables':
					slug = slugify(`${entry.project.text} ${entry.award.text}`, {
						lower: true,
						strict: true
					});
					break;
				case 'open-source':
					slug = slugify(entry.title, { lower: true, strict: true });
					break;
				case 'projects':
					slug = slugify(entry.title, { lower: true, strict: true });
					break;
				default:
					break;
			}

			// make the project dirs

			// write the file
			fs.writeFileSync(`./src/lib/data/${group}/${slug}.yaml`, yaml.dump(entry));
		}
	}
}
