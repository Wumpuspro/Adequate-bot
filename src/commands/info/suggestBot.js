import { sendEmbed } from '../../util';
import * as config from '../../configDiscord';

import language from '../../functions/language';

export default {
	name: 'suggestbot',
	alias: ['sb', 'sugerirbot'],
	category: 'info',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.suggestbot.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.suggestbot.description,
	req: {
		minArgs: 1,
		cooldown: 60,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( client, msg, args ) => {
		const lang = language( { guild: msg.guild } );

		const guild = client.guilds.cache.get( config.suggestionChannel[0] );
		const channel = guild.channels.cache.get( config.suggestionChannel[1] );

		let text;

		if ( msg.guild ) {
			text = lang.suggestbot.inserver.replace(
				'{{ server }}', msg.guild.name
			).replace(
				'{{ serverId }}', msg.guild.id
			).replace(
				'{{ content }}', args.join( '' )
			);
		} else {
			text = lang.suggestbot.inmd.replace(
				'{{ content }}', args.join( '' )
			);
		}

		sendEmbed( {
			place: channel,
			text,
			author: [msg.author.username, msg.author.avatarURL( { dynamic: true } )],
			footer: [msg.author.id],
			timestamp: true
		} );

		sendEmbed( {
			place: msg.channel,
			text: lang.suggestbot.message.replace(
				'{{ user }}', msg.author
			),
			author: [client.user.username, client.user.avatarURL( { dynamic: true } )],
			timestamp: true
		} );
	},
};
