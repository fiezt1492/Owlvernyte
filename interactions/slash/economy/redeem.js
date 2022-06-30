// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("redeem")
		.setDescription("Redeem your giftcode")
		.addStringOption((option) =>
			option
				.setName("giftcode")
				.setDescription("Enter a giftcode")
				.setRequired(true)
		),
	cooldown: 10,
	category: "economy",
	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client } = interaction;
		const db = client.db.collection("giftcode");

		const input = interaction.options.getString("giftcode");
		const code = await db.findOne({ name: input });

		if (!code)
			return interaction.reply({
				content: `Wrong giftcode!`,
				ephemeral: true,
			});

		if (!code.remain || code.remain === 0)
			return interaction.reply({
				content: `Out of giftcode!`,
				ephemeral: true,
			});

		if (code.claimed.includes(interaction.user.id))
			return interaction.reply({
				content: `You had already redeemed this code!`,
				ephemeral: true,
			});

		let o = code.prize.owlet || 10;

		await Player.owlet(o);

		await db.updateOne(
			{
				name: input,
			},
			{
				$push: {
					claimed: interaction.user.id,
				},
				$inc: {
					remain: -1,
				},
			}
		);

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: interaction.user.tag,
			})
			.setTitle(code.quote.toUpperCase())
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`**${interaction.user.username}** is redeeming giftcode. There ${
					o > 1 ? "are" : "is"
				} **${o.toLocaleString()} owlet${
					o > 1 ? "s" : ""
				}**.\n**${o.toLocaleString()} owlet${o > 1 ? "s" : ""}** ha${
					o > 1 ? "ve" : "s"
				} been given into **${interaction.user.username}**'s inventory.`
			);

		return interaction.reply({
			embeds: [Embed],
			ephemeral: guildSettings.ephemeral,
		});
	},
};
