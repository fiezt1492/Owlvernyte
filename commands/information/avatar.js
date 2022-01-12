const Discord = require("discord.js")

module.exports = {
	name: "avatar",

	/** You need to uncomment below properties if you need them. */
	description: 'Get user avatar',
	category: 'information',
	usage: '<mention>',
	permissions: 'SEND_MESSAGES',
	guildOnly: true,

	execute(message, args) {
		const { client } = message

		const Embed = new Discord.MessageEmbed()
		.setTitle("🏓 Pong!")
		.setColor("RANDOM")
		.addField("API Latency",Math.round(client.ws.ping) + "ms",true)
		.addField("Client Latency",Math.round(Date.now() - message.createdTimestamp) + "ms",true)

		return message.reply({ embeds: [Embed] });
	},
};
