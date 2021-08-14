import Table from 'ascii-table';
import { registerFont } from 'canvas';
import { readdirSync } from 'fs';
import { join } from 'path';

const publicFolder = join( __dirname, '../../public/fonts' );

export const importFonts = async ( _client, lang ) => {
	const table = new Table( lang.init.fonts.title );
	table.setHeading( lang.init.fonts.head1, lang.init.head );

	for ( const fontsFile of readdirSync( publicFolder ) ) {
		let name = fontsFile.substring( 0, fontsFile.length - 4 );
		name = name.charAt( 0 ).toUpperCase() + name.slice( 1 );

		registerFont( `${ publicFolder }/${ fontsFile }`, {
			family: name
		} );
		table.addRow( name, lang.init.good );
	}

	console.log( table.toString() );
};
