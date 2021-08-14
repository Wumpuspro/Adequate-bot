import { sendEmbed } from '../util';
import * as config from '../configDiscord';

export const checkPermissions = async ( member, permissions ) => {
	const data = permissions.map( ( permit ) => {
		if ( permit === 'OWNER_PROGRAMMER-MEMBER' ) {
			const isDev = config.devs.map( ( dev ) => {
				if ( dev[1] === member.id ) {
					return true;
				}
				return false;
			} );
			if ( isDev.includes( true ) ) return true;
		} else if ( member.permissions.has( permit ) ) {
			return true;
		}
		return false;
	} );

	if ( data.includes( false ) ) return false;
	return true;
};

export const isDev = async ( id ) => {
	const isDev = config.devs.map( ( dev ) => {
		if ( dev[1] === id ) {
			return true;
		}
		return false;
	} );

	if ( isDev.includes( true ) ) return true;
};

export const isManageable = ( lang, msg, member, id ) => {
	if ( id === member.id ) return true;
	if ( !member.manageable ) {
		sendEmbed( {
			place: msg.channel,
			text: lang.general.notManageable,
			deleteTime: 2
		} );
		return false;
	}

	return true;
};
