const Discord = require("discord.js");
// const shortNumber = require("short-number");
const { millify } = require("millify");

module.exports = {
	name: "balance",
	description: "balance your backpack",
	category: "economy",
	aliases: ["bal"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client } = message;

		const player = await Player.get();
		const { owlet, nyteGem, bank } = player;

		const string = {
			owlet: millify(owlet, {
				precision: 3,
			}),
			nyteGem: millify(nyteGem, {
				precision: 3,
			}),
			bank: millify(bank, {
				precision: 3,
			}),
		};

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(message.author.tag)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.addFields([
				{
					name: "Owlet",
					value: `${string.owlet}`,
					inline: true,
				},
				{
					name: "Nyte Gem",
					value: `${string.nyteGem}`,
					inline: true,
				},
				{
					name: "Bank",
					value: `${string.bank}`,
					inline: true,
				},
			]);

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
