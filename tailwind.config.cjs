module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			serif: ['Esteban', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
			gothic: ['Quest Knight', 'Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif']
		},
		extend: {
			screens: {
				xs: '400px'
			},
			colors: {
				dark: '#000000',
				light: '#f8f8f8'
			},
			fontSize: {
				'3xs': '.5rem',
				'2xs': '.625rem',
				'8xl': '5.15rem',
				'9xl': '6rem',
				'10xl': '7rem'
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
	},
	plugins: []
};
