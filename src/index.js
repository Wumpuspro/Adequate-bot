/* eslint-disable no-console */
import { Client, Collection } from 'discord.js';

import './configServer';
import './interactionCommand';

import { password } from './private/login';
import { intents, partials } from './private/configClient';

import { importEvents } from './handlers/events';
import { importCommands } from './handlers/commands';
import { importLanguages } from './handlers/languages';
import { importFonts } from './handlers/fonts';

import language from './data/functions/language';

export const client = new Client( {
	intents,
	partials
} );

client.guildSettings = new Collection();

importLanguages( client ).then( () => {
	const lang = language( { client } );

	importEvents( client, lang );
	importCommands( client, lang );
	importFonts( client, lang );
} );

client.login( token );
