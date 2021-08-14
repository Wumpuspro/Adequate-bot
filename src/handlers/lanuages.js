import Table from 'ascii-table';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export const importLanguages = async ( client ) => {
	client.languages = new Collection();

	const table = new Table( 'Languages' );
	table.setHeading( 'Language', 'State of Charge' );

	for ( const languageFile of readdirSync( join( __dirname, '../../lang' ) ) ) {
		if ( !languageFile.includes( '.json' ) ) continue;

		const languageArray = languageFile.split( '-' );
		const language = await import( `../../lang/${ languageFile }` );
		client.languages.set( languageArray[0].toUpperCase(), language.default );

		table.addRow( languageFile, '✅' );
	}

	console.log( table.toString() );
};
