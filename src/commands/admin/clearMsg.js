import { sendEmbed, parseTxtNumber } from '../../util';
import { sendLog } from '../../web/hooks';

import language from '../../functions/language';

const sendMsgClear = ( lang, msg, number ) => {
	sendLog( {
		embeds: [
			sendEmbed( {
				text: lang.clear.message.replace(
					'{{ user }}', msg.member.user.id
				).replace(
					'{{ number }}', number
				).replace(
					'{{ channel }}', msg.channel.id
				),
				returnEmbed: true
			} )
		]
	} );
	sendEmbed( {
		place: msg.channel,
		text: lang.clear.success.replace( '{{ number }}', number ),
		deleteTime: 5
	} );
};

const clearMsg = async ( lang, msg, number ) => {
	await msg.channel.bulkDelete( number + 1, true ).then( ( msgDeleted ) => {
		sendMsgClear( lang, msg, msgDeleted.size === 0 ? msgDeleted.size : msgDeleted.size - 1 );
	} );
};

export default {
	name: 'clear',
	alias: ['cls'],
	category: 'admin',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.clear.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.clear.description,
	req: {
		minArgs: 1,
		cooldown: 2,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: ['MANAGE_MESSAGES'],
		necessary: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY']
	},
	run: async ( _client, msg, args ) => {
		const lang = language( { guild: msg.guild } );

		const number = parseTxtNumber( args[0] );
		if ( number < 0 || number > 99 ) {
			return sendEmbed( {
				place: msg.channel,
				text: lang.clear.error
			} );
		}

		await clearMsg( lang, msg, number );
	},
};
