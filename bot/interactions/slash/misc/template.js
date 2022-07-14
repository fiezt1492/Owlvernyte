const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder().setName("name").setDescription("description"),
	category: "misc",
	dev: true,
	// once: true,

	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client } = interaction;
	},
};
