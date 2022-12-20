const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './mdsvex.config.js'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
			sans: [
				'Monument',
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
				'Fira Code',
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
		listStyleType: {
			none: 'none',
			chevron: '"› "'
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
