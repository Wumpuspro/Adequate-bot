import { db } from './configDb';

import * as config from '../data/configDiscord';

const dbPrefix = new db.table( 'prefix' );

export const getPrefix = async ( msg ) => {
	if ( msg.channel.type === 'dm' ) return config.prefix;

	if ( !dbPrefix.has( `${ msg.guild.id }` ) ) {
		dbPrefix.set( `${ msg.guild.id }`, config.prefix );
	}
	const prefix = dbPrefix.get( `${ msg.guild.id }` );

	return prefix;
};

export const setPrefix = async ( msg, pref ) => {
	dbPrefix.set( `${ msg.guild.id }`, pref );
};
