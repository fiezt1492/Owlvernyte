const config = require("../../../config");

module.exports = {
	id: "ephetrue",
	filter: "author",

	async execute(interaction) {
		const { client, message, guild } = interaction;

		client.ephemeral.set(interaction, true).then((e) => {
			if (message.editable)
				message.edit({
					embeds: require("../../../constants/embeds/ephepanel")(
						guild.name,
						guild.iconURL(),
						interaction
					),
				});

			interaction.reply({
				content: `${e ? "Enabled" : "Disabled"} ephemeral!`,
				ephemeral: true,
			});
		});
	},
};
