import fs from 'fs';
import sharp from 'sharp';
import shell from 'shelljs';

const sizes = [200, 400, 600, 800];
const formats = ['png', 'webp'];
const acceptedTypes = ['png', 'gif', 'jpeg', 'jpg'];

const baseDir = './static/images/portfolio';
const unsizedDir = `${baseDir}/unsized`;
const resizedDir = `${baseDir}/resized`;

// make resized dir if doesn't exist
shell.mkdir('-p', resizedDir);

const makeThumb = async (fileName) => {
	const strippedName = fileName.split('.')[0];
	const dest = `${resizedDir}/${strippedName}`;

	// make dest dir
	shell.mkdir('-p', dest);

	// iterate over sizes and formats
	for (let size of sizes) {
		for (let format of formats) {
			sharp(`${unsizedDir}/${fileName}`)
				.resize({
					width: size,
					background: { r: 248, g: 248, b: 248, alpha: 1 }
				})
				.flatten({ background: { r: 248, g: 248, b: 248 } })
				.toFormat(format)
				.toFile(`${dest}/${size}.${format}`)
				.then(() => console.log('\x1b[32m', `${fileName} | ${size} - ${format}`));
		}
	}

	// create jpeg blur as placeholder
	sharp(`${unsizedDir}/${fileName}`)
		.resize(50)
		.blur(2)
		.toFormat('jpeg')
		.toFile(`${dest}/blurred.jpeg`)
		.then(() => console.log('\x1b[32m', `${fileName} | BLURRED`));
};

// find all img files and run makeThumb on them
fs.readdirSync(unsizedDir)
	.filter((d) => acceptedTypes.includes(d.split('.')[1]))
	.forEach((fileName) => makeThumb(fileName));
