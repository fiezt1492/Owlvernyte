// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// const blackjack = require("../../../modules/gambling/Blackjack/index")
const Deck = require("../../../modules/gambling/Blackjack/Deck");
const Hand = require("../../../modules/gambling/Blackjack/Hand");
const { millify } = require("millify");

// let games = new Map();

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("hilo")
		.setDescription("Play simple Highlow - Sicbo")
		.addIntegerOption((option) =>
			option.setName("bet").setDescription("Give me an owlet").setRequired(true)
		),
	once: true,
	category: "gambling",
	permissions: "SEND_MESSAGES",

	async execute(interaction, Player, ONCE, i18n) {
		const { client } = interaction;

		// const already = games.get(interaction.user.id);

		// if (games.has(interaction.user.id) && already.cID == interaction.channelId)
		// 	return interaction.reply({
		// 		content: "**[Error]** There is a blackjack game playing for you.",
		// 		components: [
		// 			{
		// 				type: 1,
		// 				components: [
		// 					{
		// 						type: 2,
		// 						style: 5,
		// 						label: "Forward",
		// 						// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
		// 						url: already.mURL,
		// 					},
		// 				],
		// 			},
		// 		],
		// 		ephemeral: true,
		// 	});

		// await interaction.reply({
		// 	content: `Creating game`,
		// });

		// const message = await interaction.fetchReply();
		let bet = interaction.options.getInteger("bet");
		if (bet <= 0)
			return interaction.reply({
				content: `Please provide a positive number!`,
				ephemeral: true,
			});

		const player = await Player.get();
		if (bet > player.owlet)
			return interaction.reply({
				content: `You dont have enough owlet!`,
				ephemeral: true,
			});

		const emojis = {
			1: "1️⃣",
			2: "2️⃣",
			3: "3️⃣",
			4: "4️⃣",
			5: "5️⃣",
			6: "6️⃣",
		};

		// let description = "";
		let dices = [];
		// let dices = [1, 1, 1];

		for (let i = 0; i < 3; i++) {
			dices.push(Math.floor(Math.random() * 5) + 1);
		}

		let description = dices.map((dice) => `${emojis[dice]}`).join(` | `);

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription("❔ | ❓ | ❔")
			.setTitle("TAI XIU VJP PR0 96");

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("double")
					.setLabel("Double")
					.setDisabled(state)
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("big")
					.setLabel("Big")
					.setDisabled(state)
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("small")
					.setLabel("Small")
					.setDisabled(state)
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("biggest")
					.setLabel("Biggest")
					.setDisabled(state)
					.setStyle("DANGER")
			),
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("triple")
					.setLabel("Triple")
					.setDisabled(state)
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("even")
					.setLabel("Even")
					.setDisabled(state)
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("odd")
					.setLabel("Odd")
					.setDisabled(state)
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("smallest")
					.setLabel("Smallest")
					.setDisabled(state)
					.setStyle("DANGER")
			),
		];

		await interaction.reply({
			content: `Have fun good luck!`,
			embeds: [Embed],
			components: components(false),
            ephemeral: true,
		});

		let msg = await interaction.fetchReply();

		ONCE.set(interaction.user.id, {
			name: this.data.name,
			gID: msg.guild.id,
			cID: msg.channel.id,
			mID: msg.id,
			mURL: msg.url,
		});

		const filter = (i) => i.user.id === interaction.user.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", () => {
			msgCol.stop();
		});

		msgCol.on("end", async (collected, reason) => {
			Embed.description = description;
			ONCE.delete(interaction.user.id);
			if (reason === "time") {
				Embed.title = "TIME OUT";

				return interaction.editReply({
					embeds: [Embed],
					components: components(true),
				});
			}

			// msg.edit({
			// 	embeds: [Embed],
			// 	components: components(true)
			// })

			let choice = collected.first().customId;

			function hasDuplicates(array) {
				return new Set(array).size !== array.length;
			}

			let sum = dices.reduce((a, b) => a + b, 0);
			let odd = sum % 2 === 1 ? true : false;
			let triple = dices.every((val, i, arr) => val === arr[0]);
			let double = triple ? false : hasDuplicates(dices);
			let result = -1;

			switch (choice) {
				case "big":
					result = sum >= 11 && sum <= 17 ? 1 : -1;
					break;
				case "small":
					result = sum >= 4 && sum <= 10 ? 1 : -1;
					break;
				case "biggest":
					result = sum === 18 ? 180 : -1;
					break;
				case "smallest":
					result = sum === 3 ? 180 : -1;
					break;
				case "even":
					result = !odd ? 1 : -1;
					break;
				case "odd":
					result = odd ? 1 : -1;
					break;
				case "double":
					result = double ? Math.round(Math.random() * 1) + 1 : -1;
					break;
				case "triple":
					result = triple ? 30 : -1;
					break;
			}

			bet = bet * result;

			const string = millify(Math.abs(bet), {
				precision: 2,
			});

			Embed.title = `You LOSE ${string} owlets!`;
			await Player.owlet(bet);

			if (result > 0) {
				Embed.title = `You WON ${string} owlets!`;
				if (result > 1)
					Embed.setFooter({
						text: `x${result} your bet owlet!`,
					});
			}

			if (collected)
				return collected.map(async (btn) => {
					if (btn.replied === false)
						await btn.update({
							embeds: [Embed],
							components: components(true),
						});
				});
		});
	},
};
