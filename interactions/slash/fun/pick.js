// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("pick")
		.setDescription("Pick random from options")
		.addStringOption((option) =>
			option
				.setName("options")
				.setDescription("Seperate your options with comma (,)")
				.setRequired(true)
		),
	category: "fun",
	async execute(interaction) {
		const { client } = interaction;

		let choices = interaction.options
			.getString("options")
			// .trim()
			// .split(/ +/)
			// .join(" ")
			.split(/\s*,+\s*/);

		if (choices.includes(""))
			return interaction.reply({
				content: `**[ERROR]** Null character are not allowed here. (Separate your options with \`,\`)`,
				ephemeral: true,
			});

		const rs = choices[Math.floor(Math.random() * choices.length)];

		return interaction.reply({
			content: `I chose \`${rs}\`.`,
		});
	},
};
