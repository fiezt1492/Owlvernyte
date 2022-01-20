const Discord = require("discord.js");

module.exports = {
	name: "hilo",
	description: "Tài xỉu - High Low - Sic bo is arrived",
	category: "gambling",
	aliases: ["sicbo","taixiu","highlow"],
	usage: "",
	permissions: "SEND_MESSAGES",
    maintain: true,
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;

        return message.reply({
            content: `Its hilo or tài xỉu?`,
			// embeds: [Embed],
			// components: components(false),
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
