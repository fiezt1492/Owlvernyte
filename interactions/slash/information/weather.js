// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
// const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const weather = require("weather-js");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("weather")
		.setDescription("Get information about something")
		.addStringOption((option) =>
			option
				.setName("location")
				.setDescription("Enter your wish location")
				.setRequired(false)
		),
	category: "information",
	async execute(interaction, guildSettings) {
		const { client } = interaction;

		const string = interaction.options.getString("location");

		let location = string ? string : "700000";

		let embed = new Discord.MessageEmbed()
			.setTitle("RESULT")
			.setColor("RANDOM");

		weather.find(
			{ search: location, degreeType: "C" },
			async function (err, result) {
				if (err)
					return await interaction.reply({
						content: err,
						ephemeral: true,
					});

				if (result.size < 1 || !result || result.size == 0)
					return await interaction.reply({
						content: "Not found",
						ephemeral: true,
					});
				// let json = JSON.stringify(result, null, 2);

				// console.log(json);
				// console.log(result);
				try {
					result.map((c) =>
						embed.addField(
							`${c.location.name}`,
							`${c.current.skytext} ${c.current.temperature}°${c.location.degreetype}`
						)
					);

					if (embed.fields.length == 0)
						return await interaction.reply({
							content: "Not found",
							ephemeral: true,
						});

					await interaction.reply({
						embeds: [embed],
						ephemeral: guildSettings.ephemeral,
					});
				} catch (err) {
					return await interaction.reply({
						content: "Unable to get data",
						ephemeral: true,
					});
				}
			}
		);

		// await interaction.reply({
		// 	embeds: [embed],
		// 	components: row(false),
		// });
	},
};
