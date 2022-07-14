// const config = require("../../../config");
const Discord = require("discord.js");

module.exports = {
	id: "ephepanel",
	filter: "author",

	async execute(interaction, guildSettings, i18n, already) {
		const { client, guild } = interaction;

		const Embed = require("../../../constants/embeds/ephepanel")(
			guild.name,
			guild.iconURL(),
			interaction
		);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("ephetrue")
					.setLabel("ENABLE")
					.setDisabled(state)
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("ephefalse")
					.setLabel("DISABLE")
					.setDisabled(state)
					.setStyle("DANGER")
			),
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("settings")
					.setDisabled(state)
					.setLabel("Settings Panel")
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
					.setStyle("DANGER")
			),
		];

		await interaction.update({
			embeds: Embed,
			components: components(false),
		});
	},
};
