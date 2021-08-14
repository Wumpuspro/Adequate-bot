import { sendEmbed } from '../../util';
import { isDev } from '../../functions/checkPermissions';

import language from '../../functions/language';

let lang;

const printCategory = async ( client, msg, embed, category, isDevUser ) => {
	const isdm = msg.channel.type;

	const commands = client.commands.filter( ( cmd ) => {
		if ( cmd.category === category ) {
			if ( isDevUser ) return true;

			if ( ( isdm === 'dm' ) && cmd.req.dm === 'not' ) return false;
			if ( cmd.req.visible ) {
				return true;
			}
		}
		return false;
	} );

	const nameCategory = category.charAt( 0 ).toUpperCase() + category.slice( 1 );

	if ( commands.size > 0 ) {
		embed.push(
			[
				`🔹 ${ nameCategory } [${commands.size}]:`,
				commands.map( ( cmd ) => `\`${ cmd.name }\`` ).join( ' | ' )
			]
		);
	}
};

const commandMessage = async ( client, msg, isDevUser ) => {
	const fields = [];

	await client.categories.forEach( async ( category ) => {
		await printCategory( client, msg, fields, category, isDevUser );
	} );

	sendEmbed( {
		place: msg.channel,
		text: lang.commands.commandsNum.replace(
			'{{ num }}', client.commands.size
		).replace(
			'{{ prefix }}', client.prefix
		),
		fields,
		author: [lang.commands.title, msg.author.avatarURL( { dynamic: true } )],
		thumbnail: client.user.avatarURL( { dynamic: true } ),
		footer: [lang.commands.footer],
		timestamp: true,
		deleteTime: 60
	} );
};

export default {
	name: 'commands',
	alias: ['cmd', 'cmds', 'comandos'],
	category: 'info',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.commands.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.commands.description,
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

		if ( args[0] === '-dev' ) {
			const isDevUser = await isDev( msg.author.id );
			if ( isDevUser ) return commandMessage( client, msg, true );
		}

		await commandMessage( client, msg, false );
	},
};
