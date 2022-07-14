const Discord = require("discord.js");

module.exports = {
	name: "open",
	description: "Open a case",
	category: "player",
	aliases: ["opencase"],
	usage: "[case id]",
	cooldown: 5,
	args: true,
	ownerOnly: false,
	once: false,
	mentions: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE, i18n, mentions) {
		const { client } = message;
		await client.cases.set("101", message.author.id, 1)
	},
};
