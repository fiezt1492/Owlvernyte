const Discord = require("discord.js");

module.exports = {
	name: "hilo",
	description: "Tài xỉu - High Low - Sic bo is arrived",
	category: "gambling",
	aliases: ["sicbo", "taixiu", "highlow", "bigsmall"],
	usage: "",
	permissions: "SEND_MESSAGES",
	// maintain: true,
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

		for (let i = 0; i < 3; i++) {
			dices.push(Math.floor(Math.random() * 5) + 1);
		}

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

			function hasDuplicates(array) {
				return new Set(array).size !== array.length;
			}

			let sum = dices.reduce((a, b) => a + b, 0);
			Embed.setFooter({ text: `-1` });
			Embed.title = "LOSE";
			let odd = sum % 2 === 1 ? true : false;
			let triple = dices.every((val, i, arr) => val === arr[0]);
			let double = triple ? false : hasDuplicates(dices);
			let result = -1;

			switch (bet) {
				case "big":
					result = sum >= 11 && sum <= 17 ? 1 : -1;
					break;
				case "small":
					result = sum >= 4 && sum <= 10 ? 1 : -1;
					break;
				case "biggest":
					result = sum === 3 ? 180 : -1;
					break;
				case "smallest":
					result = sum === 18 ? 180 : -1;
					break;
				case "even":
					result = !odd ? 1 : -1;
					break;
				case "odd":
					result = odd ? 1 : -1;
					break;
				case "double":
					result = double ? 5 : -1;
					break;
				case "triple":
					result = triple ? 30 : -1;
					break;
			}

			if (result > 0) {
				Embed.title = "WIN";
				Embed.setFooter({
					text: String(result),
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
