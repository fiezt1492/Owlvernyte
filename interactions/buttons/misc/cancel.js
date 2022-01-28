// const config = require("../../../config");
// const guildPrefix = require("../../../modules/configuration/guildPrefix");
// const Discord = require("discord.js");
// const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	id: "cancel",
	filter: "author",

	async execute(interaction) {
		const { client } = interaction;
		// console.log(interaction)
		await interaction.update({
			// content: "This was a reply from button handler!",
			components: client.disableComponent(interaction.message.components),
		});
		return;
	},
};
