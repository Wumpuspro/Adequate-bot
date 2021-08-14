export default {
	name: 'interactionCreate',
	req: {
		once: false,
		enable: true,
	},
	run: async ( _client, interaction ) => {
		if ( !interaction.isCommand() ) return;
		if ( interaction.commandName === 'ping' ) {
			await interaction.reply( 'pong! Dx' );
		}
	},
};
