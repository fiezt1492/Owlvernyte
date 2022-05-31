// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");
const stringTable = require("string-table");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Show top players")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Select which leaderboard type you want me to show")
				.setRequired(true)
				.addChoices(
					{
						name: "Global leaderboard",
						value: "global",
					},
					{
						name: "Current guild leaderboard",
						value: "guild",
					}
				)
		),
	cooldown: 10,
	category: "economy",
	async execute(interaction, Player, ONCE, i18n) {
		const { client, guild } = interaction;

		await interaction.deferReply({ ephemeral: true });

		const type = interaction.options.getString("type");

		if (type == "global") {
			const db = await client.db.collection("players");

			const players = await db
				.find()
				.sort({
					owlet: -1,
					bank: -1,
				})
				.limit(10)
				.toArray();

			const data = await Promise.all(
				players.map(async (o) => {
					const bal = o.owlet + o.bank;
					let p =
						(await client.users.fetch(o.id)) ||
						(await client.users.cache.get(o.id));
					// console.log(p)
					return {
						top: String(players.indexOf(o) + 1),
						owlets: `${millify(bal)}`,
						player: `${p.tag}`,
					};
				})
			);

			const table = await stringTable.create(data, {
				capitalizeHeaders: true,
				formatters: {
					top: function (value, header) {
						return `#${value}`;
					},
				},
			});

			const rate = players.map((o) => o.id);
			const footer = `${interaction.user.username} • #`;

			const Embed = new Discord.MessageEmbed()
				.setTitle(`Global Top ${data.length}`)
				.setColor("RANDOM")
				.setDescription("```" + table + "```")
				.setFooter({
					text: rate.some((id) => id === interaction.user.id)
						? `${footer}${rate.indexOf(interaction.user.id) + 1}`
						: `${footer}10+`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});

			return interaction.editReply({
				embeds: [Embed],
			});
		} else if (type == "guild") {
			const playerCol = await client.db.collection("players");
			const guildMembers = await guild.members.fetch();
			const guildMembersId = await guildMembers
				.filter((m) => !m.user.bot)
				.map((m) => m.id);

			const players = await playerCol
				.find({ id: { $in: guildMembersId } })
				.sort({
					owlet: -1,
					bank: -1,
				})
				.limit(10)
				.toArray();

			const data = await Promise.all(
				players.map(async (o) => {
					const bal = o.owlet + o.bank;
					let p =
						(await client.users.fetch(o.id)) ||
						(await client.users.cache.get(o.id));
					// console.log(p)
					return {
						top: String(players.indexOf(o) + 1),
						owlets: `${millify(bal)}`,
						player: `${p.tag}`,
					};
				})
			);

			const table = stringTable.create(data, {
				capitalizeHeaders: true,
				formatters: {
					top: function (value, header) {
						return `#${value}`;
					},
				},
			});

			const rate = players.map((o) => o.id);
			const footer = `${interaction.user.username} • #`;

			const Embed = new Discord.MessageEmbed()
				.setTitle(`${guild.name}'s Top ${data.length}`)
				.setColor("RANDOM")
				.setDescription("```" + table + "```")
				.setFooter({
					text: rate.some((id) => id === interaction.user.id)
						? `${footer}${rate.indexOf(interaction.user.id) + 1}`
						: `${footer}10+`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});

			return interaction.editReply({
				embeds: [Embed],
			});
		}
	},
};
