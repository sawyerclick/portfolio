
const fs = require('fs');
const CWD = process.cwd();

const loc = CWD.split('/');
const dir = loc[loc.length - 1]; // current dir
const split = dir.split('-');
const s3link = `https://tbimedia.s3.us-east-1.amazonaws.com/bistudios/_00/dev_edit/graphics/${split[0]}/${split[1]}/${dir}/`;

const deployFolder = dir + '/';
const html = deployFolder + '/index.html';

// replaces links with non-relative versions
fs.readFile(html, 'utf8', function (err, fileData) {
	if (err) console.log(err);

	const result = fileData
		.replace(/="assets/gim, `="${s3link}assets`)
		.replace(/="build/gim, `="${s3link}build`);

	fs.writeFile(html, result, 'utf8', function (err) {
		if (err) return console.log(err);
		process.exit();
	});
});