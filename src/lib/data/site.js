import { GithubIcon, TwitterIcon, MailIcon, LinkedinIcon } from 'svelte-feather-icons';

export default {
	title: 'Sawyer Click',
	description: 'A newsroom developer working on data-driven visual and interactive storytelling',
	keywords: ['Sawyer Click', 'data visualization', 'svelte', 'd3', 'data graphics'],
	email: 'sawyer@hey.com',
	job: {
		title: 'Data Viz Developer',
		company: 'The DataFace',
		link: 'https://www.thedataface.com'
	},
	img: {
		alt: 'Sawyer Click on his computer screen via PhotoBooth',
		src: '/images/share.png'
	},
	socials: {
		github: {
			title: 'Github',
			url: 'https://www.github.com/SawyerClick',
			icon: GithubIcon
		},
		twitter: {
			title: 'Twitter',
			url: 'https://www.twitter.com/sawyerdabear',
			icon: TwitterIcon
		},
		linkedIn: {
			title: 'LinkedIn',
			url: 'https://www.linkedin.com/in/sawyerclick/',
			icon: LinkedinIcon
		},
		email: {
			title: 'Email',
			url: 'mailto:sawyer@hey.com',
			icon: MailIcon
		}
	}
};
