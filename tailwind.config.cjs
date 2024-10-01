const colors = require('./src/lib/styles/colors.json');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
	theme: {
		fontFamily: {
			sans: ['helvetica', 'arial', 'sans-serif'],
			serif: ['Esteban', 'serif'],
			gothic: ['Grandmaster Clash', 'Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif']
		},
		extend: {
			screens: {
				xs: '460px'
			},
			minHeight: {
				'screen-minus-masthead': 'calc(100vh - var(--masthead-height))'
			},
			colors: colors,
			fontSize: {
				'3xs': '.5rem',
				'2xs': '.625rem',
				'8xl': '5.15rem',
				'9xl': '6rem',
				'10xl': '8.25rem',
				'11xl': '10rem'
			},
			zIndex: {
				'-1': '-1'
			},
			borderRadius: {
				100: '100%'
			},
			listStyleType: {
				floral: '❧'
			}
		}
	}
};
