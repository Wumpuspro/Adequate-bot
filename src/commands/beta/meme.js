import { MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';

import { sendEmbed, sendMsg } from '../../util';

import language from '../../functions/language';

let lang;

const loadMeme = async ( msg, image, txt, color ) => {
	const photo = await loadImage( image ).catch( () => {} );
	if ( !photo ) {
		return sendEmbed( {
			place: msg.channel,
			text: lang.meme.imgNotWork,
			deleteTime: 5
		} );
	}

	let { width, height } = photo;
	if ( width < 700 ) {
		width *= 2;
		height *= 2;
	}

	const spaceWhite = height / 4;
	const fontWidth = spaceWhite / 3;
	const spaceFont = ( spaceWhite / 4 ) + ( spaceWhite / 10 );

	const canvasMeme = createCanvas( width, height + spaceWhite );
	const ctx = canvasMeme.getContext( '2d' );

	ctx.fillStyle = '#FFF';
	ctx.fillRect( 0, 0, width, spaceWhite );

	ctx.fillStyle = color;
	ctx.font = `${ fontWidth }px Comicsans`;
	ctx.textAlign = 'center';

	ctx.drawImage( photo, 0, spaceWhite, width, height );
	ctx.fillText( txt, width / 2, spaceFont );

	const att = new MessageAttachment( canvasMeme.toBuffer(), 'meme.png' );
	sendMsg( {
		place: msg.channel,
		att
	} );
};

export default {
	name: 'meme',
	alias: ['momo', 'mm'],
	category: 'beta',
	version: '1.0.0',
	usage: ( langs, p, s ) => langs.meme.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.meme.description,
	req: {
		minArgs: 2,
		cooldown: 10,
		dm: 'yes',
		enable: true,
		visible: true,
		permissions: [],
		necessary: ['ATTACH_FILES']
	},
	run: async ( _client, msg, args ) => {
		lang = language( { guild: msg.guild } );
		let color = args[2];

		const test1 = /^#([0-9A-F]{3}){1,2}$/i.test( color );
		const test3 = /^#[0-9A-F]{8}$/i.test( color );

		if ( !color || ( test1 && test3 ) ) color = '#000';

		await loadMeme( msg, args[0], args[1], color );
	},
};
