// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Players = require("../../../modules/economy/players");
const { millify } = require("millify");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("pay")
		.setDescription("Pay someone owlet")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setMinValue(1)
				.setDescription("Give me an owlet")
				.setRequired(true)
		)
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Mention a user you want to pay owlet")
				.setRequired(true)
		),
	category: "fun",
	async execute(interaction, Player, ONCE, i18n) {
		const { client } = interaction;

		const member = interaction.options.getUser("target") || client.user;

		if (member.id === interaction.user.id)
			return interaction.reply({
				content: `You can't pay yourself!`,
				ephemeral: true,
			});

		const amount = interaction.options.getInteger("amount");

		// if (amount <= 0)
		// 	return interaction.reply({
		// 		content: `Please provide a positive number!`,
		// 		ephemeral: true,
		// 	});

		const player = await Player.get();

		if (amount > player.owlet)
			return interaction.reply({
				content: `You dont have enough owlet!`,
				ephemeral: true,
			});

		const Target = new Players(member.id);
		await Target.set();

		await Player.owlet(-amount);
		await Target.owlet(amount);

		const string = millify(amount, {
			precision: 2,
		});

		return interaction.reply({
			content: `Successfully ${this.data.name} \`${string}\` owlets to ${member}!`,
		});
	},
};
