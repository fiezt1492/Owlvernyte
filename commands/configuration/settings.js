// const Discord = require("discord.js");
const config = require("../../config");
// const guildPrefix = require("../../modules/configuration/guildPrefix");
const Discord = require("discord.js");
const disableComponent = require("../../modules/util/disableComponent");

module.exports = {
	name: "settings",
	description: "Change guild settings",
	category: "configuration",
	aliases: [],
	// usage: "[options]",
	cooldown: 5,
	// options: ["reset", "set", "get"],
	// args: true,
	ownerOnly: false,
	guildOwner: true,
	permissions: ["ADMINISTRATOR"],
	guildOnly: true,

	async execute(message, args) {
		const Embed = new Discord.MessageEmbed()
			.setTitle("Guild Settings Panel")
			.setDescription(
				`With this Settings Panel, you will able to config your server settings in just one command!`
			)
			.setColor("RANDOM")
			.setAuthor({
				name: message.guild.name,
				iconURL: message.guild.iconURL(),
			});
		// .addField("Prefix", await guildPrefix.get(message));

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("prefixpanel")
					.setDisabled(state)
					.setLabel("Prefix")
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setLabel("Cancel")
					.setStyle("DANGER")
			),
		];

		const msg = await message.reply({
			embeds: [Embed],
			components: components(false),
			allowedMentions: {
				repliedUser: false,
			},
		});

		const filter = (i) => i.user.id === message.author.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", (i) => {
			if (i.customId === "cancel") return msgCol.stop();
			// console.log(i)
			// i.update()
			msgCol.resetTimer();
			// console.log(msgCol)
		});

		msgCol.on("end", (collected) => {
			msg.edit({ components: disableComponent(msg.components) });

			// if (collected)
			// 	return collected.map(async (btn) => {
			// 		if (btn.replied === false)
			// 			await btn.update({
			// 				components: disableComponent(msg.components),
			// 			});
			// 	});
		});
	},
};
