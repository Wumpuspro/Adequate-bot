import { sendEmbed, getUserWithId } from '../../util';

import language from '../../functions/language';

let lang;

const avatarGenerator = async ( msg, message ) => {
	message = message.replace( / |[<]|!|@|[>]/g, '' );

	sendEmbed( {
		place: msg.channel,
		author: [msg.author.username, msg.author.displayAvatarURL()],
		image: `https://api.multiavatar.com/${ message }.png`,
		footer: [message]
	} );
};

const avatar = async ( msg, user ) => {
	sendEmbed( {
		place: msg.channel,
		author: [msg.author.username, msg.author.displayAvatarURL()],
		title: lang.avatar.title.replace( '{{ user }}', user.username ),
		url: user.avatarURL( { dynamic: true, size: 512, format: 'png' } ),
		image: user.displayAvatarURL( { dynamic: true, size: 512 } )
	} );
};

export default {
	name: 'getavatar',
	alias: ['avatar'],
	category: 'general',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.avatar.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.avatar.description,
	req: {
		minArgs: 0,
		cooldown: 5,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( client, msg, args ) => {
		lang = language( { guild: msg.guild } );
		let user;

		if ( args[0] && args[1] !== '-gen' ) {
			user = await getUserWithId( { client, msg, mention: args[0] } );
		}
		if ( user === 'notFound' ) return sendEmbed( { place: msg.channel, text: lang.general.userNotFound, deleteTime: 5 } );

		const dataUser = user || msg.author;

		if ( args[1] === '-gen' ) {
			await avatarGenerator( msg, args[0] );
		} else {
			await avatar( msg, dataUser );
		}
	}
};
