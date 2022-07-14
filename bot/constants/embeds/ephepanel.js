const Discord = require("discord.js");

module.exports = (guildName, guildIconURL, interaction) => {
	const Embed = new Discord.MessageEmbed()
		.setTitle("Guild Ephemeral Setting")
		.setColor("RANDOM")
		.setDescription(
			`This setting will make your interaction execute ephemeral (invisible) or not.`
		)
		.addField(
			"Status",
			interaction.client.ephemeral.get(interaction)
				? `\`Enabled\``
				: `\`Disabled\``
		)
		.setAuthor({
			name: guildName,
			iconURL: guildIconURL,
		});

	return [Embed];
};
