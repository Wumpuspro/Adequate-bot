import { sendEmbed, getLink } from '../../util';
import { isDev } from '../../functions/checkPermissions';
import { splDes } from '../../../db/splitString';

import language from '../../functions/language';

let lang;

const helpMessage = async ( client, msg ) => {
	const text = lang.help.text.replace(
		/{{ prefix }}/g, client.prefix
	).replace(
		'{{ text1 }}', client.splitStrings.status ? lang.help.complements.complement1.replace( '{{ value }}', client.splitStrings.value ) : ''
	);

	sendEmbed( {
		place: msg.channel,
		text,
		author: [client.user.username, client.user.avatarURL( { dynamic: true } )],
		fields: [[lang.help.titleLink, lang.help.links.replace( '{{ link }}', getLink( client.user.id, 1 ) )]]
	} );
};

const helpCommand = async ( client, msg, commandArg ) => {
	const isDevUser = await isDev( msg.author.id );
	const command = client.commands.get( commandArg ) || client.commands.find( ( c ) => c.alias.includes( commandArg ) );

	let visible;
	isDevUser ? visible = true : visible = command.req.visible;
	if ( !command || !visible ) {
		return sendEmbed( {
			place: msg.channel,
			text: lang.help.notFound,
			deleteTime: 5
		} );
	}

	const text = lang.help.settingsCommand.replace(
		'{{ args }}', command.req.minArgs
	).replace(
		'{{ md }}', command.req.dm !== 'not' ? lang.help.complements.complement4 : lang.help.complements.complement5
	).replace(
		'{{ permissions }}', command.req.permissions.length > 0 ? lang.help.complements.complement2 : lang.help.complements.complement3
	).replace(
		'{{ cooldown }}', lang.help.complements.complement6.replace( '{{ seg }}', command.req.cooldown )
	);

	const fields = [
		[lang.help.alias, `${command.alias.map( ( a ) => ` \`${ a }\`` )}`],
		[lang.help.descripCommand, `\`\`\`${ command.description( lang ) }\`\`\``],
		[lang.help.usageCommand, command.usage( lang, client.prefix, await splDes( msg.guild ) )]
	];

	sendEmbed( {
		place: msg.channel,
		title: `${lang.help.name.replace( '{{ command }}', command.name )} - \`${command.category}\``,
		text,
		fields,
		timestamp: true,
		footer: [
			command.version, msg.author.avatarURL( { dynamic: true } )
		],
		deleteTime: 60
	} );
};

export default {
	name: 'help',
	alias: ['h'],
	category: 'info',
	version: '1.0.1',
	usage: ( langs, p, s ) => langs.help.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.help.description,
	req: {
		minArgs: 0,
		cooldown: 0,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( client, msg, args ) => {
		lang = language( { guild: msg.guild } );

		if ( args[0] ) {
			helpCommand( client, msg, args[0] );
		} else {
			await helpMessage( client, msg );
		}
	},
};
