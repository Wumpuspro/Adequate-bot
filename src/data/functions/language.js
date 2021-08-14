import { language } from '../configDiscord';
import { getLanguage } from '../../db/language';

const guildLanguages = [];
let languagesClient;

export async function loadLanguages( client ) {
	languagesClient = client.languages;

	for ( const guild of client.guilds.cache ) {
		const guildId = guild[0];

		const result = await getLanguage( guildId );

		guildLanguages[guildId] = result;
	}
}

export async function setLanguageUtil( guild, language ) {
	guildLanguages[guild.id] = language.toUpperCase();
}

export const languageChannel = ( { guild, client } ) => {
	const langs = languagesClient || client.languages;

	if ( !guild ) guild = '';
	let selectedLanguage = guildLanguages[guild.id];

	if ( !selectedLanguage ) selectedLanguage = language.toUpperCase();
	const lang = langs.get( selectedLanguage ) || langs.get( 'EN' );

	return lang;
};

export default languageChannel;
