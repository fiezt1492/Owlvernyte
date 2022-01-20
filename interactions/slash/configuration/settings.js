// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Config your guild"),
	// .setDefaultPermission(true),
	// .addStringOption((option) =>
	// 	option
	// 		.setName("subreddit")
	// 		.setDescription("Provide a subreddit to get memes in it.")
	// 		.setRequired(false)
	// ),
	guildOwner: true,
	permissions: ["ADMINISTRATOR"],

	async execute(interaction) {
		const { client } = interaction;

		// console.log(interaction);
		const Embed = new Discord.MessageEmbed()
			.setTitle("Guild Settings Panel")
			.setDescription(
				`With this Settings Panel, you will able to config your server settings in just one command!`
			)
			.setColor("RANDOM")
			.setAuthor({
				name: interaction.member.guild.name,
				iconURL: interaction.member.guild.iconURL(),
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

		await interaction.reply({
			// content: "alo"
			embeds: [Embed],
			components: components(false),
		});

        const msg = await interaction.fetchReply()
        const filter = (i) => i.user.id === interaction.user.id;

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
