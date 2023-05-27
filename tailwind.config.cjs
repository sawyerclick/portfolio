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
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				tertiary: 'var(--tertiary)',
				accent: 'var(--accent)'
			},
			fontSize: {
				'3xs': '.5rem',
				'2xs': '.625rem',
				'8xl': '5.15rem'
			},
			zIndex: {
				'-1': '-1'
			},
			borderRadius: {
				100: '100%'
			}
		}
	},
	plugins: []
};
