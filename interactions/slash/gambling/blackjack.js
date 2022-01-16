// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// const blackjack = require("../../../modules/gambling/Blackjack/index")
const Deck = require("../../../modules/gambling/Blackjack/Deck");
const Hand = require("../../../modules/gambling/Blackjack/Hand");

let games = new Map();

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("blackjack")
		.setDescription("Play Vietnamese Blackjack"),
	// .addStringOption((option) =>
	// 	option
	// 		.setName("command")
	// 		.setDescription("The specific command to see the info of.")
	// 		.setRequired(false)
	// ),

	async execute(interaction) {
		const { client } = interaction;

		const already = games.get(interaction.user.id);

		if (games.has(interaction.user.id) && already.cID == interaction.channelId)
			return interaction.reply({
				content: "**[Error]** There is a blackjack game playing for you.",
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								style: 5,
								label: "Forward",
								// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
								url: already.mURL,
							},
						],
					},
				],
			});

		// await interaction.reply({
		// 	content: `Creating game`,
		// });

		// const message = await interaction.fetchReply();

		try {
			const d = new Deck();
			d.shuffle();
			const dealer = new Hand();
			const p1 = new Hand();

			p1.draw(d, 2);
			dealer.draw(d, 2);
			let p1hand = p1.cards
				.map((card) => {
					return "`" + card.toString() + "`";
				})
				.join(" | ");

			const deckEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({
					name: client.user.tag,
					iconURL: client.user.displayAvatarURL({ dynamic: true }),
				})
				.setDescription("Xì dách")
				.setFooter({
					text: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});

			const staybut = (state) =>
				new MessageButton()
					.setCustomId("stay")
					.setLabel("Stay")
					.setDisabled(state)
					.setStyle("DANGER");

			const hitbut = (state) =>
				new MessageButton()
					.setCustomId("hit")
					.setLabel("Hit")
					.setDisabled(state)
					.setStyle("SUCCESS");

			deckEmbed
				.addField(
					`?? on ${client.user.username}\'s hand`,
					`\`${dealer.cards[0].suit}${dealer.cards[0].value} | ${dealer.cards[1].suit}?\``,
					true
				)
				.addField(
					`${p1.point} on ${interaction.user.username}\'s hand`,
					p1hand,
					true
				);

			let bt1 = staybut(false);
			let bt2 = hitbut(false);

			if (p1.isBanban() || p1.isBlackjack()) {
				while (
					(!dealer.isStayable() ||
						(dealer.point < p1.point && p1.isHitable())) &&
					dealer.isHitable()
				) {
					dealer.draw(d);
				}

				bt1 = staybut(true);
				bt2 = hitbut(true);

				let dealerhand = dealer.cards
					.map((card) => {
						return "`" + card.toString() + "`";
					})
					.join(" | ");

				deckEmbed.fields[0] = {
					name: `${dealer.point} on ${client.user.username}\'s hand`,
					value: dealerhand,
					inline: true,
				};
				deckEmbed.fields[1] = {
					name: `${p1.point} on ${interaction.user.username}\'s hand`,
					value: p1hand,
					inline: true,
				};

				if (
					dealer.isBusted() ||
					(dealer.point < p1.point && p1.point <= 21) ||
					(p1.is5D() && !dealer.is5D()) ||
					(p1.is5D() && dealer.is5D() && p1.point < dealer.point)
				) {
					deckEmbed.setTitle("WIN");
				} else if (
					dealer.point === p1.point ||
					(dealer.isBusted() && p1.isBusted())
				) {
					deckEmbed.setTitle("DRAW");
				} else {
					deckEmbed.setTitle("LOSE");
				}
			}

			if (!p1.isStayable()) {
				bt1 = staybut(true);
			}

			let row1 = new MessageActionRow().addComponents([bt1, bt2]);

			await interaction.reply({
				embeds: [deckEmbed],
				components: [row1],
			});

			let msg = await interaction.fetchReply();

			if (bt2.disabled == false)
				games.set(interaction.user.id, {
					gID: msg.guild.id,
					cID: msg.channel.id,
					mID: msg.id,
					mURL: msg.url,
				});
			else return;

			const filter = (f) => f.user.id === interaction.user.id;

			const msgCol = msg.createMessageComponentCollector({
				filter,
				componentType: "BUTTON",
				time: 30000,
			});

			msgCol.on("collect", async (btn) => {
				if (p1.isBanban() || p1.is5D() || p1.isBlackjack())
					return msgCol.stop();
				if (p1.cards.length < 5) {
					if (btn.customId === "hit") {
						p1.draw(d);
						if (p1.isStayable()) bt1 = staybut(false);
						if (
							p1.cards.length >= 5 ||
							p1.is21P() ||
							p1.isBusted() ||
							p1.is5D()
						) {
							return msgCol.stop();
						}

						msgCol.resetTimer();
						p1hand = p1.cards
							.map((card) => {
								return "`" + card.toString() + "`";
							})
							.join(" | ");
					} else if (btn.customId === "stay") {
						p1.stay();
						return msgCol.stop();
					}
				}

				deckEmbed.fields[0] = {
					name: `?? on ${client.user.username}\'s hand`,
					value: `\`${dealer.cards[0].suit}${dealer.cards[0].value} | ${dealer.cards[1].suit}?\``,
					inline: true,
				};
				deckEmbed.fields[1] = {
					name: `${p1.point} on ${interaction.user.username}\'s hand`,
					value: p1hand,
					inline: true,
				};

				row1 = new MessageActionRow().addComponents([bt1, bt2]);

				await btn.update({
					embeds: [deckEmbed],
					components: [row1],
				});
			});

			msgCol.on("end", async (collected, reason) => {
				games.delete(interaction.user.id);
				if (reason === "time") {
					let dealerhand = dealer.cards
						.map((card) => {
							return "`" + card.toString() + "`";
						})
						.join(" | ");

					deckEmbed.fields[0] = {
						name: `${dealer.point} on ${client.user.username}\'s hand`,
						value: dealerhand,
						inline: true,
					};
					deckEmbed.fields[1] = {
						name: `${p1.point} on ${interaction.user.username}\'s hand`,
						value: p1hand,
						inline: true,
					};
					deckEmbed.setTitle("TIMEOUT");
					bt1 = staybut(true);
					bt2 = hitbut(true);
					row1 = new MessageActionRow().addComponents([bt1, bt2]);

					return interaction.editReply({
						embeds: [deckEmbed],
						components: [row1],
					});
				}

				while (
					!dealer.isStayable() ||
					(dealer.point < p1.point && p1.isHitable())
				) {
					dealer.draw(d);
				}

				let dealerhand = dealer.cards
					.map((card) => {
						return "`" + card.toString() + "`";
					})
					.join(" | ");

				p1hand = p1.cards
					.map((card) => {
						return "`" + card.toString() + "`";
					})
					.join(" | ");

				deckEmbed.fields[0] = {
					name: `${dealer.point} on ${client.user.username}\'s hand`,
					value: dealerhand,
					inline: true,
				};
				deckEmbed.fields[1] = {
					name: `${p1.point} on ${interaction.user.username}\'s hand`,
					value: p1hand,
					inline: true,
				};

				if (
					(dealer.isBusted() && !p1.isBusted()) ||
					(dealer.point < p1.point && p1.point <= 21) ||
					(p1.is5D() && !dealer.is5D()) ||
					(p1.is5D() && dealer.is5D() && p1.point > dealer.point)
				) {
					deckEmbed.setTitle("WIN 🎉");
				} else if (
					dealer.point === p1.point ||
					(dealer.isBusted() && p1.isBusted())
				) {
					deckEmbed.setTitle("DRAW");
				} else {
					deckEmbed.setTitle("LOSE :<");
				}

				bt1 = staybut(true);
				bt2 = hitbut(true);
				row1 = new MessageActionRow().addComponents([bt1, bt2]);

				await interaction.editReply({
					embeds: [deckEmbed],
					components: [row1],
				});

				if (collected)
					return collected.map(async (btn) => {
						if (btn.replied === false)
							await btn.update({
								embeds: [deckEmbed],
								components: [row1],
							});
					});
			});
		} catch (error) {
			console.log("[BLACKJACK]: " + error.message);
		}
	},
};
