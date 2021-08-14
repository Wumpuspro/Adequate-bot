import Table from 'ascii-table';
import { join } from 'path';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';

let lang;

const attributes = ['name', 'alias', 'category', 'version', 'usage', 'description', 'req', 'run'];
const reqs = ['minArgs', 'cooldown', 'dm', 'enable', 'visible', 'permissions', 'necessary'];
const areFunctions = ['usage', 'description', 'run'];

const verifyStructure = ( table, command, commandFile ) => {
	for ( const attribute of attributes ) {
		if ( !command[attribute] ) {
			table.addRow( commandFile, lang.init.notAttribute.replace( '{{ attribute }}', attribute ) );
			return false;
		}
	}
	for ( const req of reqs ) {
		if ( command.req[req] === undefined ) {
			table.addRow( commandFile, lang.init.notReq.replace( '{{ req }}', req ) );
			return false;
		}
	}
	for ( const isFunction of areFunctions ) {
		if ( typeof command[isFunction] !== 'function' ) {
			table.addRow( commandFile, lang.init.notFunction.replace( '{{ notFunction }}', isFunction ) );
			return false;
		}
	}

	if ( !command.req.enable ) {
		table.addRow( commandFile, lang.init.disabled );
		return false;
	}

	return true;
};

export const importCommands = async ( client, language ) => {
	lang = language;
	client.commands = new Collection();
	client.categories = [];

	const table = new Table( lang.init.commands.title );
	table.setHeading( lang.init.commands.head1, lang.init.head );

	for ( const subfolder of readdirSync( join( __dirname, '../data/commands' ) ) ) {
		let archs;
		try {
			archs = readdirSync( join( __dirname, `../data/commands/${ subfolder }` ) );
		} catch ( error ) {
			table.addRow( subfolder, lang.init.commands.notWorking );
			archs = [];
		}

		for ( const commandFile of archs ) {
			if ( !commandFile.includes( '.js' ) ) continue;
			const command = await import( `../data/commands/${ subfolder }/${ commandFile }` );

			const isValid = verifyStructure( table, command.default, commandFile );
			if ( !isValid ) continue;

			client.commands.set( command.default.name, command.default );

			if ( !client.categories.includes( command.default.category ) ) {
				client.categories.push( command.default.category );
			}

			if ( !command.default.req.visible ) {
				table.addRow( commandFile, lang.init.hidden );
			} else {
				table.addRow( commandFile, lang.init.good );
			}
		}
	}

	console.log( table.toString() );
};
