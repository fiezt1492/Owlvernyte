// Declares constants (destructured) to be used in this file.

// const { Collection } = require("discord.js");
const { client_id } = require("../config");
// const mongo = require("../databases/mongo");
// const Players = require("../modules/economy/players");
const Discord = require("discord.js");
// const ONCE = new Map();

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: "messageCreate",

	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (!client.ready) return;

		if (client.user.presence.status !== "online") return;

		if (message.author.bot || message.channel.type === "dm") return;

		const guildSettings = await client.guildSettings.get(guild.id);
		const i18n = client.i18n;
		i18n.setLocale(guildSettings.locale);

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			const Embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(i18n.__mf("onMention.reply"));

			const components = [
				new Discord.MessageActionRow().addComponents(
					new Discord.MessageButton()
						.setStyle("LINK")
						.setLabel(i18n.__mf("onMention.buttonLabel"))
						.setURL(
							`https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=137976155200&scope=applications.commands%20bot`
						)
				),
				new Discord.MessageActionRow().addComponents(
					new Discord.MessageButton()
						.setStyle("SECONDARY")
						.setLabel(
							i18n.__mf("onMention.sentFrom", {
								guildName: guild.name,
							})
						)
						.setCustomId("sentFrom")
						.setDisabled(true)
				),
			];

			author.send({
				embeds: [Embed],
				components: components,
			});
			return message.react("🦉");
		}
	},
};
