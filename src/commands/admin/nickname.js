import { sendEmbed, getUserWithId } from '../../util';
import { isManageable } from '../../functions/checkPermissions';

import language from '../../functions/language';

export default {
	name: 'nickname',
	alias: ['apodo', 'nick'],
	category: 'admin',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.nickname.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.nickname.description,
	req: {
		minArgs: 2,
		cooldown: 0,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: ['MANAGE_NICKNAMES'],
		necessary: ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME']
	},
	run: async ( client, msg, args ) => {
		const lang = language( { guild: msg.guild } );

		const user = await getUserWithId( {
			client,
			msg,
			mention: args[0],
			member: true
		} );

		if ( !user || user === 'notFound' ) return sendEmbed( { place: msg.channel, text: lang.general.userNotFound, deleteTime: 3 } );

		const isManageableMember = isManageable( lang, msg, user, client.user.id );
		if ( !isManageableMember ) return;

		await user.setNickname( args[1] );
		sendEmbed( {
			place: msg.channel,
			text: lang.nickname.success.replace(
				'{{ user }}', user
			).replace(
				'{{ nick }}', args[1]
			),
			deleteTime: 10
		} );
	},
};
