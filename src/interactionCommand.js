import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { password } from './private/login';

const idBot = '868110606673252383';
const idServer = '872467020980039681';

const commands = [{
	name: 'ping',
	description: 'Ping bot'
}];

const rest = new REST( { version: '9' } ).setToken( password );

( async () => {
	try {
		console.log( 'Started refreshing application (/) commands.' );
		await rest.put(
			Routes.applicationGuildCommands( idBot, idServer ),
			{ body: commands },
		);
		console.log( 'Successfully reloaded application (/) commands.' );
	} catch ( error ) {
		console.error( error );
	}
} )();
