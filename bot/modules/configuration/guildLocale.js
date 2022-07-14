// const { prefix } = require("../../config");
// const defaultPrefix = prefix;
const i18n = require("../util/i18n");

module.exports = {
	get(interaction) {
		return String(
			interaction.client.guildSettings.get(interaction.guild.id).locale.toLowerCase()
		);
	},

	async set(interaction, locale = "en") {
		if (!isNaN(locale) || typeof locale !== "string") return -1;
		const locales = i18n.getLocales();
		if (!locales.includes(locale)) return -1;
		try {
			const { client } = interaction;
			const DB = client.db.collection("guildSettings");
			await DB.updateOne(
				{
					gID: interaction.guild.id,
				},
				{
					$set: {
						// gID: interaction.guild.id,
						locale: String(locale).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);

			let guildSettings = await client.guildSettings.get(interaction.guild.id);

			guildSettings.locale = String(locale).toLowerCase();

			client.guildSettings.set(interaction.guild.id, guildSettings);

			return await client.guildSettings.get(interaction.guild.id).locale
		} catch (e) {
			console.log(e);
		}
	},
};
