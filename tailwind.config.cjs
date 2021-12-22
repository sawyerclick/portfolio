const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			serif: ['recoleta', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
			sans: [
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			],
			mono: [
				'Inconsolata',
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'Liberation Mono',
				'Courier New',
				'monospace'
			]
		},
		extend: {
			colors: {
				primary: '#34657F',
				secondary: '#CC6C8F',
				tertiary: '#F6BD9D',
				accent: '#f8f8f8'
			},
			fontSize: {
				'8xl': '5.15rem'
			},
			borderWidth: {
				1: '1px'
			},
			zIndex: {
				'-1': '-1'
			}
		}
	},
	plugins: []
};

module.exports = config;
