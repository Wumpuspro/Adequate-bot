import { sendEmbed } from '../../util';
import language from '../../functions/language';

const animate = [
	'https://media.giphy.com/media/l4hLAf6Eo8DEcO5ZS/giphy.gif',
	'https://media.giphy.com/media/kEhxvWwGBqBOHrMFyS/giphy.gif',
	'https://media.giphy.com/media/3oGRFlpAW4sIHA02NW/giphy.gif',
	'https://media.giphy.com/media/ckHAdLU2OmY7knUClD/giphy.gif',
	'https://media.giphy.com/media/l2JdUMnCDg6qs368g/giphy.gif',
	'https://media.giphy.com/media/taDxtc7by09TZ03ciP/giphy.gif',
	'https://media.giphy.com/media/5xtDarpTZP1hgRgReLK/giphy.gif',
	'https://media.giphy.com/media/MdoycLRBmVoT7I89Xt/giphy.gif',
	'https://media.giphy.com/media/J47aDyxakxYlt53KKW/giphy.gif',
	'https://media.giphy.com/media/hqTZTTIT4l1ogOWihJ/giphy.gif'
];

const faceDice = [
	'https://i.imgur.com/AGGuWWm.png?1',
	'https://i.imgur.com/ZmKeVRg.png?1',
	'https://i.imgur.com/90UtNHV.png?1',
	'https://i.imgur.com/ti5KR6y.png?1',
	'https://i.imgur.com/6Fmty3T.png?1',
	'https://i.imgur.com/FcHT7XH.png?1'
];

export default {
	name: 'dice',
	alias: ['dado'],
	category: 'general',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.dice.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.dice.description,
	req: {
		minArgs: 0,
		cooldown: 3,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( _client, msg, _args ) => {
		const lang = language( { guild: msg.guild } );

		const embedAnimate = sendEmbed( {
			title: lang.dice.titleGif,
			image: animate[Math.floor( Math.random() * animate.length )],
			returnEmbed: true,
		} );

		msg.channel.send( { embeds: [embedAnimate] } ).then( ( msgDice ) => {
			setTimeout( () => {
				const embed = sendEmbed( {
					title: lang.dice.titleDice.replace( '{{ user }}', msg.author.username ),
					image: faceDice[Math.floor( Math.random() * faceDice.length )],
					returnEmbed: true,
				} );

				msgDice.edit( { embeds: [embed] } );
			}, 3000 );
		} );
	},
};
