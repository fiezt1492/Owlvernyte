const config = require("../../../config");
const guildPrefix = require("../../../modules/configuration/guildPrefix");
const Discord = require("discord.js");
const disableComponent = require("../../../modules/util/disableComponent");

module.exports = {
	id: "settings",
	filter: "author",

	async execute(interaction) {
		const Embed = new Discord.MessageEmbed()
			.setTitle("Guild Settings Panel")
			.setColor("RANDOM")
			.setAuthor({ name: interaction.message.guild.name, iconURL: interaction.message.guild.iconURL() })
			.addField("Prefix", await guildPrefix.get(interaction.message));

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

        await interaction.update({
            embeds: [Embed],
            components: components(false)
        })
	},
};
