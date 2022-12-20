import { GithubIcon, TwitterIcon, MailIcon, LinkedinIcon } from 'svelte-feather-icons';

export default {
	tag: 'Sawyer Click',
	title: 'Sawyer Click',
	author: 'Sawyer Click',
	description: 'A newsroom developer working on data-driven visual and interactive storytelling',
	keywords: ['Sawyer Click', 'data visualization', 'svelte', 'd3', 'data graphics'],
	email: 'sawyer@hey.com',
	site: 'https://www.sawyer.codes',
	job: {
		title: 'Data Viz Developer',
		company: 'The DataFace',
		link: 'https://www.thedataface.com'
	},
	image: {
		alt: 'Sawyer Click on his computer screen',
		large: {
			src: '/1200x630.png',
			width: 1200,
			height: 630
		},
		small: {
			src: '/1012x506.png',
			width: 1012,
			height: 506
		}
	},
	colors: {
		background: '#f8f8f8',
		theme: '#f8f8f8'
	},
	socials: {
		github: {
			title: 'Github',
			url: 'https://www.github.com/SawyerClick',
			username: 'sawyerclick',
			icon: GithubIcon
		},
		twitter: {
			title: 'Twitter',
			url: 'https://www.twitter.com/sawyerdabear',
			username: '@sawyerdabear',
			icon: TwitterIcon
		},
		linkedIn: {
			title: 'LinkedIn',
			url: 'https://www.linkedin.com/in/sawyerclick/',
			username: 'sawyerclick',
			icon: LinkedinIcon
		},
		email: {
			title: 'Email',
			url: 'mailto:sawyer@hey.com',
			username: 'sawyer@hey.com',
			icon: MailIcon
		}
	}
};
