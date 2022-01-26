const config = require("../../../config");
const guildPrefix = require("../../../modules/configuration/guildPrefix");
// const Discord = require("discord.js");
// const disableComponent = require("../../../modules/util/disableComponent");
// let already = new Set();

module.exports = {
	id: "prefixReset",
	filter: "author",

	async execute(interaction) {
		const { client, message } = interaction;

		const Embed = message.embeds[0];

		if ((guildPrefix.get(message)) === config.prefix)
			return interaction.reply({
				content: `Your prefix is already default! You dont need to reset it.`,
				ephemeral: true,
			});

		await guildPrefix.set(message);

		Embed.fields[0] = {
			name: "Current Prefix",
			value: guildPrefix.get(message),
		};

		message.edit({
			embeds: [Embed],
		});

		return interaction.reply({
			content: `Reseted your guild prefix to default!`,
			ephemeral: true,
		});
	},
};
