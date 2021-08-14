import { sendLog } from '../web/hooks';
import { sendEmbed } from '../util';
import language from '../functions/language';

export default {
	name: 'channelUpdate',
	req: {
		once: false,
		enable: true,
	},
	run: async ( _client, oldChannel, newChannel ) => {
		const lang = language( { guild: oldChannel.guild } );
		let text;

		if ( !oldChannel.guild ) return;

		if ( oldChannel.name === newChannel.name ) {
			text = lang.channelUpdate.settings.replace(
				'{{ channel }}', newChannel.name
			).replace(
				'{{ id }}', oldChannel.id
			);
		} else {
			text = lang.channelUpdate.nameEdited.replace(
				'{{ oldName }}', oldChannel.name
			).replace(
				'{{ newName }}', newChannel.name
			).replace(
				'{{ id }}', oldChannel.id
			);
		}

		sendLog( {
			embeds: [
				sendEmbed( {
					title: lang.channelUpdate.title,
					text,
					timestamp: true,
					footer: [oldChannel.guild.name, oldChannel.guild.iconURL()],
					returnEmbed: true
				} )
			]
		} );
	},
};
