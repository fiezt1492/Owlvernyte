const Discord = require("discord.js");

module.exports = {
	name: "ban",
	description: "ban a user from execute commands of bot",
	category: "private",
	aliases: [],
	usage: "[id]",
	cooldown: 0,
	args: true,
	ownerOnly: true,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;

		const db = await client.db.collection("banlist")
		const id = args.shift()
		const user = await client.users.cache.get(id)
		if (!user) return message.reply({
			content: "Cant find that user!"
		})

		const reason = args.length === 0 ? "None of reason provided" : args.join(" ")
		
		const Embed = new Discord.MessageEmbed()
			.setTitle("⚠ BLACKLIST ⚠")
			.setColor("RED")
			.setDescription(`You have been added to blacklist due to \`${reason}\`\nYou now will not be able to use any function of **${client.user.tag}**`)

		try {
			const exist = await db.findOne({
				id
			})
			if (exist) return message.reply({
				content: `Failed. Already have in database`
			})
			await db.insertOne(
			{
				id,
				reason,
				timestamp: Date.now()
			})

			client.banlist.push(id)
		} catch (e) {
			console.log("[BANLIST] " + e.message + "\n" + e)
		} 

		user.send({
			embeds: [Embed]
		})
		message.reply({
			content: `Done`
		})
		
	},
};
