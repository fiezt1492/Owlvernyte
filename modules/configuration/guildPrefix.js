const { prefix } = require("../../config");
const defaultPrefix = prefix;

module.exports = {
	async get(message) {
		try {
			const { client } = message;
			const DB = client.db.collection("guildSettings");
			const guild = await DB.findOne(
				{ gID: message.guild.id },
				{
					prefix: 1,
				}
			);
			return String(guild ? guild.prefix : prefix).toLowerCase();

		} catch (e) {
			console.log(e);
		}
	},

	async set(message, prefix = defaultPrefix) {
		try {
			const { client } = message;
			const DB = client.db.collection("guildSettings");
			await DB.updateOne(
				{
					gID: message.guild.id,
				},
				{
					$set: {
						gID: message.guild.id,
						prefix: String(prefix).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);
		} catch (e) {
			console.log(e);
		}
	},
};
