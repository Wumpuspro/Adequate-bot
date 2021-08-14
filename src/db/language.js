import { db } from './configDb';
import * as config from '../data/configDiscord';

const dbLanguage = new db.table( 'language' );

export const getLanguage = async ( id ) => {
	if ( !dbLanguage.has( `${ id }` ) ) {
		dbLanguage.set( `${ id }`, config.language.toUpperCase() );
	}
	const language = dbLanguage.get( `${ id }` );

	return language;
};

export const setLanguage = async ( msg, language ) => {
	dbLanguage.set( `${ msg.guild.id }`, language );
};
