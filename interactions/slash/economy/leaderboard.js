// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");
const stringTable = require("string-table");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Show your guild top players")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Select which leaderboard you want me to show")
				.setRequired(true)
				.addChoice("Global leaderboard", "global")
				.addChoice("Current guild leaderboard", "guild")
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
			const footer = `${interaction.user.tag} • #`;

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
			const collection = new Discord.Collection();
			await Promise.all(
				guild.members.cache.map(async (member) => {
					// if (member.user.bot) return;
					const id = member.id;
					const b = await client.bal(id);
					if (b === null) return;
					const bal = b.owlet + b.bank;
					return b !== 0
						? collection.set(id, {
								id,
								bal,
						  })
						: null;
				})
			);

			const data = collection.sort((a, b) => b.bal - a.bal);
			// console.log(data);

			const keys = collection.map((v) => v.id);

			const array = await Promise.all(
				data.first(10).map(async (v, i) => {
					const bal = millify(v.bal);
					const p =
						(await client.users.fetch(v.id)) ||
						(await client.users.cache.get(v.id));
					return {
						top: String(i + 1).padStart(2, 0),
						owlets: bal,
						player: p.tag,
					};
				})
			);

			const table = stringTable.create(array, {
				capitalizeHeaders: true,
				formatters: {
					top: function (value, header) {
						return `#${value}`;
					},
				},
			});

			const Embed = new Discord.MessageEmbed()
				.setTitle(`${guild.name}'s Top ${array.length}`)
				.setColor("RANDOM")
				.setDescription("```" + table + "```")
				.setFooter({
					text:
						`${interaction.user.username} • #` +
						(keys.indexOf(interaction.user.id) + 1),
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});

			return interaction.editReply({
				embeds: [Embed],
			});
		}
	},
};
