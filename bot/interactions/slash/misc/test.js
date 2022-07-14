const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("test command"),
	category: "misc",
	dev: true,
	// once: true,

	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client, guild } = interaction;
		const guildCommands = await guild.commands.fetch();
		// console.log(guildCommands.find(c => c.name == 'settings'))
		// console.log(client.commands);
	},
};
