const Discord = require("discord.js");
const stringTable = require("string-table")

module.exports = {
	name: "cards",
	description: "List SO cards",
	category: "player",
	aliases: ["mycards","listcards"],
	usage: "<@user>",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE, i18n, mentions) {
		const { client } = message;
		message.channel.sendTyping();
		// console.log(client.baseCardsList)
		const user = message.mentions.users.first() || message.author
		const sort = args.shift() || null
		if (sort != null && !client.rarities.includes(sort)) return message.reply({
			content: i18n.__("common.error"),
			// embeds: [Embed],
			// components: components(false),
			// allowedMentions: {
			// 	repliedUser: false
			// }
		})
		// && !["common", "uncommon","rare","superrare","supersuperrare","ultrarare","elusive","legendary"].includes(sort)
		let pageNum = 1
		// Number(args.shift()) || Number(1)
		const db = client.db.collection("cards")
    const baseDb = client.db.collection("baseCards")
    const eachPage = 10

		const getCardAmount = async (prop = null) => {
			// let count;
			prop = String(prop).toLowerCase()
			const rarities = ['c', 'uc', 'r', 'sr', 'ssr', 'ur', 'e', 'l']
			const Prop = rarities.includes(prop) ? prop : null
			// console.log(Prop)
			if (Prop != null) {
				const rarityBaseCards = client.baseCardsList.filter(o => o.rarity == Prop).map(o => o.id)

				return await db.count({
					ownerId: user.id,
					baseId: {
						$in: rarityBaseCards
					},
					// status: "in"
				})
			} else {
				return await db.count({
					ownerId: user.id,
					// status: "in"
				})
			}
		}

		const cardAmount = await getCardAmount(sort)
		const maxPage = Math.ceil(cardAmount / eachPage)

		const getArray = async (pageNum, eachPage, prop = null) => {
			prop = String(prop).toLowerCase()
			const rarities = ['c', 'uc', 'r', 'sr', 'ssr', 'ur', 'e', 'l']
			const Prop = rarities.includes(prop) ? prop : null
			// console.log(Prop)
			if (Prop != null) {
				const rarityBaseCards = client.baseCardsList.filter(o => o.rarity == Prop).map(o => o.id)
				// console.log("case 1")
				return await db.find({
					ownerId: user.id,
					baseId: {
						$in: rarityBaseCards
					},
					// status: "in"
				},
				{
					projection: {
						_id: 0
					}
				}).skip((pageNum - 1) * 10).limit(10).toArray()
			} else {
				// console.log("case 2")
				return await db.find({
					ownerId: user.id,
					// status: "in"
				},
				{
					projection: {
						_id: 0
					}
				}).skip((pageNum - 1) * 10).limit(10).toArray()
			}

			// const array = await db.find({
			// 	ownerId: user.id,
			// 	// status: "in"
			// },
			// {
			// 	projection: {
			// 		_id: 0
			// 	}
			// }).skip((pageNum - 1) * 10).limit(10).toArray()
			// return array
		}

		const cards = await getArray(pageNum, eachPage, sort)
		// console.log(cards)
		if (cards.length <= 0) return message.reply({
			content: `This user doesn't have any card.`
		})

		const genEmbed = async (cards, pageNum, eachPage) => {
			const a = cards.map((card) => client.cards.getFull(card.id, client))
			const fullCards = await Promise.all(a)

			const fields = fullCards
			.map((card, index) => {
				// console.log(card)
				return {
					name: `No.${String((pageNum - 1) * eachPage + index + 1)} | ID: \`${String(card.id).toUpperCase()}\` | ${String(card.value)} | \`${"⭐".repeat(card.star)}\``,
					value: "```" + `[${String(card.rarity).toUpperCase()}] (${String(card.element).toUpperCase()}) ${String(card.type).toUpperCase()} ${String(card.name)}` + "```"
				}
			})

			const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL({ dynamic: true })
			})
			// .setTitle("Your Cards")
			.setFooter({
				text: `Page: ${pageNum}/${maxPage}`
			})
			// .setDescription("```"+description+"```")

			if (fields) Embed.addFields(fields)
			else Embed.setDescription("You have no card")

			return Embed
		}

		const nextBut = (state) => new Discord.MessageButton()
		.setLabel("▶")
		.setCustomId("nextBut")
		.setStyle("PRIMARY")
		.setDisabled(state)

		const nnextBut = (state) => new Discord.MessageButton()
		.setLabel("▶▶")
		.setCustomId("5nextBut")
		.setStyle("PRIMARY")
		.setDisabled(state)

		const prevBut = (state) => new Discord.MessageButton()
		.setLabel("◀")
		.setCustomId("prevBut")
		.setStyle("PRIMARY")
		.setDisabled(state)

		const pprevBut = (state) => new Discord.MessageButton()
		.setLabel("◀◀")
		.setCustomId("5prevBut")
		.setStyle("PRIMARY")
		.setDisabled(state)

		const components = (state) => [new Discord.MessageActionRow().addComponents([
			// pprevBut(state),
			prevBut(state),
			new Discord.MessageButton()
			.setLabel("❌")
			.setCustomId("cancel")
			.setDisabled(state)
			.setStyle("DANGER"),
			nextBut(state),
			// nnextBut(state),
		])]

		let Embed = await genEmbed(cards, pageNum, eachPage)

    const msg = await message.reply({
			// content: description,
			embeds: [Embed],
			components: components(false),
			allowedMentions: {
				repliedUser: false
			}
		})
		
		const filter = (i) => i.user.id === message.author.id

		const msgCol = msg.channel.createMessageComponentCollector({
			filter,
			type: "BUTTON",
			time: 60000
		})

		msgCol.on("collect", async (i) => {
			if (i.customId === 'cancel') return msgCol.stop();

			if (i.customId === 'nextBut') {
				if (pageNum + 1 > maxPage) pageNum = 1
				else pageNum += 1
			}

			// if (i.customId === 'nnextBut') {
			// 	if (pageNum + 5 > maxPage) pageNum = 1
			// 	else pageNum += 5
			// }

			if (i.customId === 'prevBut') {
				if (pageNum - 1 < 1) pageNum = maxPage
				else pageNum -= 1
			}

			// if (i.customId === 'pprevBut') {
			// 	if (pageNum - 5 < 1) pageNum = maxPage
			// 	else pageNum -= 5
			// }

			msgCol.resetTimer()

			const cardsCol = await getArray(pageNum, maxPage, sort)
			Embed = await genEmbed(cardsCol, pageNum, eachPage)
      // console.log(Embed)

			await i.update({
				embeds: [Embed]
			})
		})
		
		msgCol.on("end", (collected, reason) => {
			if (reason === "time")
			return msg.edit({
				// embeds: [Embed.setTitle(`TIMEOUT`)],
				components: components(true),
			});
		})
	},
};

const convertElement = (string) => {
	switch (string) {
		case 'fire': return "🟥";
		case 'water': return "🟦";
		case 'metal': return "⬜";
		case 'earth': return "🟫";
		case 'herb': return "🟩";
		default: "null";
	}
}

// const data = fullCards.map((card, index) => {
		// 	return {
    //     no: (index + 1),
    //     rarity: card.rarity,
    //     star: card.star,
    //     value: card.value,
    //     element: card.element,
    //     type: card.type, 
    //     name: card.name,
    //     id: card.id
    //   }
		// })

    // const data = fullCards.map(({ id, star, element, type, name, rarity, value }, index) => {
		// 	return {
		// 		no: index + 1,
		// 		rarity,
		// 		star,
		// 		value,
		// 		e: element,
		// 		type, 
		// 		name,
		// 		id
		// 	}
		// })

		// console.log(data)

		// const description = stringTable.create(data, {
		// 	// headers: ['no', 'Rarity', 'Star', 'Value', 'Element', 'Type', 'Name', 'ID'],
		// 	capitalizeHeaders: true,
		// 	outerBorder: ' ',
  	// 	innerBorder: '|',
		// 	formatters: {
		// 		// no: function(value, header) { return `${value}` },
    //     rarity: function(value, header) { return `[${value.toUpperCase()}]` },
    //     star: function(value, header) { return `${'★'.repeat(value)}` },
		// 		id: function(value, header) { return `${value.toUpperCase()}` },
		// 		e: function(value, header) { return `${convertElement(value)}` },
		// 		type: function(value, header) { return `${value.toUpperCase()}` },
		// 	}
		// })
		// console.log(fullCards)

    // const description1 = fullCards
    // .map((card, index) => `**No.${String(index + 1)}** | \`ID: ${card.id.toUpperCase()}\`**[${card.rarity.toUpperCase()}]** \`⭐${card.star}\` | **${card.element.toUpperCase()}** ${card.name} | ${card.atk}/${card.def}/${card.spd} `)
    // .join("\n")

    // const description = fullCards
    // .map((card, index) => `**No.${String(index + 1)}**\t|\t**[${card.rarity.toUpperCase()}]**\t\`⭐${card.star}\`\t|\t**${card.element.toUpperCase()}**\t${card.name}\t|\t\`⚔${card.atk}/🛡${card.def}/💨${card.spd}\`\t|\t\`ID: ${card.id.toUpperCase()}\``)
    // .join("\n")

		// await db.find({
		// 	ownerId: user.id,
		// 	// status: "in"
		// },
		// {
		// 	projection: {
		// 		_id: 0
		// 	}
		// }).skip(pageNum * eachPage).limit(eachPage).toArray()