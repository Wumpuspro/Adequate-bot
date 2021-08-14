import { sendLog } from '../web/hooks';

import { sendEmbed } from '../util';
import language from '../functions/language';

export default {
	name: 'emojiUpdate',
	req: {
		once: false,
		enable: true,
	},
	run: async ( _client, oldEmoji, newEmoji ) => {
		const lang = language( { guild: oldEmoji.guild } );

		sendLog( {
			embeds: [
				sendEmbed( {
					title: lang.emojiUpdate.title,
					text: lang.emojiUpdate.description.replace(
						'{{ oldName }}', oldEmoji.name
					).replace(
						'{{ newName }}', newEmoji.name
					),
					timestamp: true,
					footer: [oldEmoji.guild.name, oldEmoji.guild.iconURL()],
					returnEmbed: true
				} )
			]
		} );
	},
};
