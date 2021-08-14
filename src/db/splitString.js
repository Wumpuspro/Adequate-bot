import { db } from './configDb';
import * as config from '../data/configDiscord';

const dbSplitString = new db.table( 'splitString' );

export const getSplit = async ( msg ) => {
	if ( msg.channel.type === 'dm' ) return { status: config.splitStrings[0], value: config.splitStrings[1] };

	if ( !dbSplitString.has( `${ msg.guild.id }` ) ) {
		dbSplitString.set( `${ msg.guild.id }`, { status: config.splitStrings[0], value: config.splitStrings[1] } );
	}

	return dbSplitString.get( `${ msg.guild.id }` );
};

export const setSplit = async ( msg, status, value ) => {
	dbSplitString.set( `${ msg.guild.id }`, { status, value } );
};

export const splDes = async ( guild ) => {
	if ( guild ) {
		const splitStrings = dbSplitString.get( `${ guild.id }` );

		if ( splitStrings.status ) return splitStrings.value;
		return '';
	}

	return config.splitStrings[1];
};
