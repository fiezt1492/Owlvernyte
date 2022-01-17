const Discord = require("discord.js");
const translate = require("translate-google");
const locale = require("../../../modules/misc/translate/locale");

module.exports = {
	data: {
		name: "Translate",
		type: 3,
	},

	async execute(interaction) {
		const { client } = interaction;
		const guild = await client.guilds.cache.get(interaction.guildId);
		const channel = await guild.channels.cache.get(interaction.channelId);
		const msg = await channel.messages.fetch(interaction.targetId);

		if (!msg.content || msg.content.length === 0) {
			return await interaction.reply({
				content: `I will not translate a message without content.`,
				ephemeral: true,
			});
		}

		// console.log(msg);

		// let langs = Object.keys(locale)
		// 	.filter((key) => key !== "auto")
		// 	.map((key) => {
		// 		return {
		// 			locale: String(key),
		// 			lang: String(locale[key]),
		// 		};
		// 	});

        let langs = Object.keys(locale)

		console.log(langs);

		// const components = [
		// 	new Discord.MessageActionRow().addComponents(
		// 		new Discord.MessageSelectMenu()
		// 			.setCustomId("translate-locale")
		// 			.setPlaceholder(`Select a language to translate`)
		// 			.addOptions(langs.map(l => {
		//                 return {
		//                     label: l.lang,
		//                     value: l.locale,
		//                     description: `Translate to ${l.lang}`
		//                 }
		//             }))
		// 	),
		// ];

        let TO = guild.preferredLocale ? guild.preferredLocale : "en"

        if (TO == 'en-US') TO = 'en'

        if (!langs.includes(TO)) return await interaction.reply({
            content: `This language is not supported`,
            ephemeral: true,
        });

		let description = await translate(msg.content, {
			from: "auto",
			to: TO,
		});

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: msg.author.tag,
				iconURL: msg.author.displayAvatarURL({ dynamic: true }),
				url: msg.url,
			})
			.setDescription(description)
			.setColor("RANDOM")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.reply({
			embeds: [Embed],
			// components: components ,
			// ephemeral: true,
		});

		let chance = Math.random() * 101;

		if (chance < 10)
			await interaction.followUp({
				content: `> **Note**: *You can change language to translate by changing your guild preferred locale.*`,
			});
		return;
	},
};
