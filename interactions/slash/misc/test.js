const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("test command"),
	category: "misc",
	dev: true,
	// once: true,

	async execute(interaction, Player, ONCE, i18n) {
		const { client } = interaction;
		const user = await client.users.fetch("445102575314927617")
		const guild = await client.guilds.fetch(interaction.guildId)
		const member = await guild.members.fetch(user.id)
		const invites = await guild.invites.fetch()
		console.log(invites.first())
		console.log(user)
		console.log(member)
	},
};
