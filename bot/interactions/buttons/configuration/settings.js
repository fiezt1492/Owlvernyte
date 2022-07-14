// const config = require("../../../config");
// const guildPrefix = require("../../../modules/configuration/guildPrefix");
// const Discord = require("discord.js");
// const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	id: "settings",
	filter: "author",

	async execute(interaction, guildSettings, i18n, already) {
		const { client, guild } = interaction;
		const Embed = require("../../../constants/embeds/settings")(
			guild.name,
			guild.iconURL(),
			guildSettings
		);
		const components = require("../../../constants/buttons/settings");
		await interaction.update({
			embeds: Embed,
			components: components(false),
		});
		return;
	},
};
