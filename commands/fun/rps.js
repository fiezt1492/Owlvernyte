const Discord = require("discord.js");
const guildPrefix = require("../../modules/configuration/guildPrefix");
module.exports = {
	name: "rps",
	description: "Play rock, paper, scissors",
	category: "fun",
	aliases: ["rockpaperscissors"],
	usage: "[choices / mention a user]",
	options: ["r", "p", "s", "@user"],
	cooldown: 5,
	args: true,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;

		const member = await message.mentions.users.first();

		let selections = ["rock", "paper", "scissors", "r", "p", "s"];

		let choices = ["rock", "paper", "scissors"];

		if (!member) {
			let u = String(args.shift()).toLowerCase();

			if (selections.includes(u)) {
				if (selections.indexOf(u) > 2)
					u = selections[selections.indexOf(u) - 3];

				let c = choices[Math.floor(Math.random() * choices.length)];

				let result = RPS(u, c);
				switch (result) {
					case 0:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** TIE :/`
						);
					case 1:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** ${message.author.username} won!`
						);
					case 2:
						return message.reply(
							`**[BOT]** choice: *${c}* \`=>\` **[RESULT]** ${message.author.username} lose!`
						);
					default:
						return message.reply(`**[ERROR RPS]** Code: ${result}`);
				}
			} else {
				return message.reply(
					`**[ERROR]** Invalid input. Type \`${await guildPrefix.get(
						message
					)}help ${this.name}\` for more infomation.`
				);
			}
		}
	},
};

const RPS = (player1, player2) => {
	let selections = ["rock", "paper", "scissors", "r", "p", "s"];

	if (!selections.includes(player1) || !selections.includes(player2)) return -1;

	if (selections.includes(player1) && selections.indexOf(player1) > 2)
		player1 = selections[selections.indexOf(player1) - 3];
	if (selections.includes(player2) && selections.indexOf(player2) > 2)
		player2 = selections[selections.indexOf(player2) - 3];

	if (player1 === player2) return 0;

	if (
		(player1 == "rock" && player2 == "scissors") ||
		(player1 == "paper" && player2 == "rock") ||
		(player1 == "scissors" && player2 == "paper")
	)
		return 1;

	if (
		(player1 == "paper" && player2 == "scissors") ||
		(player1 == "rock" && player2 == "paper") ||
		(player1 == "scissors" && player2 == "rock")
	)
		return 2;

	return -2;
};
