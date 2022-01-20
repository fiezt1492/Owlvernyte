const guildPrefix = require("../../../modules/configuration/guildPrefix");
const config = require("../../../config");
const Discord = require("discord.js");
const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	id: "prefixpanel",
	filter: "author",

	async execute(interaction) {
		const { cooldowns } = interaction.client;

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: interaction.message.guild.name,
				iconURL: interaction.message.guild.iconURL(),
			})
			.setTitle("Guild Prefix")
			.setColor("RANDOM")
			.addField("Current Prefix", await guildPrefix.get(interaction.message))
			.setDescription(
				`\`Set\` button -> set new guild prefix\n\`Reset\` button -> reset your current guild prefix to default prefix: \`${config.prefix}\``
			);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("prefixSet")
					.setLabel("Set")
					.setDisabled(state)
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("prefixReset")
					.setLabel("Reset")
					.setDisabled(state)
					.setStyle("SECONDARY")
			),

			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("settings")
					.setDisabled(state)
					.setLabel("Settings Panel")
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
					.setStyle("DANGER")
			),
		];

		await interaction.update({
			// content: "This was a reply from button handler!",
			embeds: [Embed],
			components: components(false),
		});

		// console.log(interaction);

		const m = await interaction.fetchReply();
		// console.log(m);

		// const filter = (i) => i.user.id === interaction.user.id;

		const mCol = m.createMessageComponentCollector({
			// filter,
			componentType: "BUTTON",
			// time: 60000,
		});

		let already = new Set();

		mCol.on("collect", async (i) => {
			if (i.customId === "cancel") return mCol.stop();
			// console.log(i)
			if (i.customId === "prefixReset") {
				if ((await guildPrefix.get(interaction.message)) === config.prefix) {
					if (i.replied === false)
						return i.reply({
							content: `Your prefix is already default! You dont need to reset it.`,
							ephemeral: true,
						});
					else
						return i.update({
							content: `Your prefix is already default! You dont need to reset it.`,
							ephemeral: true,
						});
				}

				await guildPrefix.set(interaction.message);

				Embed.fields[0] = {
					name: "Current Prefix",
					value: await guildPrefix.get(i.message),
				};

				m.edit({
					embeds: [Embed],
				});

				if (i.replied === false)
					return i.reply({
						content: `Reseted your guild prefix to default!`,
						ephemeral: true,
					});

				return i.update({
					content: `Reseted your guild prefix to default!`,
					ephemeral: true,
				});
			}

			if (i.customId === "prefixSet") {
				if (cooldowns.has(interaction.message.guildId)) {
					const now = Date.now();
					const old = cooldowns.get(interaction.message.guildId);

					if (now - old < 60000)
						return await i.reply({
							content: `You have just changed your guild prefix. Please wait \`${(
								(60000 - (now - old)) /
								1000
							).toFixed(1)}s\``,
							ephemeral: true,
						});
					else cooldowns.delete(interaction.message.guildId);
				}

				if (already.has(i.user.id))
					return await i.reply({
						content: `You have clicked this button. Please finish previous request.`,
						ephemeral: true,
					});

				m.edit({
					components: disableComponent(m.components),
				});

				already.add(i.user.id);
				await i
					.reply({
						content: `Please type below your wish custom prefix to set. You got 60 seconds and 5 characters limit.`,
						ephemeral: true,
						fetchReply: true,
					})
					.then(() => {
						const filter = (response) => i.user.id === response.author.id;
						i.channel
							.awaitMessages({
								filter,
								max: 1,
								time: 60000,
								errors: ["time"],
							})
							.then(async (collected) => {
								if (collected.size === 1) {
									already.delete(i.user.id);
									const customPrefix = collected.first().content;

									collected.first().delete();
									// console.log(ifetch)

									if (customPrefix.length > 5) {
										m.edit({
											components: disableComponent(m.components, false),
										});
										return i.followUp({
											content: `Prefix length limitation is **5**. Please make it shorter and click \`Set\` button again.`,
											ephemeral: true,
										});
									}

									await guildPrefix.set(interaction.message, customPrefix);

									cooldowns.set(interaction.message.guildId, Date.now());

									Embed.fields[0] = {
										name: "Current Prefix",
										value: await guildPrefix.get(i.message),
									};

									m.edit({
										embeds: [Embed],
										components: disableComponent(m.components, false),
									});

									return i.followUp({
										content: `Successfully changed your guild prefix to \`${await guildPrefix.get(
											interaction.message
										)}\``,
										ephemeral: true,
									});
								}
							})
							.catch((collected) => {
								already.delete(i.user.id);
								m.edit({
									components: disableComponent(m.components, false),
								});
								if (collected.size === 0)
									return i.followUp({ content: `Timeout.`, ephemeral: true });
							});
					});
			}

			// i.update()
			// mCol.resetTimer();
		});

		mCol.on("end", (collected) => {
			m.edit({
				components: disableComponent(interaction.message.components),
			});
			// if (collected)
			// 	return collected.map(async (btn) => {
			// 		if (btn.replied === false)
			// 			await btn.update({
			// 				components: disableComponent(interaction.message.components),
			// 			});
			// 	});
		});

		return;
	},
};
