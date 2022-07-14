const Discord = require("discord.js");

module.exports = {
	name: "cases",
	description: "Show SO cases",
	category: "player",
	aliases: ["mycases","listcases"],
	usage: "<@user>",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	mentions: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE, i18n, mentions) {
		const { client } = message;

		
	},
};
