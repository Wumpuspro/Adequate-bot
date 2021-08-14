import { sendEmbed } from '../util';
import language from '../functions/language';

import { sendWelcome } from '../web/hooks';

export default {
	name: 'channelPinsUpdate',
	req: {
		once: false,
		enable: true,
	},
	run: async ( _client, channel, _time ) => {
		const lang = language( { guild: channel.guild } );
		const { id, name } = channel;

		sendWelcome( {
			embeds: [
				sendEmbed( {
					returnEmbed: true,
					title: lang.pinsUpdate.title,
					text: lang.pinsUpdate.description.replace(
						'{{ id }}', id
					),
					timestamp: true,
					footer: [name, channel.guild.iconURL()]
				} )
			]
		} );
	},
};
