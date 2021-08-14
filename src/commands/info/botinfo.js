import { sendEmbed, getLink } from '../../util';
import * as config from '../../configDiscord';

import language from '../../functions/language';

export default {
	name: 'botinfo',
	alias: ['bot'],
	category: 'info',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.botinfo.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.botinfo.description,
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

		const fields = [
			[
				lang.botinfo.titleGeneral,
				lang.botinfo.fieldGeneral.replace(
					'{{ dev }}', `[\`${config.devs[0][0]}\`](${ getLink( config.devs[0][1], 2 ) })`
				).replace(
					'{{ servers }}', client.guilds.cache.size
				).replace(
					'{{ users }}', client.users.cache.size
				).replace(
					'{{ channels }}', client.channels.cache.size
				),
				true
			],
			[
				lang.botinfo.titleBot,
				lang.botinfo.fieldBot.replace(
					'{{ ping }}', Math.round( client.ws.ping )
				).replace(
					'{{ commands }}', client.commands.size
				).replace(
					'{{ discordV }}', config.discordV
				).replace(
					'{{ nodeV }}', config.nodeV
				),
				true
			]
		];

		sendEmbed( {
			place: msg.channel,
			title: lang.botinfo.title,
			text: lang.botinfo.descriptionBot,
			thumbnail: client.user.avatarURL( { dynamic: true } ),
			footer: [`👾 ${ config.botV }`],
			fields
		} );
	},
};
