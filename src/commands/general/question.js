import { sendEmbed } from '../../util';

import language from '../../functions/language';

let lang;

export default {
	name: 'question',
	alias: ['q'],
	category: 'general',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.question.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.question.description,
	req: {
		minArgs: 1,
		cooldown: 10,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: ['ADD_REACTIONS']
	},
	run: async ( _client, msg, args ) => {
		lang = language( { guild: msg.guild } );

		const fields = [
			[lang.question.one, lang.question.desOne, true],
			[lang.question.two, lang.question.desTwo, true]
		];

		const embed = sendEmbed( {
			title: lang.question.title,
			text: args.join( ' ' ),
			fields,
			timestamp: true,
			returnEmbed: true
		} );

		msg.channel.send( { embeds: [embed] } ).then( ( msgEmbed ) => {
			msgEmbed.react( '👍' );
			msgEmbed.react( '👎' );
		} );
	},
};
