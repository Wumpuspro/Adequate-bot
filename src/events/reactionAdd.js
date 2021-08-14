import { getMsgTicket } from '../../db/ticket';
import { createTicket } from '../commands/admin/tickets';

export default {
	name: 'messageReactionAdd',
	req: {
		once: false,
		enable: true,
	},
	run: async ( client, reaction, user ) => {
		if ( user.bot ) return;
		if ( !reaction.message.guild ) return;

		const cmdTicket = client.commands.get( 'ticket' ) || client.commands.find( ( c ) => c.alias.includes( 'ticket' ) );
		if ( !cmdTicket ) return;

		const msgId = await getMsgTicket( reaction.message );

		if ( reaction.message.id === msgId && reaction.emoji.name === '📩' ) {
			createTicket(
				client,
				reaction.message,
				await reaction.message.guild.members.fetch( { user } )
			);
			reaction.users.remove( user );
		}

		if ( reaction.message.channel.name.startsWith( 'ticket-' ) && reaction.emoji.name === '❌' ) {
			reaction.message.channel.delete().catch( () => {} );
		}
	},
};
