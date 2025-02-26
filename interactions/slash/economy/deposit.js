// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("deposit")
		.setDescription("Your owlets are safe in bank")
		.addIntegerOption((option) =>
			option
				.setName("owlet")
				.setMinValue(1)
				.setDescription("Give me an owlet")
				.setRequired(true)
		),
	cooldown: 10,
	category: "economy",
	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client } = interaction;

		let input = interaction.options.getInteger("owlet");
		// if (input <= 0)
		// 	return interaction.reply({
		// 		content: `Please provide a positive number!`,
		// 		ephemeral: true,
		// 	});
		const player = await Player.get();

		if (input > player.owlet)
			return interaction.reply({
				content: `You dont have enough owlet!`,
				ephemeral: true,
			});

		await Player.bank(input);
		const string = millify(input, {
			precision: 2,
		});
		return interaction.reply({
			content: `Successfully ${this.data.name} \`${string}\` owlets to your bank account!`,
			ephemeral: guildSettings.ephemeral,
		});
	},
};
