import docs from '../google.config.cjs';
import fetch from 'node-fetch';
import fs from 'fs';

const fetchGoogle = async ({ id, gid, filepath }) => {
	console.log(`\x1b[34mfetching: \x1b[32m${filepath}\x1b[0m`);

	const base = 'https://docs.google.com';
	const post = `spreadsheets/u/1/d/${id}/export?format=csv&id=${id}&gid=${gid}`;
	const url = `${base}/${post}`;

	try {
		const response = await fetch(url);
		const text = await response.text();
		return text;
	} catch (err) {
		throw new Error(err);
	}
};

(async () => {
	for (let d of docs) {
		try {
			const str = await fetchGoogle(d);
			const file = `./${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}
})();
