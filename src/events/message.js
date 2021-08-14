import { sendEmbed, sendMsg } from '../util';
import * as config from '../configDiscord';
import { getPrefix } from '../../db/prefix';
import { getSplit, splDes } from '../../db/splitString';

import { checkArgs, checkMd, divideArgs } from '../functions/checkArgs';
import { checkPermissions } from '../functions/checkPermissions';
import { cooldown } from '../functions/cooldown';

import language from '../functions/language';

let lang;
let deleteMessage;

const checkCommand = async ( client, msg, CMD, args ) => {
	const commandFind = client.commands.get( CMD );

	if ( msg.guild ) {
		const havePermissions = await checkPermissions( msg.guild.me, commandFind.req.necessary );
		if ( !havePermissions ) {
			return sendEmbed( {
				place: msg.channel,
				text: `\`\`\`${ commandFind.req.necessary.map( ( cmd ) => `${ cmd }` ).join( ', ' ) }\`\`\``,
				title: lang.message.notHavePermissions,
				deleteTime: 15
			} );
		}
	}

	const isMd = checkMd( commandFind.req.dm, msg.channel.type );
	if ( !isMd ) {
		if ( msg.channel.type === 'dm' ) {
			return sendMsg( {
				place: msg,
				text: lang.message.notMd,
				reply: true,
				deleteTime: 5
			} );
		}

		return sendMsg( {
			place: msg,
			text: lang.message.notServer,
			reply: true,
			deleteTime: 5
		} );
	}

	const isPermitValid = await checkPermissions( msg.member, commandFind.req.permissions );
	if ( !isPermitValid ) {
		return sendEmbed( {
			place: msg.channel,
			title: lang.message.invalidPermissions,
			text: `\`\`\`${ commandFind.req.permissions.map( ( cmd ) => `${ cmd }` ).join( ', ' ) }\`\`\``,
			deleteTime: 15
		} );
	}

	const isArgsValid = await checkArgs( commandFind.req.minArgs, args.length );
	if ( !isArgsValid ) {
		return sendEmbed( {
			place: msg.channel,
			text: lang.message.invalidArgs.replace(
				'{{ usage }}', commandFind.usage( lang, client.prefix, await splDes( msg.guild ) )
			),
			deleteTime: 120
		} );
	}

	const notCooldown = cooldown( msg.author, commandFind.name, commandFind.req.cooldown );
	if ( !notCooldown ) {
		return sendMsg( {
			place: msg,
			text: lang.message.cooldown.replace( '{{ seg }}', commandFind.req.cooldown ),
			reply: true,
			deleteTime: 10
		} );
	}

	try {
		commandFind.run( client, msg, args );
	} catch ( e ) {
		sendMsg( {
			place: msg,
			text: lang.message.error.replace( '{{ dev }}', config.devs[0][0] ),
			reply: true,
			deleteTime: 5
		} );
	}
};

const verifySendMsg = async ( msg ) => {
	if ( !msg.guild.me.permissions.has( 'SEND_MESSAGES' ) ) {
		sendEmbed( {
			place: msg,
			text: lang.message.notSendMsg.replace( '{{ server }}', msg.guild.name ),
			deleteTime: 30
		} );
		return true;
	}

	if ( !msg.guild.me.permissions.has( 'EMBED_LINKS' ) ) {
		sendMsg( {
			place: msg.channel,
			text: lang.message.notSendEmbeds,
			deleteTime: 20
		} );
		return true;
	}

	return false;
};

const mentionPrefix = async ( client, msg ) => {
	if ( msg.content.startsWith( client.prefix ) ) {
		deleteMessage = true;
		if ( msg.guild ) {
			const sendMsgChannel = await verifySendMsg( msg );
			if ( sendMsgChannel ) return false;
		}

		const stringArgs = await divideArgs( client, msg.content, client.prefix );
		let CMD = stringArgs[0];
		const args = stringArgs[1];

		if ( client.commands.find( ( c ) => c.alias.includes( CMD ) ) ) {
			const com = client.commands.find( ( c ) => c.alias.includes( CMD ) );
			CMD = com.name;
		}

		if ( !client.commands.has( CMD ) ) {
			deleteMessage = false;
			return sendEmbed( {
				place: msg.channel,
				text: lang.general.commandNotFound,
				deleteTime: 5
			} );
		}

		checkCommand( client, msg, CMD, args );
	}
};

const mentionBot = async ( client, msg ) => {
	if ( msg.content.startsWith( `<@!${client.user.id}>` ) || msg.content.startsWith( `<@${client.user.id}>` ) ) {
		deleteMessage = true;
		if ( msg.guild ) {
			const sendMsgChannel = await verifySendMsg( msg );
			if ( sendMsgChannel ) return false;
		}

		if ( msg.content === `<@!${client.user.id}>` || msg.content === `<@${client.user.id}>` ) {
			return sendEmbed( {
				place: msg.channel,
				text: lang.message.mentionBot.replace( /{{ prefix }}/g, client.prefix ),
				deleteTime: 10
			} );
		}

		let data;

		// eslint-disable-next-line no-unused-expressions
		msg.content.startsWith( `<@${client.user.id}>` ) ? data = `<@${client.user.id}>` : data = `<@!${client.user.id}>`;

		const args = msg.content.slice( data.length ).trim().split( / +/ );
		args.unshift( client.prefix );
		msg.content = args.join( ' ' );
	}
};

export default {
	name: 'messageCreate',
	req: {
		once: false,
		enable: true,
	},
	run: async ( client, msg ) => {
		if ( msg.author.bot ) return;

		deleteMessage = false;
		lang = language( { guild: msg.guild } );

		client.prefix = await getPrefix( msg );
		client.splitStrings = await getSplit( msg );

		const isFalse = await mentionBot( client, msg );
		if ( !isFalse ) await mentionPrefix( client, msg );

		if ( deleteMessage ) msg.delete().catch( () => {} );
	},
};
