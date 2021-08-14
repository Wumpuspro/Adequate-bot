import { loadLanguages, languageChannel } from '../functions/language';

export default {
	name: 'ready',
	req: {
		once: true,
		enable: true,
	},
	run: async ( client ) => {
		loadLanguages( client );
		const lang = languageChannel( {} );

		console.log(
			`\n ${ lang.ready.bot.replace(
				'{{ nameBot }}', client.user.tag
			) }! \n`
		);

		console.log(
			`${ lang.ready.events.replace(
				'{{ events }}', client.eventCount
			) }`
		);
		console.log(
			`${ lang.ready.commands.replace(
				'{{ commands }}', client.commands.size
			) }`
		);

		console.log( client.categories );

		console.log( '======================' );

		console.log(
			`${ lang.ready.servers.replace(
				'{{ servers }}', client.guilds.cache.size
			) }`
		);

		console.log(
			`${ lang.ready.users.replace(
				'{{ users }}', client.users.cache.size
			) }\n`
		);

		const name = lang.ready.actiName.replace(
			'{{ servers }}', client.guilds.cache.size
		);

		client.user.setPresence( {
			activities: [
				{
					name
				}
			],
			status: 'idle'
		} );
	},
};
