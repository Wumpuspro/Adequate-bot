import { WebhookClient } from 'discord.js';
import { webhookLogs, webhookWelcome } from '../../private/login';

export const sendLog = async ( data = {
	tts: '',
	content: '',
	embeds: [],
	files: [],
	stickers: [],
} ) => {
	if ( !webhookLogs ) return;

	const hook = new WebhookClient( {
		url: webhookLogs,
	} );
	hook.send( { ...data } );
};

export const sendWelcome = async ( data = {
	tts: '',
	content: '',
	embeds: [],
	files: [],
	stickers: [],
} ) => {
	if ( !webhookWelcome ) return;

	const hook = new WebhookClient( {
		url: webhookWelcome
	} );
	hook.send( { ...data } );
};
