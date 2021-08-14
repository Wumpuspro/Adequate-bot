import { sendEmbed, getDate } from '../../util';

import language from '../../functions/language';

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

export default {
	name: 'serverinfo',
	alias: ['server'],
	category: 'beta',
	version: '0.9.0',
	usage: ( langs, p, s ) => langs.server.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.server.description,
	req: {
		minArgs: 0,
		cooldown: 0,
		dm: 'not',
		enable: true,
		visible: true,
		permissions: [],
		necessary: []
	},
	run: async ( _client, msg, _args ) => {
		const roles = msg.guild.roles.cache.sort( ( a, b ) => b.position - a.position ).map( ( role ) => role.toString() );
		const members = msg.guild.members.cache;
		const channels = msg.guild.channels.cache;
		const emojis = msg.guild.emojis.cache;
		const server = msg.guild;

		const lang = language( { guild: msg.guild } );

		roles.pop();
		const fields = [
			/* [lang.server.region, regions[server.region], true], */
			/* [lang.server.owner, `<@${server.owner.user.id}>`, true], */
			[lang.server.date, getDate( { lang, date: server.createdTimestamp } )],
			['General', `
			> **Name:** ${server.name}
			> **Boost Tier:** ${server.premiumTier ? `Tier ${server.premiumTier}` : 'None'}
			> **Explicit Filter:** ${filterLevels[server.explicitContentFilter]}
			> **Verification Level:** ${verificationLevels[server.verificationLevel]}
			`, true],
			/* ['Presence', `
			> **Online:** ${members.filter( ( member ) => member.presence.status === 'online' ).size}
			> **Idle:** ${members.filter( ( member ) => member.presence.status === 'idle' ).size}
			> **Do Not Disturb:** ${members.filter( ( member ) => member.presence.status === 'dnd' ).size}
			> **Offline:** ${members.filter( ( member ) => member.presence.status === 'offline' ).size}
			`, true], */
			['Statistics', `
			> **Emoji Count:** ${emojis.size}
			> **Regular Emoji Count:** ${emojis.filter( ( emoji ) => !emoji.animated ).size}
			> **Animated Emoji Count:** ${emojis.filter( ( emoji ) => emoji.animated ).size}
			> **Member Count:** ${server.memberCount}
			> **Humans:** ${members.filter( ( member ) => !member.user.bot ).size}
			> **Bots:** ${members.filter( ( member ) => member.user.bot ).size}
			> **Text Channels:** ${channels.filter( ( channel ) => channel.type === 'text' ).size}
			> **Voice Channels:** ${channels.filter( ( channel ) => channel.type === 'voice' ).size}
			> **Boost Count:** ${server.premiumSubscriptionCount || '0'}
			`],
			[`Roles [${roles.length}]`, roles.join( ', ' )]
		];

		sendEmbed( {
			place: msg.channel,
			thumbnail: server.iconURL( { dynamic: true } ),
			fields,
			author: [server.name, server.iconURL( { dynamic: true } )],
			footer: [`${lang.server.id}: ${server.id}`]
		} );
	},
};
