import Table from 'ascii-table';
import { readdirSync } from 'fs';
import { join } from 'path';

let lang;

const attributes = ['name', 'req', 'run'];
const reqs = ['once', 'enable'];
const areFunctions = ['run'];

const verifyStructure = ( table, event, eventFile ) => {
	for ( const attribute of attributes ) {
		if ( !event[attribute] ) {
			table.addRow( eventFile, lang.init.notAttribute.replace( '{{ attribute }}', attribute ) );
			return false;
		}
	}
	for ( const req of reqs ) {
		if ( event.req[req] === undefined ) {
			table.addRow( eventFile, lang.init.notReq.replace( '{{ req }}', req ) );
			return false;
		}
	}
	for ( const isFunction of areFunctions ) {
		if ( typeof event[isFunction] !== 'function' ) {
			table.addRow( eventFile, lang.init.notFunction.replace( '{{ notFunction }}', isFunction ) );
			return false;
		}
	}

	if ( !event.req.enable ) {
		table.addRow( eventFile, lang.init.disabled );
		return false;
	}

	return true;
};

export const importEvents = async ( client, language ) => {
	lang = language;
	client.eventCount = 0;

	const table = new Table( lang.init.events.title );
	table.setHeading( lang.init.events.head1, lang.init.head );

	for ( const eventFile of readdirSync( join( __dirname, '../data/events' ) ) ) {
		if ( !eventFile.includes( '.js' ) ) continue;
		const event = await import( `../data/events/${ eventFile }` );

		const isValid = verifyStructure( table, event.default, eventFile );
		if ( !isValid ) continue;

		const { once } = event.default.req;
		client[once ? 'once' : 'on']( event.default.name, event.default.run.bind( null, client ) );

		client.eventCount++;
		if ( once ) {
			table.addRow( eventFile, lang.init.hidden );
		} else {
			table.addRow( eventFile, lang.init.good );
		}

		delete require.cache[require.resolve( `../data/events/${eventFile}` )];
	}

	console.log( table.toString() );
};
