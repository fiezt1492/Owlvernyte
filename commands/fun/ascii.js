const Discord = require("discord.js");
const figlet = require("figlet");
const { promisify } = require("util");
const figletAsync = promisify(figlet);

module.exports = {
	name: "ascii",

	/** You need to uncomment below properties if you need them. */
	description: "Create ascii art",
	category: "fun",
	usage: "[text]",
	args: true,
	permissions: "SEND_MESSAGES",
	guildOnly: true,

	async execute(message, args) {
		// const { client } = message;

		let Content = args.join(" ");

		if (Content.length > 20)
			return message.reply(`Please make it shorter! | Limit: 20 characters`);

		let Result = await figletAsync(Content);

		let embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription("```" + Result + "```");

		return message.reply({
			embeds: [embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
