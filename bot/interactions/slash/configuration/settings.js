// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Config your guild"),
	once: true,
	guildOwner: true,
	// maintain: true,
	category: "configuration",
	async execute(interaction, guildSettings, Player, ONCE, i18n) {
		const { client, guild } = interaction;
		// console.log(guildSettings);

		// console.log(interaction);
		const Embed = require("../../../constants/embeds/settings")(
			guild.name,
			guild.iconURL(),
			guildSettings
		);

		const components = require("../../../constants/buttons/settings");

		await interaction.reply({
			// content: "alo"
			embeds: Embed,
			components: components(false),
			ephemeral: true,
		});

		const msg = await interaction.fetchReply();

		ONCE.set(interaction.user.id, {
			name: this.data.name,
			gID: msg.guild.id,
			cID: msg.channel.id,
			mID: msg.id,
			mURL: msg.url,
		});

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

		msgCol.on("end", (collected, reason) => {
			ONCE.delete(interaction.user.id);
			if (reason === "time")
				msg.edit({ components: client.disableComponent(msg) });

			// if (collected)
			// 	return collected.map(async (btn) => {
			// 		if (btn.replied === false)
			// 			await btn.update({
			// 				components: client.disableComponent(msg.components),
			// 			});
			// 	});
		});
	},
};
