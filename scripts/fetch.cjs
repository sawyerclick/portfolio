const CWD = process.cwd();

const fs = require('fs');
const fetch = require('node-fetch');

const docs = require(`${CWD}/google.config.cjs`);

const fetchGoogle = async ({ id, gid, filepath }) => {
	console.log(`fetching: ${filepath}`);

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
			const file = `${CWD}/${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}
})();
