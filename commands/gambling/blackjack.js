const Discord = require("discord.js");
const blackjack = require("../../modules/gambling/Blackjack/index");

module.exports = {
	name: "blackjack",
	description: "Playing Vietnamese Blackjack",
	category: "gambling",
	aliases: ["bj"],
	usage: "",
	permissions: "SEND_MESSAGES",
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;
		await blackjack(client, message);
	},
};
