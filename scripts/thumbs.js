import fs from 'fs';
import sharp from 'sharp';
import shell from 'shelljs';

const sizes = [200, 400, 600, 800, 1000];
const formats = ['avif', 'webp', 'jpeg'];
const acceptedTypes = ['png', 'gif', 'jpeg', 'jpg', 'avif', 'webp'];

const inDir = `./thumbnails`;
const outDir = `./static/images/thumbnails`;

// make resized dir if doesn't exist
shell.mkdir('-p', outDir);

const makeThumb = async (fileName) => {
	const strippedName = fileName.split('.')[0];
	const dest = `${outDir}/${strippedName}`;

	// make dest dir
	shell.mkdir('-p', dest);

	// iterate over sizes and formats
	for (let size of sizes) {
		for (let format of formats) {
			sharp(`${inDir}/${fileName}`)
				.resize({
					width: size,
					background: { r: 248, g: 248, b: 248, alpha: 1 }
				})
				.flatten({ background: { r: 248, g: 248, b: 248 } })
				.toFormat(format)
				.toFile(`${dest}/${size}.${format}`)
				.then(() => console.log('\x1b[32m', `${dest}/${size}.${format}`));
		}
	}

	// create jpeg blur as placeholder
	sharp(`${inDir}/${fileName}`)
		.resize(50)
		.blur(2)
		.toFormat('jpeg')
		.toFile(`${dest}/blurred.jpeg`)
		.then(() => console.log('\x1b[32m', `${fileName} | BLURRED.jpeg`));
};

// find all img files and run makeThumb on them
fs.readdirSync(inDir)
	.filter((d) => acceptedTypes.includes(d.split('.')[1]))
	.forEach((fileName) => makeThumb(fileName));
