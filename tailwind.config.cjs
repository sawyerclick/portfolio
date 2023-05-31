module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			sans: ['helvetica', 'arial', 'sans-serif'],
			serif: ['Esteban', 'serif'],
			gothic: ['Quest Knight', 'Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif']
		},
		extend: {
			screens: {
				xs: '400px'
			},
			minHeight: {
				'screen-minus-masthead': 'calc(100vh - var(--masthead-height))'
			},
			colors: {
				dark: '#222222',
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
