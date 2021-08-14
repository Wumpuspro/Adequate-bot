import { getMsgTicket, setMsgTicket } from '../../../db/ticket';

import { sendEmbed, sendMsg } from '../../util';
import language from '../../functions/language';

let lang;

const descriptionTicket = async ( channel, user, msg ) => {
	if ( !lang ) lang = language( { guild: msg.guild } );
	sendMsg( {
		place: channel,
		text: `<@${ user.id }>`,
		deleteTime: 1
	} );

	const embed = sendEmbed( {
		title: lang.ticket.titleTicket,
		text: lang.ticket.descripTicket.replace( '{{ id }}', user.id ),
		timestamp: true,
		returnEmbed: true,
	} );

	channel.send( { embeds: [embed] } ).then( ( msg ) => {
		msg.react( '❌' );
	} );
};

const createCategory = async ( msg, name ) => {
	const channel = await msg.guild.channels.create( name, {
		reason: 'Ticket Category',
		type: 'GUILD_CATEGORY'
	} );

	return channel;
};

export const createTicket = async ( client, msg, member ) => {
	let nameUser = member.nickname || member.user.username;

	nameUser = nameUser.trim().toLowerCase().replace( /[^a-zA-Z1-9]/g, '' );
	nameUser += `⚪${member.user.discriminator}`;

	const canal = await msg.guild.channels.cache.find(
		( c ) => c.name === `ticket-${ nameUser }`
	);
	if ( canal ) return;

	let categoryTicket = await msg.guild.channels.cache.find( ( ch ) => ch.name === '📨 Tickets' );
	if ( !categoryTicket ) categoryTicket = await createCategory( msg, '📨 Tickets' );

	msg.guild.channels.create( `ticket-${ nameUser }`,
		{
			reason: 'Ticket',
			permissionOverwrites: [
				{
					id: member.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
				},
				{
					id: msg.guild.roles.everyone,
					deny: ['VIEW_CHANNEL']
				},
				{
					id: client.user.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
				}
			],
			type: 'text',
			parent: categoryTicket
		} ).then( ( channel ) => {
		descriptionTicket( channel, member, msg );
	} );
};

const description = async ( msg ) => {
	const msgId = await getMsgTicket( msg );
	await msg.channel.messages.fetch( msgId ).then( ( msgTicket ) => {
		msgTicket.delete();
	} ).catch( () => {} );

	return sendEmbed( {
		title: lang.ticket.titleSupport,
		text: lang.ticket.descripEnable,
		returnEmbed: true
	} );
};

const deleteDescription = async ( msg ) => {
	const msgId = await getMsgTicket( msg );
	await msg.channel.messages.fetch( msgId ).then( ( msgTicket ) => {
		msgTicket.delete();
	} ).catch( () => {} );

	const embed = sendEmbed( {
		title: lang.ticket.titleSupport,
		text: lang.ticket.descripDisabled,
		timestamp: true,
		returnEmbed: true
	} );

	msg.channel.send( { embeds: [embed] } ).then( async ( msgEmbed ) => {
		await setMsgTicket( msg, msgEmbed.id );
	} );
};

export default {
	name: 'ticket',
	alias: ['ticket-setup'],
	category: 'admin',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.ticket.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.ticket.description,
	req: {
		minArgs: 0,
		cooldown: 0,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: ['ADMINISTRATOR'],
		necessary: ['ADD_REACTIONS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY']
	},
	run: async ( _client, msg, args ) => {
		lang = language( { guild: msg.guild } );

		if ( args[0] === 'close' ) return deleteDescription( msg );

		const embed = await description( msg );

		msg.channel.send( { embeds: [embed] } ).then( async ( msgEmbed ) => {
			await setMsgTicket( msg, msgEmbed.id );
			msgEmbed.react( '📩' );
		} );
	},
};
