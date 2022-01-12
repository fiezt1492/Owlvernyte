const Discord = require('discord.js')
const getUserBannerUrl = require("../../../modules/info/getUserBannerUrl")

module.exports = {
	data: {
		name: "Banner",
		type: 2, // 2 is for user context menus
	},

	async execute(interaction) {

		const { client } = interaction;
		
		const user = await client.users.fetch(interaction.targetId)
		const banner = await getUserBannerUrl(client, user.id)

		if (!banner) return await interaction.reply({
			content: `**[ERROR]** <@!${user.id}> does not have a banner`,
			ephemeral: true
		});

		const Embed = new Discord.MessageEmbed()
		.setAuthor(user.username + "#" + user.discriminator + "'s banner", user.displayAvatarURL)
		.setImage(banner)

		await interaction.reply({
			embeds: [Embed],
			// components: [ROW] ,
			// ephemeral: true
		});
		return;
	},
};
