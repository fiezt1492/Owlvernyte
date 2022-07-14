const Discord = require("discord.js");
const stringTable = require("string-table")

module.exports = {
	name: "listbasecards",
	description: "",
	category: "private",
	aliases: ["listbcd"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: true,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
		const db = await client.db.collection("baseCards")
		let pageNumber = Math.round(Math.abs(Number(args[0]))) || 1
		const nPerPage = 10
		const baseCards = await db.find(
      {}, 
      { 
			  projection:{ 
					_id: 0 ,
					iconURL: 0
				} 
			})
			.skip(pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0)
			.limit(nPerPage)
			.toArray()
			
		if (baseCards.length <= 0) return message.reply({
			content: `Page ${pageNumber} Empty`
		})

		let table = stringTable.create(baseCards)
		
		const Embed = new Discord.MessageEmbed()
		.setDescription("```"+table+"```")
		.setFooter({
			text: `Page ${pageNumber} | ${baseCards.length} cards`
		})

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				userReplied: false
			}
		})

	},
};
