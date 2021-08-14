import { sendEmbed } from '../../util';

import language from '../../functions/language';

export default {
	name: 'ping',
	alias: ['pong'],
	category: 'info',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.ping.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.ping.description,
	req: {
		minArgs: 0,
		cooldown: 0,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( client, msg, _args ) => {
		const lang = language( { guild: msg.guild } );

		const embed = sendEmbed( {
			text: lang.ping.loading,
			returnEmbed: true
		} );

		msg.channel.send( { embeds: [embed] } ).then( ( msgPing ) => {
			const embedPing = sendEmbed( {
				title: lang.ping.title,
				text: lang.ping.text.replace(
					'{{ pingMsg }}', msgPing.createdTimestamp - msg.createdTimestamp
				).replace(
					'{{ pingApi }}', Math.round( client.ws.ping )
				),
				timestamp: true,
				returnEmbed: true
			} );
			msgPing.edit( { embeds: [embedPing] } );
		} );
	},
};
