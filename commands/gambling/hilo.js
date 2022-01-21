const Discord = require("discord.js");

module.exports = {
	name: "hilo",
	description: "Tài xỉu - High Low - Sic bo is arrived",
	category: "gambling",
	aliases: ["sicbo", "taixiu", "highlow"],
	usage: "",
	permissions: "SEND_MESSAGES",
	maintain: true,
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;

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

		// for (let i = 0; i < 3; i++) {
		// 	dices.push(Math.floor(Math.random() * 5) + 1);
		// }

		let description = dices.map((dice) => `${emojis[dice]}`).join(` | `);

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			})
			.setDescription("❔ | ❓ | ❔")
			.setTitle("TAI XIU VJP PR0 96");

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("hilo-hi")
					.setLabel("High")
					.setDisabled(state)
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("hilo-lo")
					.setLabel("Low")
					.setDisabled(state)
					.setStyle("PRIMARY")
			),
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("hilo-even")
					.setLabel("Even")
					.setDisabled(state)
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("hilo-odd")
					.setLabel("Odd")
					.setDisabled(state)
					.setStyle("SECONDARY")
			),
		];

		const msg = await message.reply({
			content: `Its hilo or tài xỉu?`,
			embeds: [Embed],
			components: components(false),
			allowedMentions: {
				repliedUser: false,
			},
		});

		const filter = (i) => i.user.id === message.author.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", () => {
			msgCol.stop();
		});

		msgCol.on("end", (collected, reason) => {
			Embed.description = description;

			if (reason === "time") {
				Embed.title = "TIME OUT";

				return msg.edit({
					embeds: [Embed],
					components: components(true),
				});
			}

			// msg.edit({
			// 	embeds: [Embed],
			// 	components: components(true)
			// })

			let bet = collected.first().customId;

			let sum = dices.reduce((a, b) => a + b, 0);

			if (bet === "hilo-even" || bet === "hilo-odd") {
				let odd = () => sum % 2 === 1;
				if ((bet === "hilo-even" && !odd()) || (bet === "hilo-odd" && odd())) {
					Embed.title = `WIN`;
				} else Embed.title = `LOSE`;
			}

			if (bet === "hilo-hi" || bet === "hilo-lo") {
				if (
					(sum >= 4 && sum <= 10 && bet === "hilo-lo") ||
					(sum >= 11 && sum <= 17 && bet === "hilo-hi")
				) {
					Embed.title = "WIN";
				} else Embed.title = "LOSE";

				if (dices.every((val, i, arr) => val === arr[0])) {
					if (
						(sum === 3 && bet === "hilo-lo") ||
						(sum === 18 && bet === "hilo-hi")
					) {
						Embed.title = "Special WIN";
					}

					Embed.setFooter({ text: `SAME DICES!!!` });
				}
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
