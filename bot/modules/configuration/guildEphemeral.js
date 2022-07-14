// const { prefix } = require("../../config");
// const defaultPrefix = prefix;

module.exports = {
	get(interaction) {
		return Boolean(
			interaction.client.guildSettings.get(interaction.guild.id).ephemeral
		);
	},

	async set(interaction, state = true) {
		if (state !== true && state !== false) return -1;
		try {
			const { client } = interaction;
			const DB = client.db.collection("guildSettings");
			await DB.updateOne(
				{
					gID: interaction.guild.id,
				},
				{
					$set: {
						// gID: message.guild.id,
						ephemeral: Boolean(state),
					},
				},
				{
					upsert: true,
				}
			);

			let guildSettings = await client.guildSettings.get(interaction.guild.id);

			guildSettings.ephemeral = Boolean(state);

			client.guildSettings.set(interaction.guild.id, guildSettings);

			return await client.guildSettings.get(interaction.guild.id).ephemeral;
		} catch (e) {
			console.log(e);
		}
	},
};
