import { MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';

import { roundImage } from '../functions/canvasFunctions';
import { sendLog, sendWelcome } from '../web/hooks';
import { sendEmbed } from '../util';
import { idServer } from '../../private/login';

import language from '../functions/language';

const wallpaper = 'https://i.imgur.com/f9RlPuM.jpg';

const welcome = async ( member, lang ) => {
	const canvasGoodBye = createCanvas( 1080, 480 );
	const ctx = canvasGoodBye.getContext( '2d' );

	const image = await loadImage( wallpaper ).catch( () => {} );
	const photo = await roundImage( member.user.displayAvatarURL( { format: 'png' } ), 250 );
	const mark = await loadImage( 'https://i.imgur.com/IdQsRoV.png' ).catch( () => {} );
	ctx.drawImage( image, 0, 0, 1080, 480 );
	ctx.drawImage( photo, 415, 30 );
	ctx.drawImage( mark, 405, 20, 275, 275 );

	ctx.font = '60px Fredoka';
	ctx.fillStyle = '#FFF';
	ctx.textAlign = 'center';

	ctx.fillText( lang.memberWelcome.titleCard.replace(
		'{{ member }}', member.user.username
	), canvasGoodBye.width / 2, 375 );
	ctx.fillText( lang.memberWelcome.descriptionCard.replace(
		'{{ server }}', member.guild.name
	), canvasGoodBye.width / 2, 435 );

	const att = new MessageAttachment( canvasGoodBye.toBuffer(), 'goodbye.png' );

	sendWelcome( {
		files: [att]
	} );
};

export default {
	name: 'guildMemberAdd',
	req: {
		once: false,
		enable: true,
	},
	run: async ( _client, member ) => {
		const lang = language( { guild: member.guild } );

		if ( member.guild.id !== idServer ) {
			return sendLog( {
				embeds: [
					sendEmbed( {
						returnEmbed: true,
						title: lang.memberWelcome.title,
						text: lang.memberWelcome.description.replace(
							'{{ member }}', member
						).replace(
							'{{ server }}', member.guild.name
						),
						timestamp: true,
						footer: [member.guild.name, member.guild.iconURL()]
					} )
				]
			} );
		}

		sendEmbed( {
			place: member,
			text: lang.memberWelcome.messageMd.replace(
				'{{ member }}', member
			).replace(
				'{{ server }}', member.guild.name
			)
		} );

		sendWelcome( {
			content: lang.memberWelcome.message.replace(
				'{{ member }}', member
			).replace(
				'{{ server }}', member.guild.name
			)
		} );

		welcome( member, lang );
	},
};
