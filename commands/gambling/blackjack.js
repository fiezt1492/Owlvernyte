const Discord = require("discord.js");
const blackjack = require("../../modules/gambling/Blackjack/index");

module.exports = {
	name: "blackjack",
	description: "Playing Vietnamese Blackjack",
	category: "gambling",
	aliases: ["bj"],
	args: true,
	usage: "[owlet]",
	permissions: "SEND_MESSAGES",

	async execute(message, args, guildSettings, Player) {
		const { client } = message;
		const bet = Math.round(Number(args[0]))
		if (isNaN(bet) || bet <= 0) return message.reply({
			content: `Please provide a positive number!`
		})
		const player = await Player.get()
		if (bet > player.owlet) return message.reply({
			content: `You dont have enough owlet!`
		})
		await blackjack(client, message, Player, bet);
	},
};
