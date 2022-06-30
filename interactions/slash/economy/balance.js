// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");
const Players = require("../../../modules/economy/players");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Get someone balance")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Mention a user")
				.setRequired(false)
		),
	category: "economy",
	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client } = interaction;

		const user = interaction.options.getUser("target") || interaction.user;

		const Target = new Players(user.id);
		const player = await Target.set();
		const { owlet, nyteGem, bank } = player;

		const string = {
			owlet: millify(owlet, {
				precision: 3,
			}),
			nyteGem: millify(nyteGem, {
				precision: 3,
			}),
			bank: millify(bank, {
				precision: 3,
			}),
		};

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(user.username + "#" + user.discriminator)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addFields([
				{
					name: "Owlet",
					value: `\`\`\`${string.owlet}\`\`\``,
					inline: true,
				},
				{
					name: "Nyte Gem",
					value: `\`\`\`${string.nyteGem}\`\`\``,
					inline: true,
				},
				{
					name: "Bank",
					value: `\`\`\`${string.bank}\`\`\``,
					inline: true,
				},
			]);

		return interaction.reply({
			embeds: [Embed],
			ephemeral: guildSettings.ephemeral,
		});
	},
};
