const dev = process.env.NODE_ENV === 'development';

module.exports = {
	plugins: [
		require('postcss-import'),
		require('@tailwindcss/nesting'),
		require('tailwindcss'),
		require('autoprefixer'),
		!dev && require('cssnano')
	]
};
