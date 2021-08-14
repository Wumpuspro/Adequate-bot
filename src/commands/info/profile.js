import { MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';

import { roundImage } from '../../functions/canvasFunctions';

import {
	sendEmbed,
	sendMsg,
	getUserWithId,
	getDate
} from '../../util';

import language from '../../functions/language';

let lang;
const wallpaper = 'https://i.imgur.com/oIeALjr.jpg';

const profileImage = async ( msg, user ) => {
	const member = msg.guild.members.cache.get( user.id );
	const photo = await roundImage( user.displayAvatarURL( { format: 'png' } ), 200 );

	const canvasProfile = createCanvas( 600, 300 );
	const ctx = canvasProfile.getContext( '2d' );

	const image = await loadImage( wallpaper ).catch( () => {} );
	const circle = await loadImage( 'https://i.imgur.com/IdQsRoV.png' ).catch( () => {} );
	ctx.drawImage( image, 0, 0, 600, 300 );
	ctx.drawImage( photo, 370, 50 );
	ctx.drawImage( circle, 360, 40, 220, 220 );

	ctx.fillStyle = '#FFF';
	ctx.font = '40px Itim';
	ctx.fillText( user.username, 50, 50 );

	ctx.fillStyle = '#95A0A090';
	ctx.fillRect( 0, 80, 330, 220 );

	ctx.font = '25px Itim';
	ctx.fillStyle = '#000';
	ctx.fillText( `${lang.profile.nickname}: ${ member.nickname ? member.nickname : '----------' }`, 5, 105 );
	ctx.fillText( lang.profile.tagImg.replace( '{{ tag }}', user.discriminator ), 5, 145 );
	ctx.fillText( `${lang.profile.status}: ${ member.presence.status }`, 5, 165 );
	ctx.fillText( lang.profile.registerImg.replace(
		'{{ date }}', getDate( { lang, date: user.createdAt, short: true } )
	), 5, 205 );
	ctx.fillText( lang.profile.entryImg.replace(
		'{{ date }}', getDate( { lang, date: member.joinedAt, short: true } )
	), 5, 225 );

	ctx.font = '15px Itim';
	ctx.fillText( `${lang.general.id}${ user.id }`, 5, 285 );
	if ( user.bot ) {
		ctx.fillText( lang.profile.bot, 250, 285 );
	} else {
		ctx.fillText( lang.profile.human, 250, 285 );
	}

	const att = new MessageAttachment( canvasProfile.toBuffer(), 'avatar.png' );
	sendMsg( {
		place: msg.channel,
		att
	} );
};

const profile = async ( msg, user ) => {
	const member = msg.guild.members.cache.get( user.id );
	const userFlags = ( await user.fetchFlags() ).toArray();

	const fields = [
		[lang.profile.status, member.presence.status, true],
		[lang.profile.tag, `#${ user.discriminator }`, true],
		[lang.profile.nickname, member.nickname ? member.nickname : '--------', true],
		[lang.profile.register, getDate( { lang, date: user.createdAt } )],
		[lang.profile.entry, getDate( { lang, date: member.joinedAt } )],
		[
			`${lang.profile.roles} [${member._roles.length}]`,
			member._roles.length > 0 ? member._roles.map( ( rol ) => `<@&${rol}>` ).join( ', ' ) : lang.profile.notRoles
		]
	];

	sendEmbed( {
		place: msg.channel,
		title: `🔵 ${ user.username }`,
		fields,
		thumbnail: user.avatarURL( { dynamic: true } ),
		footer: [`${lang.general.id} ${user.id} - ${lang.profile.bot}: ${user.bot ? lang.general.yes : lang.general.not}`],
	} );
};

export default {
	name: 'profile',
	alias: ['userinfo'],
	category: 'info',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.profile.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.profile.description,
	req: {
		minArgs: 0,
		cooldown: 10,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: [],
		necessary: ['ATTACH_FILES']
	},
	run: async ( client, msg, args ) => {
		lang = language( { guild: msg.guild } );
		let user;

		if ( args[0] && args[0] !== '-img' ) {
			user = await getUserWithId( { client, msg, mention: args[0] } );
		}
		if ( user === 'notFound' ) {
			return sendEmbed( {
				place: msg.channel,
				text: lang.general.userNotFound,
				deleteTime: 5
			} );
		}

		const dataUser = user || msg.author;

		if ( args[0] === '-img' || args[1] === '-img' ) {
			await profileImage( msg, dataUser );
		} else {
			await profile( msg, dataUser );
		}
	},
};
