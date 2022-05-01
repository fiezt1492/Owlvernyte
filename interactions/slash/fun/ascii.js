// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const figlet = require("figlet");
const { promisify } = require("util");
const figletAsync = promisify(figlet);

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("ascii")
		.setDescription("Summon ascii art with given string")
		.addStringOption((option) =>
			option
				.setName("content")
				.setDescription("Make your string shorter than 20 characters")
				.setRequired(true)
		),
	category: "fun",
	async execute(interaction) {
		const { client } = interaction;

		let Content = interaction.options
			.getString("content")
			.trim()
			.split(/ +/)
			.join(" ");

		if (Content.length > 20)
			return interaction.reply({
				content: `Please make it shorter! | Limit: 20 characters`,
				ephemeral: true,
			});

		let Result = await figletAsync(Content);

		let embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription("```" + Result + "```");

		return interaction.reply({
			embeds: [embed],
		});
	},
};
