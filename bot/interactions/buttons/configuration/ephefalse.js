// let already = new Set();

module.exports = {
	id: "ephefalse",
	filter: "author",

	async execute(interaction, guildSettings, i18n, already) {
		const { client, message, guild } = interaction;

		client.ephemeral.set(interaction, false).then((e) => {
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
