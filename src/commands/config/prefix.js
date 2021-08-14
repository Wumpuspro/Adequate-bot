import { sendEmbed } from '../../util';
import { setPrefix } from '../../../db/prefix';
import language from '../../functions/language';

export default {
	name: 'setprefix',
	alias: ['prefix', 'pref'],
	category: 'config',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.prefix.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.prefix.description,
	req: {
		minArgs: 1,
		cooldown: 20,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: ['ADMINISTRATOR'],
		necessary: []
	},
	run: async ( _client, msg, args ) => {
		const lang = language( { guild: msg.guild } );
		setPrefix( msg, args.join( ' ' ) );

		sendEmbed( {
			place: msg.channel,
			text: lang.prefix.message.replace( '{{ prefix }}', args.join( ' ' ) ),
			deleteTime: 20
		} );
	},
};
