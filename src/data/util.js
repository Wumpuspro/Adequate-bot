import { MessageEmbed } from 'discord.js';
import moment from 'moment';

import * as config from './configDiscord';
import { client } from '../index';

export function getLink( id, num ) {
	const urls = {
		1: `https://discord.com/api/oauth2/authorize?client_id=${ id }&permissions=8&scope=bot%20applications.commands`,
		2: `https://discord.com/users/${ id }`
	};

	return urls[num] ? urls[num] : 'NotFound';
}

export const getDate = ( { lang, date, short = false } ) => {
	moment.locale( lang.languageName );

	if ( short ) return moment( date ).format( 'L' );
	return `${moment( date ).format( 'LT' )}, ${moment( date ).format( 'LL' )} - ${moment( date ).fromNow() }`;
};

export const parseTxtNumber = ( numString ) => {
	let number;
	try {
		number = parseInt( numString, 10 );
		if ( !number ) {
			number = 0;
		}
	} catch ( e ) {
		number = 0;
	}
	return number;
};

export async function getUserWithId( {
	msg,
	mention,
	member = false
} ) {
	const id = mention.replace( /[<]|!|@|[>]/g, '' );

	let user;

	if ( msg.guild ) {
		user = await msg.guild.members.fetch( id ).catch( () => 'notFound' );
	} else {
		user = client;
	}

	if ( member ) return user;
	// eslint-disable-next-line no-unused-expressions
	user === 'notFound' ? user : user = user.user;
	return user;
}

export const sendMsg = ( {
	place,
	text,
	att,
	reply = false,
	deleteTime = false
} ) => {
	if ( reply ) {
		if ( deleteTime ) {
			return place.reply( {
				content: text,
				files: att ? [att] : []
			} ).then( ( msg ) => {
				setTimeout( () => {
					msg.delete().catch( () => {} );
				}, deleteTime * 1000 );
			} ).catch( () => {} );
		}

		return place.reply( {
			content: text,
			files: att ? [att] : []
		} ).catch( () => {} );
	}

	if ( deleteTime ) {
		return place.send( {
			content: text,
			files: att ? [att] : []
		} ).then( ( msg ) => {
			setTimeout( () => {
				msg.delete().catch( () => {} );
			}, deleteTime * 1000 );
		} ).catch( () => {} );
	}

	place.send( {
		content: text,
		files: att ? [att] : []
	} ).catch( () => {} );
};

export const sendEmbed = ( {
	place,
	title = '',
	text = '',
	fields = false,
	image = false,
	author = false,
	timestamp = false,
	thumbnail = false,
	url = false,
	footer = false,
	deleteTime = false,
	returnEmbed = false
} ) => {
	const embed = new MessageEmbed();

	embed.setColor( config.color );
	embed.setTitle( title );
	embed.setDescription( text );

	if ( thumbnail ) embed.setThumbnail( thumbnail );
	if ( timestamp ) embed.setTimestamp( Date.now() );
	if ( author ) embed.setAuthor( author[0], author[1] );
	if ( url ) embed.setURL( url );
	if ( footer ) {
		if ( footer.length > 1 ) {
			embed.setFooter( footer[0], footer[1] );
		} else {
			embed.setFooter( footer.toString() );
		}
	}

	if ( image ) {
		embed.setImage( image );
	}
	if ( fields ) {
		fields.forEach( ( field ) => {
			if ( field[2] ) {
				embed.addField( field[0], field[1], field[2] );
			} else {
				embed.addField( field[0], field[1] );
			}
		} );
	}

	if ( returnEmbed ) return embed;

	if ( deleteTime ) {
		return place.send( { embeds: [embed] } ).then( ( msg ) => {
			setTimeout( () => {
				msg.delete().catch( () => {} );
			}, deleteTime * 1000 );
		} ).catch( () => {} );
	}

	place.send( { embeds: [embed] } ).catch( () => {} );
};
