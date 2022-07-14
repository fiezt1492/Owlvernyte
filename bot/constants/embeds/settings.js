const Discord = require("discord.js");

module.exports = (guildName, guildIconURL, guildSettings) => {
	const Embed = new Discord.MessageEmbed()
		.setTitle("Guild Settings Panel")
		.setColor("RANDOM")
		.setDescription(
			`With this Settings Panel, you will able to config your server settings in just one command!`
		)
		.addField(
			"Current Settings",
			Object.keys(guildSettings)
				.map(
					(key) =>
						`**\`${key.toUpperCase()}\`**: \`${guildSettings[key]
							.toString()
							.toUpperCase()}\``
				)
				.join("\n")
		)
		.setAuthor({
			name: guildName,
			iconURL: guildIconURL,
		});

	return [Embed];
};
