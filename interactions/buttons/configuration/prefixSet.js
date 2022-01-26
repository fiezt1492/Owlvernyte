// const config = require("../../../config");
const guildPrefix = require("../../../modules/configuration/guildPrefix");
// const Discord = require("discord.js");
const disableComponent = require("../../../modules/util/disableComponent");
let already = new Set();

module.exports = {
	id: "prefixSet",
	filter: "author",

	async execute(interaction) {
		const { client, message } = interaction;
		const { cooldowns } = client;
        // console.log(interaction)

        const Embed = message.embeds[0]

		if (cooldowns.has(message.guildId)) {
			const now = Date.now();
			const old = cooldowns.get(message.guildId);

			if (now - old < 60000)
				return await interaction.reply({
					content: `You have just changed your guild prefix. Please wait \`${(
						(60000 - (now - old)) /
						1000
					).toFixed(1)}s\``,
					ephemeral: true,
				});
			else cooldowns.delete(message.guildId);
		}

		if (already.has(interaction.user.id))
			return await interaction.reply({
				content: `You have clicked this button. Please finish previous request.`,
				ephemeral: true,
			});

		message.edit({
			components: disableComponent(message.components),
		});

		already.add(interaction.user.id);

		await interaction.reply({
			content: `Please type below your wish custom prefix to set. You got 60 seconds and 5 characters limit.`,
			ephemeral: true,
			// fetchReply: true,
		});

		const msg = await interaction.fetchReply();

		// const channel = await client.channels.cache.get(interaction.channelId);

		const filter = (m) => interaction.user.id === m.author.id;

		const msgCol = msg.channel.createMessageCollector({
			filter,
			max: 1,
			time: 60000,
		});

		msgCol.on("collect", () => {
			msgCol.stop();
		});

		msgCol.on("end", async (collected, reason) => {
			if (collected.size === 1) {
				already.delete(interaction.user.id);
				const customPrefix = collected.first().content;

				collected.first().delete();
				// console.log(ifetch)

				if (customPrefix.length > 5) {
					message.edit({
						components: disableComponent(message.components, false),
					});

					return interaction.followUp({
						content: `Prefix length limitation is **5**. Please make it shorter and click \`Set\` button again.`,
						ephemeral: true,
					});
				}

				await guildPrefix.set(message, customPrefix);

				cooldowns.set(message.guildId, Date.now());

				Embed.fields[0] = {
					name: "Current Prefix",
					value: guildPrefix.get(message),
				};

				message.edit({
					embeds: [Embed],
					components: disableComponent(message.components, false),
				});

				return interaction.followUp({
					content: `Successfully changed your guild prefix to \`${guildPrefix.get(
						message
					)}\``,
					ephemeral: true,
				});
			}

			already.delete(interaction.user.id);

			Embed.fields[0] = {
				name: "Current Prefix",
				value: guildPrefix.get(message),
			};

			message.edit({
				embeds: [Embed],
			});

			if (reason === "time") {
				message.edit({
					components: disableComponent(message.components, false),
				});
				if (collected.size === 0)
					return interaction.followUp({ content: `Timeout.`, ephemeral: true });
			}
		});
	},
};
