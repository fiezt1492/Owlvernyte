const Discord = require("discord.js");
module.exports = {
	name: "test",
	description: "this is a test command",
	category: "misc",
	// aliases: [""],
	usage: "",
	// cooldown: 5,
	// args: false,
	ownerOnly: true,
	// permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client } = message;

		// console.log(message.disableComponent(false));

		const components = [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("vl")
					.setStyle("SUCCESS")
					.setLabel("vl")
			),
		];

		const m = await message.channel.send({
			content: "hai`"
		})

		const msg = await message.channel.send({
			content: "vl",
			components: components
		})

		const msgCol = msg.createMessageComponentCollector({
			componentType: "BUTTON",
			time: 5000,
		});

		msgCol.on("collect", () => {
			msgCol.resetTimer();
			console.log(client.disableComponent(m))
		});

		msgCol.on("end", () => {
			// console(m.disableComponent())
			msg.edit({ components: client.disableComponent(m) });
		});
		// msg.edit({
		// 	components: message.disableComponent()
		// })
	},
};
